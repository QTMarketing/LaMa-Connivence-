import type { Metadata } from 'next';

import InnerHero from '@/components/InnerHero';
import { getPublishedBlogs } from '@/lib/blog/queries';

import BlogIndexClient from './BlogIndexClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog & News | LaMa Convenience',
  description:
    'Store openings, coffee guides, community work and new arrivals from LaMa Convenience.',
};

export default async function BlogPage() {
  const posts = await getPublishedBlogs();

  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Blog & News"
        subtitle="Stay updated with our latest news, updates, and stories."
        imageAlt="LaMa food on orange"
      />
      <BlogIndexClient posts={posts} />
    </div>
  );
}
