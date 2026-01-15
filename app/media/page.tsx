'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { blogs } from '@/lib/blogData';
import { ArrowRight, BookOpen, Newspaper } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28">
      {/* Hero Section */}
      <section className="relative bg-secondary py-16 md:py-24 px-6" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Media
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Stay connected with LaMa. Read our latest blog posts, press releases, and company news.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" style={{ color: '#FF6B35' }} />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary">
                Blog
              </h2>
            </div>
            <Link
              href="/media/blog"
              className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-primary text-gray-900 hover:text-primary px-6 py-3 rounded-lg font-bold transition-colors"
            >
              View All Posts
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {blogs.slice(0, 6).map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/media/blog/${blog.slug}`}
                  className="block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary transition-all group"
                >
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={blog.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.author}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-secondary mb-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {blog.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary font-bold text-sm group-hover:underline">
                      Read More
                      <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Room Section */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <Newspaper className="w-8 h-8 text-primary" style={{ color: '#FF6B35' }} />
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary">
                Press Room
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl">
              For media inquiries, press releases, and company information, please contact our press team.
            </p>
          </motion.div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-black text-secondary mb-4">Media Contacts</h3>
                <div className="space-y-4 text-gray-600">
                  <div>
                    <p className="font-bold text-secondary mb-1">Press Inquiries</p>
                    <a href="mailto:press@lama.com" className="text-primary hover:underline">
                      press@lama.com
                    </a>
                  </div>
                  <div>
                    <p className="font-bold text-secondary mb-1">General Media</p>
                    <a href="mailto:media@lama.com" className="text-primary hover:underline">
                      media@lama.com
                    </a>
                  </div>
                  <div>
                    <p className="font-bold text-secondary mb-1">Phone</p>
                    <a href="tel:+15551234567" className="text-primary hover:underline">
                      (555) 123-4567
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-black text-secondary mb-4">Press Resources</h3>
                <div className="space-y-3">
                  <Link
                    href="/about"
                    className="block text-gray-600 hover:text-primary transition-colors"
                  >
                    Company Information
                  </Link>
                  <Link
                    href="/stores"
                    className="block text-gray-600 hover:text-primary transition-colors"
                  >
                    Store Locations
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-gray-600 hover:text-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
                <div className="mt-6">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-primary text-gray-900 hover:text-primary px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    Contact Press Team
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

