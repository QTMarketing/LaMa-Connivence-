// Helper functions for generating sitemap entries
// This will be used when we have a database connection

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateBlogSitemapEntries(blogs: Array<{
  slug: string;
  updatedAt: string;
  publishedAt?: string;
}>): SitemapEntry[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://la-ma-connivence.vercel.app';
  
  return blogs.map(blog => ({
    url: `${baseUrl}/media/blog/${blog.slug}`,
    lastModified: new Date(blog.updatedAt || blog.publishedAt || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
}

export function generateStoreSitemapEntries(stores: Array<{
  id: string | number;
}>): SitemapEntry[] {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://la-ma-connivence.vercel.app';
  
  return stores.map(store => ({
    url: `${baseUrl}/stores/${store.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
}
