import { SignJWT, jwtVerify } from 'jose';

import type { AdminSection } from '@/lib/db/schema';

export const ADMIN_SESSION_COOKIE = 'lama_admin_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

export type AdminRole = 'owner' | 'staff';

export interface AdminSession {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  /** Section slugs. Empty for an owner, who is allowed everything regardless. */
  permissions: AdminSection[];
}

/**
 * Edge-safe on purpose: jose only, no next/headers and no database import, so
 * proxy.ts can verify a session without pulling the Node runtime in.
 */
export function getJwtSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: AdminSession): Promise<string> {
  const secret = getJwtSecret();
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not set.');
  }

  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({
    email: session.email,
    name: session.name,
    role: session.role,
    permissions: session.permissions,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_MAX_AGE_SECONDS)
    .setSubject(session.userId)
    .sign(secret);
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<AdminSession | null> {
  if (!token) return null;

  const secret = getJwtSecret();
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role;
    if (role !== 'owner' && role !== 'staff') return null;
    if (typeof payload.sub !== 'string') return null;

    return {
      userId: payload.sub,
      email: typeof payload.email === 'string' ? payload.email : '',
      name: typeof payload.name === 'string' ? payload.name : '',
      role,
      permissions: Array.isArray(payload.permissions)
        ? (payload.permissions as AdminSection[])
        : [],
    };
  } catch {
    return null;
  }
}

/** Owners get everything; staff get exactly what their permissions list names. */
export function canAccessSection(
  session: AdminSession | null,
  section: AdminSection,
): boolean {
  if (!session) return false;
  if (session.role === 'owner') return true;
  return session.permissions.includes(section);
}

/**
 * Maps an /admin pathname to the section guarding it. Returns null for routes
 * any signed-in admin may see (the dashboard shell itself).
 */
export function sectionForPath(pathname: string): AdminSection | null {
  if (pathname.startsWith('/admin/careers')) return 'careers';
  if (pathname.startsWith('/admin/deals')) return 'deals';
  if (pathname.startsWith('/admin/drinks')) return 'drinks';
  if (pathname.startsWith('/admin/stores')) return 'stores';
  if (pathname.startsWith('/admin/blog')) return 'blog';
  if (pathname.startsWith('/admin/products')) return 'products';
  if (pathname.startsWith('/admin/settings')) return 'settings';
  return null;
}
