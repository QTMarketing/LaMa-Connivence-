import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { AdminSection } from '@/lib/db/schema';

import {
  ADMIN_SESSION_COOKIE,
  canAccessSection,
  verifySessionToken,
  type AdminSession,
} from './session';

/** Reads and verifies the admin session cookie. Null when not signed in. */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

/**
 * Guard for route handlers. Returns the session, or a NextResponse to return
 * as-is. proxy.ts already blocks admin pages, but every write path re-checks
 * here — the proxy does not run for all invocation paths and a client-side
 * check is not a check at all.
 *
 *   const guard = await requireSection('careers');
 *   if (guard instanceof NextResponse) return guard;
 */
export async function requireSection(
  section: AdminSection,
): Promise<AdminSession | NextResponse> {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }

  if (!canAccessSection(session, section)) {
    return NextResponse.json(
      { error: `You do not have access to ${section}.` },
      { status: 403 },
    );
  }

  return session;
}

/** Any signed-in admin, with no section requirement. */
export async function requireAdmin(): Promise<AdminSession | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  }
  return session;
}
