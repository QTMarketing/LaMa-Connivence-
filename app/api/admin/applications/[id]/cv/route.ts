import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { careersBlobAuth } from '@/lib/careers/blobAuth';
import { safeFilename } from '@/lib/careers/upload';
import { getDb } from '@/lib/db/client';
import { applications } from '@/lib/db/schema';

/**
 * Streams an applicant's CV to a signed-in admin.
 *
 * Private Blob URLs need store credentials. Legacy public URLs are still
 * fetched directly. The response is inline so the browser PDF viewer opens
 * first; that viewer has its own download control.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  const [application] = await getDb()
    .select({
      cvBlobUrl: applications.cvBlobUrl,
      cvFilename: applications.cvFilename,
      cvContentType: applications.cvContentType,
    })
    .from(applications)
    .where(eq(applications.id, id))
    .limit(1);

  if (!application?.cvBlobUrl) {
    return NextResponse.json({ error: 'No CV on file.' }, { status: 404 });
  }

  let stream: ReadableStream<Uint8Array> | null = null;
  try {
    const url = new URL(application.cvBlobUrl);
    if (
      url.protocol !== 'https:' ||
      !/^[a-z0-9-]+\.(?:private|public)\.blob\.vercel-storage\.com$/.test(
        url.hostname,
      )
    ) {
      throw new Error('Unexpected CV storage host');
    }

    if (url.hostname.includes('.private.blob.')) {
      const blobAuth = careersBlobAuth();
      if (!blobAuth) {
        throw new Error('Private CV storage credentials are not configured');
      }
      const blob = await get(application.cvBlobUrl, {
        access: 'private',
        ...blobAuth,
      });
      if (blob?.statusCode === 200) stream = blob.stream;
    } else {
      const upstream = await fetch(application.cvBlobUrl, {
        cache: 'no-store',
        redirect: 'error',
      });
      if (upstream.ok) stream = upstream.body;
    }

    if (!stream) throw new Error('CV storage returned no file');
  } catch (error) {
    console.error('[cv-download] Could not retrieve the file:', error);
    return NextResponse.json(
      { error: 'Could not retrieve the file.' },
      { status: 502 },
    );
  }

  const filename = safeFilename(application.cvFilename ?? 'cv');
  const contentType = application.cvContentType ?? 'application/pdf';

  return new NextResponse(stream, {
    headers: {
      'Content-Type': contentType,
      // Inline opens the browser PDF viewer; download lives in that viewer.
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
