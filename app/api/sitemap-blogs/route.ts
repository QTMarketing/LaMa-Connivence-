import { NextResponse } from 'next/server';
import { blogStorage } from '@/lib/blogStorage';

// This API route generates sitemap entries for blog posts from database

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://la-ma-connivence.vercel.app';
    
    // Fetch published blogs from database
    const blogs = await blogStorage.getPublished();
    
    const blogEntries = blogs.map(blog => ({
      url: `${baseUrl}/media/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return NextResponse.json(blogEntries, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
    return NextResponse.json([], { status: 500 });
  }
}
