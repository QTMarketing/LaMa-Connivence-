'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, User } from 'lucide-react';

import { formatBlogDate, type BlogView } from '@/lib/blog/types';

interface Props {
  post: BlogView;
  /** Already sanitised on the server. */
  safeContent: string;
  related: BlogView[];
}

export default function BlogPostClient({ post, safeContent, related }: Props) {
  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-gray-50 py-4">
        <div className="container-standard px-4 md:px-6">
          <Link
            href="/media/blog"
            className="typography-body-sm inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-primary"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </section>

      <article className="py-8 md:py-12">
        <div className="container-standard px-4 md:px-6">
          <div className="mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="typography-body-sm mb-4 flex flex-wrap items-center gap-4 text-gray-600">
                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {formatBlogDate(post.publishedAt)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <User size={16} />
                  {post.author}
                </span>
                {post.category && (
                  <>
                    <span>•</span>
                    <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">
                      {post.category.name}
                    </span>
                  </>
                )}
              </div>

              <h1 className="typography-h1 mb-6 text-secondary">{post.title}</h1>

              {post.excerpt && (
                <p className="typography-body-lg text-gray-600">
                  {post.excerpt}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-md bg-gray-200"
            >
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: safeContent }}
            />

            {post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="typography-body-sm rounded-full bg-gray-100 px-3 py-1 text-gray-700"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {related.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-16 border-t border-gray-200 pt-12"
              >
                <h2 className="typography-h2 mb-8 text-secondary">
                  Related Posts
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      href={`/media/blog/${item.slug}`}
                      className="card group block overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-200">
                        <Image
                          src={item.featuredImage}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="typography-h4 mb-2 line-clamp-2 text-secondary transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="typography-body-sm line-clamp-2 text-gray-600">
                          {item.excerpt}
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
