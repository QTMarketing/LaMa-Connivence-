import { BLOG_STATUSES, countWords, slugify, type BlogStatus } from './types';

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function optionalText(value: unknown, max: number): string | null {
  return text(value, max) || null;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function uuidOrNull(value: unknown): string | null {
  const cleaned = text(value, 36);
  return UUID_PATTERN.test(cleaned) ? cleaned : null;
}

export interface BlogInput {
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  status: BlogStatus;
  author: string;
  featuredImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  robotsIndex: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  wordCount: number;
  categoryId: string | null;
}

export interface ParsedBlog {
  blog: BlogInput;
  tagIds: string[];
}

/** 400 KB. Inline images now go to Blob, so a post body should never approach this. */
const MAX_CONTENT_BYTES = 400_000;

export function parseBlog(body: unknown): ValidationResult<ParsedBlog> {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Expected a JSON object.' };
  }

  const input = body as Record<string, unknown>;

  const title = text(input.title, 200);
  if (!title) return { ok: false, error: 'A title is required.' };

  // An empty or non-slugifiable title field still has to produce a valid URL.
  const slug = slugify(text(input.slug, 200)) || slugify(title);
  if (!slug) {
    return {
      ok: false,
      error: 'Could not build a URL slug. Add letters or numbers to the title.',
    };
  }

  const content = typeof input.content === 'string' ? input.content : '';
  if (content.length > MAX_CONTENT_BYTES) {
    return {
      ok: false,
      error:
        'This post is too large. Inline images should be uploaded rather than pasted in as data URLs.',
    };
  }

  // A base64 image in the body would be copied into every read of this row.
  if (/<img[^>]+src=["']data:/i.test(content)) {
    return {
      ok: false,
      error:
        'Inline base64 images are not allowed. Re-insert the image so it uploads to storage.',
    };
  }

  const status = text(input.status, 20) as BlogStatus;
  if (!BLOG_STATUSES.includes(status)) {
    return {
      ok: false,
      error: `Status must be one of: ${BLOG_STATUSES.join(', ')}.`,
    };
  }

  const rawTags = Array.isArray(input.tagIds) ? input.tagIds : [];
  const tagIds = [...new Set(rawTags.map(uuidOrNull).filter(Boolean))] as string[];

  return {
    ok: true,
    value: {
      blog: {
        slug,
        title,
        content,
        excerpt: optionalText(input.excerpt, 500),
        status,
        author: text(input.author, 120) || 'LaMa Team',
        featuredImage: optionalText(input.featuredImage, 1000),
        seoTitle: optionalText(input.seoTitle, 200),
        seoDescription: optionalText(input.seoDescription, 320),
        focusKeyword: optionalText(input.focusKeyword, 120),
        canonicalUrl: optionalText(input.canonicalUrl, 1000),
        ogTitle: optionalText(input.ogTitle, 200),
        ogDescription: optionalText(input.ogDescription, 320),
        ogImage: optionalText(input.ogImage, 1000),
        twitterTitle: optionalText(input.twitterTitle, 200),
        twitterDescription: optionalText(input.twitterDescription, 320),
        twitterImage: optionalText(input.twitterImage, 1000),
        robotsIndex: bool(input.robotsIndex, true),
        robotsFollow: bool(input.robotsFollow, true),
        robotsNoArchive: bool(input.robotsNoArchive, false),
        robotsNoSnippet: bool(input.robotsNoSnippet, false),
        // Server-side so the count cannot disagree with the stored content.
        wordCount: countWords(content),
        categoryId: uuidOrNull(input.categoryId),
      },
      tagIds,
    },
  };
}

export function parseTaxonomyTerm(
  body: unknown,
): ValidationResult<{ type: 'category' | 'tag'; name: string; slug: string }> {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Expected a JSON object.' };
  }

  const input = body as Record<string, unknown>;
  const type = text(input.type, 10);
  if (type !== 'category' && type !== 'tag') {
    return { ok: false, error: 'Type must be "category" or "tag".' };
  }

  const name = text(input.name, 80);
  if (!name) return { ok: false, error: 'A name is required.' };

  const slug = slugify(name);
  if (!slug) {
    return { ok: false, error: 'That name does not produce a usable slug.' };
  }

  return { ok: true, value: { type, name, slug } };
}
