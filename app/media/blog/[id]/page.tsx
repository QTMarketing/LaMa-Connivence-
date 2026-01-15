'use client';

import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { blogs } from '@/lib/blogData';
import { useParams } from 'next/navigation';

export default function BlogDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const blog = blogs.find(b => b.slug === id);

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

  // Get related blogs (exclude current blog)
  const relatedBlogs = blogs.filter(b => b.id !== blog.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src={blog.image.startsWith('http') ? blog.image : `https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=1080&fit=crop`}
            alt={blog.title}
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
            <div className="inline-block bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-6 py-2 mb-4">
              <span className="text-sm font-bold uppercase tracking-wide">News</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4">
              {blog.title}
            </h1>
            <div className="flex items-center justify-center gap-6 text-sm md:text-base">
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{blog.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{blog.author}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

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
                        src={relatedBlog.image.startsWith('http') ? relatedBlog.image : `https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop`}
                        alt={relatedBlog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                          News
                        </span>
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{relatedBlog.date}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-secondary group-hover:text-primary transition-colors duration-300 mb-3">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedBlog.description}
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
