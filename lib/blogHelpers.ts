import { blogs as staticBlogs } from './blogData';
import { blogStorage, type BlogPost } from './blogStorage';

// Convert BlogPost (from blogStorage) to simple blog format
function convertBlogPostToSimple(blogPost: BlogPost) {
  return {
    id: blogPost.id,
    slug: blogPost.slug,
    title: blogPost.title,
    description: blogPost.excerpt || blogPost.seoDescription || '',
    content: blogPost.content,
    image: blogPost.featuredImage || '/photos/store1.jpg', // Placeholder image
    date: blogPost.publishedAt 
      ? new Date(blogPost.publishedAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : new Date(blogPost.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
    author: blogPost.author,
  };
}

// Get all blogs (static + admin-managed, published only)
export function getAllBlogs() {
  // Get static blogs
  const staticBlogsList = staticBlogs.map(blog => ({
    ...blog,
    source: 'static' as const,
  }));

  // Get admin-managed published blogs (only on client side)
  let adminBlogs: Array<ReturnType<typeof convertBlogPostToSimple> & { source: 'admin' }> = [];
  if (typeof window !== 'undefined') {
    adminBlogs = blogStorage.getPublished().map(blog => ({
      ...convertBlogPostToSimple(blog),
      source: 'admin' as const,
    }));
  }

  // Combine and sort by date (newest first)
  // For static blogs, dates are in format "Nov 20, 2025"
  // For admin blogs, dates are already formatted
  const allBlogs = [...staticBlogsList, ...adminBlogs].sort((a, b) => {
    try {
      // Try parsing dates - handle both formats
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      // If parsing fails, return 0 (keep order)
      if (isNaN(dateA) || isNaN(dateB)) {
        return 0;
      }
      
      return dateB - dateA; // Newest first
    } catch {
      // If date parsing fails, keep original order
      return 0;
    }
  });

  return allBlogs;
}

// Get blog by slug
export function getBlogBySlug(slug: string) {
  // Check static blogs first
  const staticBlog = staticBlogs.find(b => b.slug === slug);
  if (staticBlog) {
    return { ...staticBlog, source: 'static' as const };
  }

  // Check admin-managed blogs (only on client side)
  if (typeof window !== 'undefined') {
    const adminBlog = blogStorage.getBySlug(slug);
    if (adminBlog && adminBlog.status === 'published') {
      return { ...convertBlogPostToSimple(adminBlog), source: 'admin' as const };
    }
  }

  return null;
}
