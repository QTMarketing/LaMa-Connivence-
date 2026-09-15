export const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_CV_LABEL = '5 MB';

export const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const ALLOWED_CV_EXTENSIONS = ['.pdf', '.doc', '.docx'] as const;

/** For the file input's accept attribute. Convenience only, never a check. */
export const CV_ACCEPT_ATTRIBUTE = [
  ...ALLOWED_CV_EXTENSIONS,
  ...ALLOWED_CV_TYPES,
].join(',');

function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot).toLowerCase();
}

/**
 * Magic-byte sniff. The declared MIME type and the extension both come from the
 * client and can be anything, so the actual bytes decide.
 *
 * PDF  -> "%PDF"
 * DOC  -> D0 CF 11 E0 (OLE2 compound file)
 * DOCX -> "PK" (zip container)
 */
function sniffType(bytes: Uint8Array): 'pdf' | 'doc' | 'docx' | null {
  if (
    bytes.length >= 4 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46
  ) {
    return 'pdf';
  }

  if (
    bytes.length >= 4 &&
    bytes[0] === 0xd0 &&
    bytes[1] === 0xcf &&
    bytes[2] === 0x11 &&
    bytes[3] === 0xe0
  ) {
    return 'doc';
  }

  if (bytes.length >= 2 && bytes[0] === 0x50 && bytes[1] === 0x4b) {
    return 'docx';
  }

  return null;
}

export interface CvValidationResult {
  ok: boolean;
  error?: string;
  /** The type the bytes actually are, for storing alongside the blob. */
  contentType?: string;
}

const SNIFFED_TO_MIME: Record<'pdf' | 'doc' | 'docx', string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export async function validateCv(file: File): Promise<CvValidationResult> {
  if (file.size === 0) {
    return { ok: false, error: 'That file is empty.' };
  }

  if (file.size > MAX_CV_BYTES) {
    return {
      ok: false,
      error: `Your CV must be under ${MAX_CV_LABEL}.`,
    };
  }

  const extension = extensionOf(file.name);
  if (!ALLOWED_CV_EXTENSIONS.includes(extension as never)) {
    return {
      ok: false,
      error: 'Please upload a PDF, DOC or DOCX file.',
    };
  }

  const header = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  const sniffed = sniffType(header);

  if (!sniffed) {
    return {
      ok: false,
      error: 'That file does not look like a PDF or Word document.',
    };
  }

  // A .pdf that is really a zip, or vice versa, is rejected.
  const extensionMatchesBytes =
    (sniffed === 'pdf' && extension === '.pdf') ||
    (sniffed === 'doc' && extension === '.doc') ||
    (sniffed === 'docx' && extension === '.docx');

  if (!extensionMatchesBytes) {
    return {
      ok: false,
      error: `The file contents do not match the ${extension} extension.`,
    };
  }

  return { ok: true, contentType: SNIFFED_TO_MIME[sniffed] };
}

/** Strips directories and anything awkward out of a client-supplied filename. */
export function safeFilename(name: string): string {
  const base = name.split(/[/\\]/).pop() ?? 'cv';
  return base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'cv';
}
