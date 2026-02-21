'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
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
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Products"
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
              <h1 className="typography-h1 text-white mb-4">Our Products</h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                Explore our wide selection of products and categories.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
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
