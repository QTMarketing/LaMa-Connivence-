import type { AdminSection } from '@/lib/db/schema';

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

/**
 * Uploads through the authenticated admin endpoint and returns the public Blob
 * URL. Editor images used to be inlined as base64 data URLs, which meant every
 * read of a post carried its images along in the row.
 */
export async function uploadAdminImage(
  file: File,
  folder: AdminSection,
): Promise<UploadResult> {
  const body = new FormData();
  body.set('file', file);
  body.set('folder', folder);

  try {
    const response = await fetch('/api/admin/upload', { method: 'POST', body });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error: typeof data.error === 'string' ? data.error : 'Upload failed.',
      };
    }

    return { ok: true, url: data.url };
  } catch (error) {
    console.error('[upload] Request failed:', error);
    return { ok: false, error: 'Could not reach the server.' };
  }
}
