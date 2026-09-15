import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';

import {
  getPublishedBlogBySlug,
  getRelatedBlogs,
} from '@/lib/blog/queries';
import { getBlogSeo } from '@/lib/blog/seo';

import BlogPostClient from './BlogPostClient';

type Params = { params: Promise<{ slug: string }> };

// Posts are admin-editable, so a published edit must not wait for a rebuild.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const seo = await getBlogSeo((await params).slug);
  return seo ?? { title: 'Post not found | LaMa Convenience' };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;

  const post = await getPublishedBlogBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedBlogs(slug);

  // Sanitising on the server means the browser never holds the raw HTML, and
  // the content is identical on first paint.
  const safeContent = DOMPurify.sanitize(post.content);

  return (
    <BlogPostClient post={post} safeContent={safeContent} related={related} />
  );
}
