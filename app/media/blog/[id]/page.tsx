'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { blogStorage, type BlogPost } from '@/lib/blogStorage';
import { blogs as fallbackBlogs } from '@/lib/blogData';
import { format } from 'date-fns';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from CMS first
    let foundBlog = blogStorage.getBySlug(slug);
    
    // If not found in CMS, try fallback static data
    if (!foundBlog) {
      const staticBlog = fallbackBlogs.find(b => b.slug === slug);
      if (staticBlog) {
        // Convert static blog to BlogPost format
        foundBlog = {
          id: `static-${staticBlog.id}`,
          title: staticBlog.title,
          slug: staticBlog.slug,
          content: staticBlog.content,
          excerpt: staticBlog.description,
          status: 'published',
          publishedAt: staticBlog.date,
          author: staticBlog.author,
          authorId: 'static-author',
          featuredImage: staticBlog.image,
          seoTitle: staticBlog.title,
          seoDescription: staticBlog.description,
          focusKeyword: '',
          seoScore: 0,
          robotsIndex: true,
          robotsFollow: true,
          robotsNoArchive: false,
          robotsNoSnippet: false,
          readabilityScore: 0,
          wordCount: 0,
          tags: [],
          createdAt: staticBlog.date,
          updatedAt: staticBlog.date,
        };
      }
    }

    if (foundBlog) {
      setBlog(foundBlog);
      
      // Update SEO metadata
      document.title = foundBlog.seoTitle || foundBlog.title || 'Blog Post';
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', foundBlog.seoDescription || foundBlog.excerpt || '');
      
      // Update Open Graph tags
      const updateMetaTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };
      
      updateMetaTag('og:title', foundBlog.ogTitle || foundBlog.seoTitle || foundBlog.title || '');
      updateMetaTag('og:description', foundBlog.ogDescription || foundBlog.seoDescription || foundBlog.excerpt || '');
      updateMetaTag('og:image', foundBlog.ogImage || foundBlog.featuredImage || '');
      updateMetaTag('og:type', 'article');
      
      // Update Twitter Card tags
      const updateTwitterTag = (name: string, content: string) => {
        let tag = document.querySelector(`meta[name="${name}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', name);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };
      
      updateTwitterTag('twitter:card', 'summary_large_image');
      updateTwitterTag('twitter:title', foundBlog.twitterTitle || foundBlog.ogTitle || foundBlog.seoTitle || foundBlog.title || '');
      updateTwitterTag('twitter:description', foundBlog.twitterDescription || foundBlog.ogDescription || foundBlog.seoDescription || foundBlog.excerpt || '');
      updateTwitterTag('twitter:image', foundBlog.twitterImage || foundBlog.ogImage || foundBlog.featuredImage || '');
      
      // Get related blogs (exclude current blog)
      const allPublished = blogStorage.getPublished();
      const related = allPublished
        .filter(b => b.id !== foundBlog!.id && b.status === 'published')
        .slice(0, 3);
      
      // If not enough CMS blogs, add static blogs as fallback
      if (related.length < 3) {
        const staticRelated = fallbackBlogs
          .filter(b => b.slug !== slug)
          .slice(0, 3 - related.length)
          .map((sb, index) => ({
            id: `static-related-${index}`,
            title: sb.title,
            slug: sb.slug,
            content: sb.content,
            excerpt: sb.description,
            status: 'published' as const,
            publishedAt: sb.date,
            author: sb.author,
            authorId: 'static-author',
            featuredImage: sb.image,
            seoTitle: sb.title,
            seoDescription: sb.description,
            focusKeyword: '',
            seoScore: 0,
            robotsIndex: true,
            robotsFollow: true,
            robotsNoArchive: false,
            robotsNoSnippet: false,
            readabilityScore: 0,
            wordCount: 0,
            tags: [],
            createdAt: sb.date,
            updatedAt: sb.date,
          }));
        setRelatedBlogs([...related, ...staticRelated]);
      } else {
        setRelatedBlogs(related);
      }
    }
    
    setLoading(false);

    // Listen for updates
    const handleUpdate = () => {
      const updated = blogStorage.getBySlug(slug);
      if (updated) {
        setBlog(updated);
      }
    };
    window.addEventListener('blogsUpdated', handleUpdate);
    return () => window.removeEventListener('blogsUpdated', handleUpdate);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-secondary mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/media/blog"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src={blog.featuredImage || blog.ogImage || `https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=1080&fit=crop`}
            alt={blog.seoTitle || blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-40 h-full flex items-end justify-center pb-12 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            {blog.category && (
              <div className="inline-block bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-2 mb-4">
                <span className="text-sm font-bold uppercase tracking-wide">{blog.category.name}</span>
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              {blog.seoTitle || blog.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>
                  {blog.publishedAt 
                    ? format(new Date(blog.publishedAt), 'MMM d, yyyy')
                    : format(new Date(blog.createdAt), 'MMM d, yyyy')
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{blog.author}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Excerpt Section */}
      {blog.excerpt && (
        <section className="py-6 px-6 bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              {blog.excerpt}
            </p>
          </div>
        </section>
      )}

      {/* Blog Content Section */}
      <section className="py-12 md:py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
          >
            <div 
              className="text-gray-700 leading-relaxed text-base md:text-lg"
              style={{
                lineHeight: '1.8',
              }}
              dangerouslySetInnerHTML={{ 
                __html: blog.content.replace(
                  /<h3>/g, 
                  '<h3 style="font-size: 1.5rem; font-weight: 800; color: #1A1A1A; margin-top: 2rem; margin-bottom: 1rem;">'
                ).replace(
                  /<ul>/g,
                  '<ul style="list-style-type: disc; padding-left: 1.5rem; margin: 1rem 0;">'
                ).replace(
                  /<li>/g,
                  '<li style="margin: 0.5rem 0;">'
                ).replace(
                  /<p>/g,
                  '<p style="margin: 1rem 0;">'
                )
              }}
            />
          </motion.div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-700">Tags:</span>
                {blog.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/media/blog?tag=${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 md:py-16 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
                Related Articles
              </h2>
              <p className="text-lg text-gray-600">
                Continue reading with these related stories
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.div
                  key={relatedBlog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                >
                  <Link
                    href={`/media/blog/${relatedBlog.slug}`}
                    className="block bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 group"
                  >
                    <div className="relative w-full aspect-video overflow-hidden">
                      <Image
                        src={relatedBlog.featuredImage || relatedBlog.ogImage || `https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop`}
                        alt={relatedBlog.seoTitle || relatedBlog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {relatedBlog.category && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                            {relatedBlog.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>
                            {relatedBlog.publishedAt 
                              ? format(new Date(relatedBlog.publishedAt), 'MMM d, yyyy')
                              : format(new Date(relatedBlog.createdAt), 'MMM d, yyyy')
                            }
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-secondary group-hover:text-primary transition-colors duration-300 mb-3">
                        {relatedBlog.seoTitle || relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedBlog.excerpt || relatedBlog.seoDescription || 'Read more...'}
                      </p>
                      <div className="flex items-center text-primary font-bold text-sm group-hover:underline">
                        Read More
                        <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog Link */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/media/blog"
            className="inline-flex items-center gap-2 text-primary font-bold hover:underline transition-all"
            style={{ color: '#FF6B35' }}
          >
            <ArrowRight size={20} className="rotate-180" />
            Back to All Articles
          </Link>
        </div>
      </section>
    </div>
  );
}
