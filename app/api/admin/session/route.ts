import { NextResponse } from 'next/server';

import { getSession } from '@/lib/auth/server';
import { ADMIN_SECTIONS } from '@/lib/db/schema';

/** Current admin session, for UI that needs to know what to render. */
export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ signedIn: false }, { status: 200 });
  }

  return NextResponse.json({
    signedIn: true,
    name: session.name,
    email: session.email,
    role: session.role,
    sections:
      session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions,
  });
}
