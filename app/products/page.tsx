'use client';

import { motion } from 'framer-motion';
import { Coffee, ShoppingBag, IceCream, ShoppingCart, Package, UtensilsCrossed, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Products() {
  const productCategories = [
    {
      href: '/products/hot-beverages',
      icon: Coffee,
      title: 'Hot Beverages',
      description: 'Freshly brewed coffee, cappuccino, and specialty drinks.',
    },
    {
      href: '/products/fresh-food',
      icon: UtensilsCrossed,
      title: 'Fresh Food',
      description: 'Hot dogs, pizza, sandwiches, and made-fresh options.',
    },
    {
      href: '/products/cold-drinks',
      icon: IceCream,
      title: 'Cold Drinks',
      description: 'Refreshing beverages, sodas, and cold treats.',
    },
    {
      href: '/products/snacks',
      icon: Package,
      title: 'Snacks',
      description: 'Chips, candy, and your favorite convenience snacks.',
    },
    {
      href: '/products/grocery',
      icon: ShoppingCart,
      title: 'Grocery',
      description: 'Everyday essentials and household items.',
    },
    {
      href: '/products/services',
      icon: ShoppingBag,
      title: 'Services',
      description: 'Additional services and conveniences we offer.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-secondary mb-6"
          >
            Our Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto"
          >
            Explore our wide range of products and services. Everything you need, right in your neighborhood.
          </motion.p>
        </div>
      </section>

      {/* Product Categories Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productCategories.map((category, index) => (
              <motion.div
                key={category.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={category.href}
                  className="block bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-primary transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <category.icon className="w-12 h-12 text-primary group-hover:scale-110 transition-transform" />
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
