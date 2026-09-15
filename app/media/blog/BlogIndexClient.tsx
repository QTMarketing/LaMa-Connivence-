'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

import { formatBlogDate, type BlogView } from '@/lib/blog/types';

export default function BlogIndexClient({ posts }: { posts: BlogView[] }) {
  return (
    <section className="section">
      <div className="container-standard">
        {posts.length === 0 ? (
          <p className="typography-body-lg text-gray-600">
            No posts published yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.5) }}
                className="h-full"
              >
                <Link
                  href={`/media/blog/${post.slug}`}
                  className="card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] w-full flex-shrink-0 overflow-hidden bg-[#FAFAF5]">
                    <Image
                      src={post.featuredImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 md:p-5">
                    <div className="typography-caption mb-2 flex items-center gap-2 text-gray-600">
                      <Clock size={14} />
                      <span>{formatBlogDate(post.publishedAt)}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>
                    <h3 className="mb-2 line-clamp-2 min-h-[2.6em] text-lg font-bold text-secondary transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="typography-body-sm mb-4 line-clamp-2 min-h-[2.6em] flex-1 text-gray-600">
                      {post.excerpt}
                    </p>
                    <div className="typography-body-sm mt-auto inline-flex items-center gap-2 font-semibold text-primary">
                      Read More
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
