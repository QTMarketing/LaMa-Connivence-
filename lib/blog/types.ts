import type { blogStatusEnum } from '@/lib/db/schema';

// Type-only import, so no Drizzle code reaches the client bundle.
export type BlogStatus = (typeof blogStatusEnum.enumValues)[number];

export const BLOG_STATUSES: BlogStatus[] = [
  'draft',
  'published',
  'scheduled',
  'trash',
];

export interface TaxonomyTerm {
  id: string;
  name: string;
  slug: string;
}

/** What public pages render. */
export interface BlogView {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  /** ISO 8601. Formatting is the component's job, not the database's. */
  publishedAt: string;
  category: TaxonomyTerm | null;
  tags: TaxonomyTerm[];
}

/** Everything the editor needs, including the fields only search engines see. */
export interface BlogEditView extends BlogView {
  status: BlogStatus;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  robotsNoArchive: boolean;
  robotsNoSnippet: boolean;
  wordCount: number;
  categoryId: string | null;
  updatedAt: string;
}

/** Row shape for the admin list; deliberately omits the full post body. */
export interface BlogSummary {
  id: string;
  slug: string;
  title: string;
  status: BlogStatus;
  author: string;
  publishedAt: string | null;
  updatedAt: string;
  wordCount: number;
  categoryName: string | null;
}

export const BLOG_COVER_FALLBACK =
  'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&h=900&fit=crop';

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Locale and timezone are pinned. Left to the runtime default, the server and
 * the browser can format the same timestamp differently and React reports a
 * hydration mismatch.
 */
const BLOG_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatBlogDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '' : BLOG_DATE_FORMAT.format(date);
}

/** Strips tags before counting, so markup is not counted as words. */
export function countWords(html: string): number {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return text ? text.split(/\s+/).length : 0;
}

/** Rounded to whole minutes at 200 wpm, with a floor of one. */
export function readingMinutes(html: string): number {
  return Math.max(1, Math.round(countWords(html) / 200));
}
