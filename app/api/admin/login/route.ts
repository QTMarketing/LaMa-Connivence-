import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

// In-memory rate limiting per IP for this runtime
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

type AttemptInfo = { count: number; firstAttempt: number };
const attempts = new Map<string, AttemptInfo>();

const ADMIN_SESSION_COOKIE = "lama_admin_session";

function getClientIp(request: Request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

async function getJwtSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_JWT_SECRET is not set. Please configure it in your environment.",
    );
  }
  return new TextEncoder().encode(secret);
}

async function createSessionToken() {
  const secret = await getJwtSecret();
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 60 * 8; // 8 hours

  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .setSubject("lama-admin")
    .sign(secret);
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const now = Date.now();
    const info = attempts.get(ip);

    if (info && now - info.firstAttempt < WINDOW_MS && info.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json().catch(() => ({}));
    const { password } = body as { password?: string };

    if (!password) {
      return NextResponse.json(
        { error: "Password is required." },
        { status: 400 },
      );
    }

    const plainEnvPassword = process.env.ADMIN_PASSWORD;
    const hashedPassword = process.env.ADMIN_PASSWORD_HASH;

    if (!plainEnvPassword && !hashedPassword) {
      console.warn(
        "[admin-login] ADMIN_PASSWORD or ADMIN_PASSWORD_HASH is not configured.",
      );
      return NextResponse.json(
        { error: "Admin login is not configured. Please contact the site owner." },
        { status: 500 },
      );
    }

    let valid = false;

    if (hashedPassword) {
      // Preferred: bcrypt hash comparison
      try {
        valid = await bcrypt.compare(password, hashedPassword);
      } catch (e) {
        console.error("[admin-login] Error comparing bcrypt hash:", e);
      }
    } else if (plainEnvPassword) {
      // Fallback: constant-time compare for plain env password
      if (password.length === plainEnvPassword.length) {
        let mismatch = 0;
        for (let i = 0; i < password.length; i++) {
          mismatch |= password.charCodeAt(i) ^ plainEnvPassword.charCodeAt(i);
        }
        valid = mismatch === 0;
      }
    }

    const updated: AttemptInfo = info
      ? { count: (info.count || 0) + 1, firstAttempt: info.firstAttempt }
      : { count: 1, firstAttempt: now };
    attempts.set(ip, updated);

    if (!valid) {
      console.warn("[admin-login] Failed login attempt from IP:", ip);
      return NextResponse.json(
        { error: "Incorrect password. Please try again." },
        { status: 401 },
      );
    }

    // Successful login – reset attempts for this IP
    attempts.delete(ip);

    const token = await createSessionToken();

    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    console.info("[admin-login] Successful admin login from IP:", ip);

    return response;
  } catch (error) {
    console.error("[admin-login] Unexpected error:", error);
    return NextResponse.json(
      { error: "Unable to login at this time." },
      { status: 500 },
    );
  }
}

// Utility used by server components/middleware to verify the admin session cookie.
export async function verifyAdminSession() {
  // In Next.js App Router, cookies() can be async in some runtimes, so we await it.
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;

  try {
    const secret = await getJwtSecret();
    const result = await jwtVerify(token, secret);
    return result.payload?.role === "admin";
  } catch {
    return false;
  }
}

