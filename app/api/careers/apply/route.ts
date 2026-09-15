import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { eq } from 'drizzle-orm';

import { sendApplicationNotification } from '@/lib/careers/email';
import { safeFilename, validateCv } from '@/lib/careers/upload';
import { getDb, isDatabaseConfigured } from '@/lib/db/client';
import { applications, jobs } from '@/lib/db/schema';

// Spam guard. In-memory, so it is per-instance rather than global, which is
// enough to blunt a single abusive client.
const MAX_SUBMISSIONS = 5;
const WINDOW_MS = 60 * 60 * 1000;
const submissions = new Map<string, { count: number; firstAt: number }>();

function getClientIp(request: Request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(ip: string) {
  const entry = submissions.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAt >= WINDOW_MS) {
    submissions.delete(ip);
    return false;
  }
  return entry.count >= MAX_SUBMISSIONS;
}

function recordSubmission(ip: string) {
  const entry = submissions.get(ip);
  const now = Date.now();
  submissions.set(
    ip,
    entry && now - entry.firstAt < WINDOW_MS
      ? { count: entry.count + 1, firstAt: entry.firstAt }
      : { count: 1, firstAt: now },
  );
}

function readString(form: FormData, key: string, max: number): string {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many applications from this connection. Try again later.' },
      { status: 429 },
    );
  }

  if (!isDatabaseConfigured()) {
    console.error('[careers-apply] DATABASE_URL is not set; cannot accept applications.');
    return NextResponse.json(
      {
        error:
          'Applications are temporarily unavailable. Please try again shortly.',
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Could not read the submitted form.' },
      { status: 400 },
    );
  }

  const name = readString(form, 'name', 120);
  const email = readString(form, 'email', 200).toLowerCase();
  const phone = readString(form, 'phone', 40);
  const coverLetter = readString(form, 'coverLetter', 4000);
  const jobId = readString(form, 'jobId', 64) || null;
  let jobTitle = readString(form, 'jobTitle', 200) || 'General application';

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: 'Name, email and phone are all required.' },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: 'Please enter a valid email address.' },
      { status: 400 },
    );
  }

  // Validate the CV before writing anything, so a bad file is a clean rejection.
  const cv = form.get('cv');
  const hasCv = cv instanceof File && cv.size > 0;
  let cvContentType: string | undefined;

  if (hasCv) {
    const result = await validateCv(cv);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    cvContentType = result.contentType;
  }

  const db = getDb();

  // Trust the server's copy of the title, not the client's, and confirm the
  // posting is actually open before accepting an application for it.
  let resolvedJobId: string | null = null;
  if (jobId) {
    const [job] = await db
      .select({ id: jobs.id, title: jobs.title, status: jobs.status })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job || job.status !== 'open') {
      return NextResponse.json(
        { error: 'That role is no longer accepting applications.' },
        { status: 409 },
      );
    }

    resolvedJobId = job.id;
    jobTitle = job.title;
  }

  // The row lands first. Everything after this point can fail without losing
  // the application.
  let applicationId: string;
  try {
    const [row] = await db
      .insert(applications)
      .values({
        jobId: resolvedJobId,
        jobTitle,
        name,
        email,
        phone,
        coverLetter: coverLetter || null,
        cvFilename: hasCv ? safeFilename(cv.name) : null,
        cvContentType: cvContentType ?? null,
        cvSize: hasCv ? cv.size : null,
      })
      .returning({ id: applications.id });

    applicationId = row.id;
  } catch (error) {
    console.error('[careers-apply] Could not save the application:', error);
    return NextResponse.json(
      { error: 'We could not save your application. Please try again.' },
      { status: 500 },
    );
  }

  recordSubmission(ip);

  // Upload second, then attach the URL to the saved row.
  let storedFilename: string | null = hasCv ? safeFilename(cv.name) : null;
  if (hasCv) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error(
        `[careers-apply] BLOB_READ_WRITE_TOKEN is unset; application ${applicationId} saved without its CV.`,
      );
      storedFilename = null;
    } else {
      try {
        const blob = await put(
          `careers/${applicationId}/${safeFilename(cv.name)}`,
          cv,
          {
            access: 'public',
            contentType: cvContentType,
            // Keep the path exactly as given so the gated download can find it.
            addRandomSuffix: false,
          },
        );

        await db
          .update(applications)
          .set({ cvBlobUrl: blob.url, updatedAt: new Date() })
          .where(eq(applications.id, applicationId));
      } catch (error) {
        console.error(
          `[careers-apply] CV upload failed for application ${applicationId}; the application itself was saved:`,
          error,
        );
        storedFilename = null;
      }
    }
  }

  // Email last. A failure here is logged, never surfaced as a lost application.
  await sendApplicationNotification({
    applicationId,
    jobTitle,
    name,
    email,
    phone,
    coverLetter,
    cvFilename: storedFilename,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
