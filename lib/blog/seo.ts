import type { Metadata } from 'next';
import { and, eq } from 'drizzle-orm';

import { BLOG_SEED } from '@/lib/blogData';
import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import { blogs } from '@/lib/db/schema';

interface SeoRow {
  title: string;
  excerpt: string | null;
  featuredImage: string | null;
  publishedAt: Date | null;
  author: string;
  seoTitle: string | null;
  seoDescription: string | null;
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
}

/**
 * The old localStorage BlogPost carried a full RankMath-style SEO record that
 * nothing ever rendered — the blog pages were client components with no
 * metadata export at all. This is where those fields finally reach the page.
 */
export async function getBlogSeo(slug: string): Promise<Metadata | null> {
  const row = await publicRead<SeoRow | null>(
    `getBlogSeo(${slug})`,
    async () => {
      const [found] = await getDb()
        .select({
          title: blogs.title,
          excerpt: blogs.excerpt,
          featuredImage: blogs.featuredImage,
          publishedAt: blogs.publishedAt,
          author: blogs.author,
          seoTitle: blogs.seoTitle,
          seoDescription: blogs.seoDescription,
          canonicalUrl: blogs.canonicalUrl,
          ogTitle: blogs.ogTitle,
          ogDescription: blogs.ogDescription,
          ogImage: blogs.ogImage,
          twitterTitle: blogs.twitterTitle,
          twitterDescription: blogs.twitterDescription,
          twitterImage: blogs.twitterImage,
          robotsIndex: blogs.robotsIndex,
          robotsFollow: blogs.robotsFollow,
          robotsNoArchive: blogs.robotsNoArchive,
          robotsNoSnippet: blogs.robotsNoSnippet,
        })
        .from(blogs)
        .where(and(eq(blogs.slug, slug), eq(blogs.status, 'published')))
        .limit(1);

      return found ?? null;
    },
    seedSeoRow(slug),
  );

  if (!row) return null;

  const title = row.seoTitle || row.title;
  const description = row.seoDescription || row.excerpt || undefined;
  const image = row.ogImage || row.featuredImage || undefined;

  return {
    title,
    description,
    alternates: row.canonicalUrl ? { canonical: row.canonicalUrl } : undefined,
    robots: {
      index: row.robotsIndex,
      follow: row.robotsFollow,
      noarchive: row.robotsNoArchive,
      nosnippet: row.robotsNoSnippet,
    },
    openGraph: {
      type: 'article',
      title: row.ogTitle || title,
      description: row.ogDescription || description,
      images: image ? [image] : undefined,
      publishedTime: row.publishedAt?.toISOString(),
      authors: [row.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: row.twitterTitle || row.ogTitle || title,
      description: row.twitterDescription || row.ogDescription || description,
      images: row.twitterImage || image ? [row.twitterImage || image!] : undefined,
    },
  };
}

/** Seed posts carry no SEO fields, so everything falls back to the basics. */
function seedSeoRow(slug: string): SeoRow | null {
  const post = BLOG_SEED.find((entry) => entry.slug === slug);
  if (!post) return null;

  return {
    title: post.title,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    publishedAt: new Date(post.publishedAt),
    author: post.author,
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    twitterTitle: null,
    twitterDescription: null,
    twitterImage: null,
    robotsIndex: true,
    robotsFollow: true,
    robotsNoArchive: false,
    robotsNoSnippet: false,
  };
}
