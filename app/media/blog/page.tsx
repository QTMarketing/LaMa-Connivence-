'use client';

import { getAllBlogs } from '@/lib/blogHelpers';
import { BLOG_COVER_FALLBACK } from '@/lib/blogData';
import InnerHero from '@/components/InnerHero';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogPage() {
  const blogs = getAllBlogs();
  
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Blog & News"
        subtitle="Stay updated with our latest news, updates, and stories."
        imageAlt="LaMa food on orange"
      />

      {/* Blog Posts Grid */}
      <section className="section">
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <Link
                  href={`/media/blog/${blog.slug}`}
                  className="block card overflow-hidden group hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FAFAF5] flex-shrink-0">
                    <Image
                      src={blog.image || BLOG_COVER_FALLBACK}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-gray-600 typography-caption mb-2">
                      <Clock size={14} />
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.author}</span>
                    </div>
                    <h3 className="text-lg font-bold text-secondary mb-2 group-hover:text-primary transition-colors min-h-[2.6em] line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="typography-body-sm text-gray-600 line-clamp-2 min-h-[2.6em] mb-4 flex-1">
                      {blog.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-primary font-semibold typography-body-sm mt-auto">
                      Read More
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
