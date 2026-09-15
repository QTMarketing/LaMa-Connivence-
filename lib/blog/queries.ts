import { and, asc, desc, eq, inArray, ne } from 'drizzle-orm';

import { BLOG_SEED } from '@/lib/blogData';
import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import {
  blogTags,
  blogs,
  categories,
  tags,
  type Blog,
  type Category,
  type Tag,
} from '@/lib/db/schema';

import {
  BLOG_COVER_FALLBACK,
  type BlogEditView,
  type BlogSummary,
  type BlogView,
  type TaxonomyTerm,
} from './types';

type TagsByBlog = Map<string, TaxonomyTerm[]>;

/**
 * One query for the tags of a set of posts, rather than one per post. Called
 * with an empty list it skips the round trip entirely.
 */
async function loadTags(blogIds: string[]): Promise<TagsByBlog> {
  const byBlog: TagsByBlog = new Map();
  if (blogIds.length === 0) return byBlog;

  const rows = await getDb()
    .select({
      blogId: blogTags.blogId,
      id: tags.id,
      name: tags.name,
      slug: tags.slug,
    })
    .from(blogTags)
    .innerJoin(tags, eq(blogTags.tagId, tags.id))
    .where(inArray(blogTags.blogId, blogIds))
    .orderBy(asc(tags.name));

  for (const row of rows) {
    const list = byBlog.get(row.blogId) ?? [];
    list.push({ id: row.id, name: row.name, slug: row.slug });
    byBlog.set(row.blogId, list);
  }

  return byBlog;
}

function toTerm(row: Pick<Category | Tag, 'id' | 'name' | 'slug'>): TaxonomyTerm {
  return { id: row.id, name: row.name, slug: row.slug };
}

function toBlogView(
  row: Blog,
  category: Category | null,
  postTags: TaxonomyTerm[],
): BlogView {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content,
    featuredImage: row.featuredImage || BLOG_COVER_FALLBACK,
    author: row.author,
    // Drafts have no publish date; fall back to when the row was created so
    // the editor never has to render an empty date.
    publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
    category: category ? toTerm(category) : null,
    tags: postTags,
  };
}

function toBlogEditView(
  row: Blog,
  category: Category | null,
  postTags: TaxonomyTerm[],
): BlogEditView {
  return {
    ...toBlogView(row, category, postTags),
    // The editor needs the raw value, not the cover fallback.
    featuredImage: row.featuredImage ?? '',
    status: row.status,
    seoTitle: row.seoTitle ?? '',
    seoDescription: row.seoDescription ?? '',
    focusKeyword: row.focusKeyword ?? '',
    canonicalUrl: row.canonicalUrl ?? '',
    ogTitle: row.ogTitle ?? '',
    ogDescription: row.ogDescription ?? '',
    ogImage: row.ogImage ?? '',
    twitterTitle: row.twitterTitle ?? '',
    twitterDescription: row.twitterDescription ?? '',
    twitterImage: row.twitterImage ?? '',
    robotsIndex: row.robotsIndex,
    robotsFollow: row.robotsFollow,
    robotsNoArchive: row.robotsNoArchive,
    robotsNoSnippet: row.robotsNoSnippet,
    wordCount: row.wordCount,
    categoryId: row.categoryId,
    updatedAt: row.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------

/**
 * Published posts, newest first. 'scheduled' is excluded: nothing promotes a
 * scheduled post yet, so treating it as live would publish it early.
 */
export async function getPublishedBlogs(limit?: number): Promise<BlogView[]> {
  return publicRead(
    'getPublishedBlogs',
    async () => {
      const rows = await getDb()
        .select({ blog: blogs, category: categories })
        .from(blogs)
        .leftJoin(categories, eq(blogs.categoryId, categories.id))
        .where(eq(blogs.status, 'published'))
        .orderBy(desc(blogs.publishedAt))
        .limit(limit ?? 100);

      const tagsByBlog = await loadTags(rows.map((row) => row.blog.id));

      return rows.map((row) =>
        toBlogView(row.blog, row.category, tagsByBlog.get(row.blog.id) ?? []),
      );
    },
    limit ? BLOG_SEED.slice(0, limit) : BLOG_SEED,
  );
}

export async function getPublishedBlogBySlug(
  slug: string,
): Promise<BlogView | null> {
  return publicRead(
    `getPublishedBlogBySlug(${slug})`,
    async () => {
      const [row] = await getDb()
        .select({ blog: blogs, category: categories })
        .from(blogs)
        .leftJoin(categories, eq(blogs.categoryId, categories.id))
        .where(and(eq(blogs.slug, slug), eq(blogs.status, 'published')))
        .limit(1);

      if (!row) return null;

      const tagsByBlog = await loadTags([row.blog.id]);
      return toBlogView(
        row.blog,
        row.category,
        tagsByBlog.get(row.blog.id) ?? [],
      );
    },
    BLOG_SEED.find((post) => post.slug === slug) ?? null,
  );
}

export async function getRelatedBlogs(
  slug: string,
  limit = 3,
): Promise<BlogView[]> {
  return publicRead(
    `getRelatedBlogs(${slug})`,
    async () => {
      const rows = await getDb()
        .select({ blog: blogs, category: categories })
        .from(blogs)
        .leftJoin(categories, eq(blogs.categoryId, categories.id))
        .where(and(eq(blogs.status, 'published'), ne(blogs.slug, slug)))
        .orderBy(desc(blogs.publishedAt))
        .limit(limit);

      const tagsByBlog = await loadTags(rows.map((row) => row.blog.id));

      return rows.map((row) =>
        toBlogView(row.blog, row.category, tagsByBlog.get(row.blog.id) ?? []),
      );
    },
    BLOG_SEED.filter((post) => post.slug !== slug).slice(0, limit),
  );
}

/** Slugs and timestamps for the sitemap. */
export async function getPublishedBlogSlugs(): Promise<
  Array<{ slug: string; updatedAt: Date }>
> {
  return publicRead(
    'getPublishedBlogSlugs',
    () =>
      getDb()
        .select({ slug: blogs.slug, updatedAt: blogs.updatedAt })
        .from(blogs)
        .where(eq(blogs.status, 'published'))
        .orderBy(desc(blogs.publishedAt)),
    BLOG_SEED.map((post) => ({
      slug: post.slug,
      updatedAt: new Date(post.publishedAt),
    })),
  );
}

// ---------------------------------------------------------------------------
// Admin reads — allowed to throw, so nobody edits stale seed data
// ---------------------------------------------------------------------------

/** Trashed posts are excluded unless asked for. */
export async function listBlogs(includeTrash = false): Promise<BlogSummary[]> {
  const query = getDb()
    .select({
      id: blogs.id,
      slug: blogs.slug,
      title: blogs.title,
      status: blogs.status,
      author: blogs.author,
      publishedAt: blogs.publishedAt,
      updatedAt: blogs.updatedAt,
      wordCount: blogs.wordCount,
      categoryName: categories.name,
    })
    .from(blogs)
    .leftJoin(categories, eq(blogs.categoryId, categories.id))
    .orderBy(desc(blogs.updatedAt));

  const rows = includeTrash
    ? await query
    : await query.where(ne(blogs.status, 'trash'));

  return rows.map((row) => ({
    ...row,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getBlogById(id: string): Promise<BlogEditView | null> {
  const [row] = await getDb()
    .select({ blog: blogs, category: categories })
    .from(blogs)
    .leftJoin(categories, eq(blogs.categoryId, categories.id))
    .where(eq(blogs.id, id))
    .limit(1);

  if (!row) return null;

  const tagsByBlog = await loadTags([row.blog.id]);
  return toBlogEditView(
    row.blog,
    row.category,
    tagsByBlog.get(row.blog.id) ?? [],
  );
}

export async function getTaxonomy(): Promise<{
  categories: TaxonomyTerm[];
  tags: TaxonomyTerm[];
}> {
  const db = getDb();
  const [categoryRows, tagRows] = await Promise.all([
    db
      .select({ id: categories.id, name: categories.name, slug: categories.slug })
      .from(categories)
      .orderBy(asc(categories.name)),
    db
      .select({ id: tags.id, name: tags.name, slug: tags.slug })
      .from(tags)
      .orderBy(asc(tags.name)),
  ]);

  return { categories: categoryRows, tags: tagRows };
}

/** Replaces a post's tag set. Deleting then inserting keeps this idempotent. */
export async function setBlogTags(blogId: string, tagIds: string[]) {
  const db = getDb();
  await db.delete(blogTags).where(eq(blogTags.blogId, blogId));

  if (tagIds.length > 0) {
    await db
      .insert(blogTags)
      .values(tagIds.map((tagId) => ({ blogId, tagId })))
      .onConflictDoNothing();
  }
}
