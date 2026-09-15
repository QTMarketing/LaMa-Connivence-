import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { safeFilename } from '@/lib/careers/upload';
import { getDb } from '@/lib/db/client';
import { applications } from '@/lib/db/schema';

/**
 * Streams an applicant's CV to a signed-in admin.
 *
 * Vercel Blob has no private ACL: the stored URL is unguessable but anyone
 * holding it can read the file. So the URL stays server-side and the bytes are
 * proxied through here, behind the careers permission.
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

  const upstream = await fetch(application.cvBlobUrl);
  if (!upstream.ok || !upstream.body) {
    console.error(
      `[cv-download] Blob fetch failed for application ${id}: ${upstream.status}`,
    );
    return NextResponse.json(
      { error: 'Could not retrieve the file.' },
      { status: 502 },
    );
  }

  const filename = safeFilename(application.cvFilename ?? 'cv');

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type':
        application.cvContentType ?? 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename}"`,
      // Never let a CV sit in a shared cache.
      'Cache-Control': 'private, no-store',
    },
  });
}
