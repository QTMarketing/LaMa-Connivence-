import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { homePathForSession } from '@/lib/auth/home';
import {
  ADMIN_SESSION_COOKIE,
  canAccessSection,
  getJwtSecret,
  sectionForPath,
  verifySessionToken,
} from '@/lib/auth/session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  if (!getJwtSecret()) {
    console.warn('[proxy] ADMIN_JWT_SECRET is not set; denying admin access.');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const session = await verifySessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
  );

  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const section = sectionForPath(pathname);
  if (section && !canAccessSection(session, section)) {
    const destination = new URL(homePathForSession(session), request.url);
    destination.searchParams.set('denied', section);
    return NextResponse.redirect(destination);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
