'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Press Room"
        subtitle="Latest news, press releases, and media resources."
        imageAlt="LaMa food on orange"
      />
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
