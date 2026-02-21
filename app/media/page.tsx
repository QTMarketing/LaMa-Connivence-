'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Press Room"
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
              <h1 className="typography-h1 text-white mb-4">Press Room</h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                Latest news, press releases, and media resources.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-standard">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/media/blog"
                className="card p-6 block group hover:shadow-lg transition-all"
              >
                <h2 className="typography-h2 text-secondary mb-4 group-hover:text-primary transition-colors">
                  Blog & News
                </h2>
                <p className="typography-body text-gray-600 mb-4">
                  Stay updated with our latest news, updates, and stories.
                </p>
                <div className="inline-flex items-center gap-2 text-primary font-semibold">
                  Read More
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
