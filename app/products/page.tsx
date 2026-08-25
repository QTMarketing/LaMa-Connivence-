'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ProductsPage() {
  const categories = [
    { name: 'Cold Drinks', href: '/products/cold-drinks', description: 'Refreshing beverages' },
    { name: 'Hot Beverages', href: '/products/hot-beverages', description: 'Coffee and tea' },
    { name: 'Fresh Food', href: '/products/fresh-food', description: 'Daily prepared meals' },
    { name: 'Snacks', href: '/products/snacks', description: 'Chips, candy, and more' },
    { name: 'Grocery', href: '/products/grocery', description: 'Essential items' },
  ];

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
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={category.href}
                  className="card p-6 block group hover:shadow-lg transition-all"
                >
                  <h3 className="typography-h3 text-secondary mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="typography-body text-gray-600 mb-4">{category.description}</p>
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
