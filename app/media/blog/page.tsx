'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { blogStorage, type BlogPost } from '@/lib/blogStorage';
import { blogs as fallbackBlogs } from '@/lib/blogData';
import GlassBanner from '@/components/GlassBanner';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  useEffect(() => {
    // Load from localStorage, fallback to static data
    const cmsBlogs = blogStorage.getPublished();
    if (cmsBlogs.length > 0) {
      setBlogs(cmsBlogs);
    } else {
      // Convert static blogs to BlogPost format for display
      const staticBlogs = fallbackBlogs.map((blog, index) => ({
        id: `static-${index}`,
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        excerpt: blog.description,
        status: 'published' as const,
        publishedAt: blog.date,
        author: blog.author,
        authorId: 'static-author',
        featuredImage: blog.image,
        seoTitle: blog.title,
        seoDescription: blog.description,
        focusKeyword: '',
        seoScore: 0,
        robotsIndex: true,
        robotsFollow: true,
        robotsNoArchive: false,
        robotsNoSnippet: false,
        readabilityScore: 0,
        wordCount: 0,
        tags: [],
        createdAt: blog.date,
        updatedAt: blog.date,
      }));
      setBlogs(staticBlogs);
    }

    // Listen for updates
    const handleUpdate = () => {
      const updated = blogStorage.getPublished();
      if (updated.length > 0) {
        setBlogs(updated);
      }
    };
    window.addEventListener('blogsUpdated', handleUpdate);
    return () => window.removeEventListener('blogsUpdated', handleUpdate);
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        {/* Glass Banner - Floating Inside Hero */}
        <GlassBanner />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=1080&fit=crop"
            alt="Blog Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-40 h-full flex items-start justify-center pt-4 px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Blog
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-4">
              Latest insights and trends
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest news, tips, and stories from LaMa Convenience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
              >
                <Link
                  href={`/media/blog/${blog.slug}`}
                  className="block bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 group"
                >
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={(() => {
                        const imageUrl = blog.featuredImage || blog.ogImage || '';
                        return imageUrl && imageUrl.startsWith('http') 
                          ? imageUrl 
                          : `https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop`;
                      })()}
                      alt={blog.seoTitle || blog.title || 'Blog post'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {blog.category && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                          {blog.category.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>
                          {blog.publishedAt 
                            ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} />
                        <span>{blog.author}</span>
                      </div>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-secondary group-hover:text-primary transition-colors duration-300 mb-3">
                      {blog.seoTitle || blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {blog.excerpt || blog.seoDescription || 'Read more...'}
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
    </div>
  );
}
