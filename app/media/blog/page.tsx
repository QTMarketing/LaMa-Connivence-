'use client';

import { getAllBlogs } from '@/lib/blogHelpers';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogPage() {
  const blogs = getAllBlogs();
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Blog"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 container-standard px-4 md:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="typography-h1 text-white mb-4">
                Blog & News
              </h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                Stay updated with our latest news, updates, and stories.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

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
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-200 flex-shrink-0">
                    <Image
                      src={blog.image || '/photos/store1.jpg'}
                      alt={blog.title}
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
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-gray-600 typography-caption mb-3">
                      <Clock size={14} />
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.author}</span>
                    </div>
                    <h3 className="typography-h3 text-secondary mb-3 group-hover:text-primary transition-colors min-h-[3.5rem] line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="typography-body text-gray-600 line-clamp-2 mb-4 flex-1">
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
