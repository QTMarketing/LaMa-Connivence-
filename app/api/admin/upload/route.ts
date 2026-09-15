import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

import { requireAdmin } from '@/lib/auth/server';
import { validateImage } from '@/lib/content/imageUpload';
import { ADMIN_SECTIONS, type AdminSection } from '@/lib/db/schema';

/**
 * Shared image upload for admin sections. Returns the public Blob URL, which is
 * fine here: product and post images are meant to be publicly readable, unlike
 * applicant CVs.
 */
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('[admin-upload] BLOB_READ_WRITE_TOKEN is not set.');
    return NextResponse.json(
      {
        error:
          'Image uploads are not configured. Add BLOB_READ_WRITE_TOKEN to the environment.',
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Could not read the upload.' },
      { status: 400 },
    );
  }

  const folder = String(form.get('folder') ?? '') as AdminSection;
  if (!ADMIN_SECTIONS.includes(folder)) {
    return NextResponse.json(
      { error: 'Unknown upload folder.' },
      { status: 400 },
    );
  }

  // An editor may only upload into a section they can edit.
  if (session.role !== 'owner' && !session.permissions.includes(folder)) {
    return NextResponse.json(
      { error: `You do not have access to ${folder}.` },
      { status: 403 },
    );
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file was sent.' }, { status: 400 });
  }

  const validation = await validateImage(file);
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  try {
    const blob = await put(`${folder}/${Date.now()}${validation.extension}`, file, {
      access: 'public',
      contentType: validation.contentType,
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url }, { status: 201 });
  } catch (error) {
    console.error('[admin-upload] Blob upload failed:', error);
    return NextResponse.json(
      { error: 'Could not store the image.' },
      { status: 500 },
    );
  }
}
