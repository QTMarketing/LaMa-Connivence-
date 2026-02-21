'use client';

import { getBlogBySlug, getAllBlogs } from '@/lib/blogHelpers';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type BlogPostPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    // Handle both Promise and direct params (for Next.js compatibility)
    if (params instanceof Promise) {
      params.then((resolved) => {
        setSlug(resolved.slug);
      });
    } else {
      setSlug(params.slug);
    }
  }, [params]);

  // Don't render until slug is resolved
  if (!slug) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const blog = getBlogBySlug(slug);

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="typography-h1 text-secondary mb-4">404</h1>
          <p className="typography-body-lg text-gray-600 mb-8">This blog post could not be found.</p>
          <Link href="/media/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Get related blogs (exclude current)
  const relatedBlogs = getAllBlogs()
    .filter(b => b.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b border-gray-200 pt-24 pb-4">
        <div className="container-standard px-4 md:px-6">
          <Link
            href="/media/blog"
            className="inline-flex items-center gap-2 typography-body-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Blog Post */}
      <article className="py-8 md:py-12">
        <div className="container-standard px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 text-gray-600 typography-body-sm mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{blog.date}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{blog.author}</span>
                </div>
              </div>
              <h1 className="typography-h1 text-secondary mb-6">
                {blog.title}
              </h1>
              <p className="typography-body-lg text-gray-600">
                {blog.description}
              </p>
            </motion.div>

            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full aspect-[16/9] rounded-md overflow-hidden mb-8 bg-gray-200"
            >
              <Image
                src={blog.image || '/photos/store1.jpg'}
                alt={blog.title}
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/photos/store1.jpg') {
                    target.src = '/photos/store1.jpg';
                  }
                }}
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 pt-12 border-t border-gray-200"
              >
                <h2 className="typography-h2 text-secondary mb-8">
                  Related Posts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <Link
                      key={relatedBlog.id}
                      href={`/media/blog/${relatedBlog.slug}`}
                      className="block card overflow-hidden group hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200">
                        <Image
                          src={relatedBlog.image || '/photos/store1.jpg'}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            const target = e.target as HTMLImageElement;
                            if (target.src !== '/photos/store1.jpg') {
                              target.src = '/photos/store1.jpg';
                            }
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="typography-h4 text-secondary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {relatedBlog.title}
                        </h3>
                        <p className="typography-body-sm text-gray-600 line-clamp-2">
                          {relatedBlog.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
