export const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB
export const MAX_IMAGE_LABEL = '4 MB';

export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
] as const;

export const IMAGE_ACCEPT_ATTRIBUTE = 'image/jpeg,image/png,image/webp,image/avif';

/** True for the stock photos seeded as product placeholders. */
export function isStockPlaceholder(url: string): boolean {
  return url.includes('images.unsplash.com');
}

type SniffedImage = 'jpeg' | 'png' | 'webp' | 'avif';

/**
 * Magic-byte sniff. The declared MIME type comes from the client, so the bytes
 * decide what actually gets stored.
 */
function sniffImage(bytes: Uint8Array): SniffedImage | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return 'jpeg';
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return 'png';
  }

  // RIFF....WEBP
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    return 'webp';
  }

  // ISO-BMFF box with an 'ftyp' type of 'avif'.
  if (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(4, 8)) === 'ftyp' &&
    String.fromCharCode(...bytes.slice(8, 12)).startsWith('avi')
  ) {
    return 'avif';
  }

  return null;
}

const SNIFFED_TO_MIME: Record<SniffedImage, string> = {
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
};

const SNIFFED_TO_EXTENSION: Record<SniffedImage, string> = {
  jpeg: '.jpg',
  png: '.png',
  webp: '.webp',
  avif: '.avif',
};

export interface ImageValidationResult {
  ok: boolean;
  error?: string;
  contentType?: string;
  extension?: string;
}

export async function validateImage(file: File): Promise<ImageValidationResult> {
  if (file.size === 0) {
    return { ok: false, error: 'That file is empty.' };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: `Images must be under ${MAX_IMAGE_LABEL}.` };
  }

  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const sniffed = sniffImage(header);

  if (!sniffed) {
    return {
      ok: false,
      error: 'Please upload a JPEG, PNG, WebP or AVIF image.',
    };
  }

  return {
    ok: true,
    contentType: SNIFFED_TO_MIME[sniffed],
    extension: SNIFFED_TO_EXTENSION[sniffed],
  };
}
