'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PRODUCT_CATEGORIES } from '@/lib/products/categories';

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Our Products"
        subtitle="Explore our wide selection of products and categories."
        imageAlt="LaMa food on orange"
      />
      <section className="section">
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/products/${category.slug}`}
                  className="card p-6 block group hover:shadow-lg transition-all"
                >
                  <h3 className="typography-h3 text-secondary mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="typography-body text-gray-600 mb-4">{category.blurb}</p>
                  <div className="inline-flex items-center gap-2 text-primary font-semibold">
                    View Products
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
