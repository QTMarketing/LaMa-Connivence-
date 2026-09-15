import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq, sql } from 'drizzle-orm';

import {
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  type AdminSession,
} from '@/lib/auth/session';
import { getDb, isDatabaseConfigured } from '@/lib/db/client';
import { users, type AdminSection } from '@/lib/db/schema';

// In-memory rate limiting per IP for this runtime.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

type AttemptInfo = { count: number; firstAttempt: number };
const attempts = new Map<string, AttemptInfo>();

/**
 * Compared against when no user matches, so a wrong email costs the same as a
 * wrong password and the response time cannot be used to enumerate accounts.
 */
const DECOY_HASH = '$2a$10$AwuDBQV/5pWTjmhDtz.3ye.TPcG2F07uCW3caMFm7M6nI/pZuqKpC';

const GENERIC_FAILURE = 'Incorrect email or password. Please try again.';

function getClientIp(request: Request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function recordAttempt(ip: string) {
  const now = Date.now();
  const info = attempts.get(ip);
  attempts.set(
    ip,
    info && now - info.firstAttempt < WINDOW_MS
      ? { count: info.count + 1, firstAttempt: info.firstAttempt }
      : { count: 1, firstAttempt: now },
  );
}

function isRateLimited(ip: string) {
  const info = attempts.get(ip);
  if (!info) return false;
  if (Date.now() - info.firstAttempt >= WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return info.count >= MAX_ATTEMPTS;
}

/** Constant-time string compare for the bootstrap password path. */
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function countUsers(): Promise<number | null> {
  if (!isDatabaseConfigured()) return null;
  try {
    const [row] = await getDb()
      .select({ count: sql<number>`count(*)::int` })
      .from(users);
    return row?.count ?? 0;
  } catch (error) {
    console.error('[admin-login] Could not count users:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as {
      email?: string;
      password?: string;
    };
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required.' },
        { status: 400 },
      );
    }

    const userCount = await countUsers();
    // Real accounts take over as soon as any exist. Until then (no database
    // configured, or an empty users table) the shared password is the only way
    // in, so the panel is never bricked.
    const useAccounts = userCount !== null && userCount > 0;

    let session: AdminSession | null = null;

    if (useAccounts) {
      if (!email) {
        recordAttempt(ip);
        return NextResponse.json(
          { error: 'Email is required.' },
          { status: 400 },
        );
      }

      const [user] = await getDb()
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const matches = await bcrypt.compare(
        password,
        user?.passwordHash ?? DECOY_HASH,
      );

      if (user && matches) {
        session = {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          permissions: (user.permissions ?? []) as AdminSection[],
        };
      }
    } else {
      const bootstrapPassword = process.env.ADMIN_PASSWORD;
      if (!bootstrapPassword) {
        console.warn('[admin-login] No users seeded and ADMIN_PASSWORD is unset.');
        return NextResponse.json(
          {
            error:
              'Admin login is not configured. Please contact the site owner.',
          },
          { status: 500 },
        );
      }

      if (safeEqual(password, bootstrapPassword)) {
        session = {
          userId: 'bootstrap',
          email: 'bootstrap@local',
          name: 'Bootstrap Owner',
          role: 'owner',
          permissions: [],
        };
      }
    }

    if (!session) {
      recordAttempt(ip);
      console.warn('[admin-login] Failed login attempt from IP:', ip);
      return NextResponse.json({ error: GENERIC_FAILURE }, { status: 401 });
    }

    attempts.delete(ip);

    const token = await createSessionToken(session);
    const response = NextResponse.json({
      success: true,
      user: {
        name: session.name,
        email: session.email,
        role: session.role,
        permissions: session.permissions,
      },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE_SECONDS,
    });

    console.info('[admin-login] Successful login:', session.email);
    return response;
  } catch (error) {
    console.error('[admin-login] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Unable to login at this time.' },
      { status: 500 },
    );
  }
}
