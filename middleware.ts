import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_SESSION_COOKIE = "lama_admin_session";

async function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (but allow access to the login page itself)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const secret = await getJwtSecret();
    if (!secret) {
      console.warn(
        "[middleware] ADMIN_JWT_SECRET is not set; denying admin access.",
      );
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    if (!token) {
      console.info("[middleware] Missing admin session cookie; redirecting.");
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const result = await jwtVerify(token, secret);
      if (result.payload?.role !== "admin") {
        console.warn(
          "[middleware] Invalid admin session payload; redirecting to login.",
        );
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
    } catch (error) {
      console.warn("[middleware] Failed to verify admin session:", error);
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

