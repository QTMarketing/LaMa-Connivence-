'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/productData';

export default function BlogPage() {
  return (
    <div>
      {/* Find your fave Section */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary">
                Find your fave
              </h2>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-primary text-gray-900 hover:text-primary px-6 py-3 rounded-lg font-bold transition-all duration-300 group hover:scale-105"
              >
                Shop Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl">
              We both know you get your best recs from your friends. So take it from us, these are some products we think you'll love.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => p.featured).slice(0, 3).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
              >
                <Link
                  href={`/products/${product.category}`}
                  className="block bg-white rounded-xl border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary transition-all duration-300 group"
                >
                  <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg">Featured</span>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl md:text-2xl font-black text-secondary group-hover:text-primary transition-colors duration-300 flex-1">
                        {product.name}
                      </h3>
                      {product.price && (
                        <span className="text-lg font-black text-primary ml-2">{product.price}</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center text-primary font-bold text-sm group-hover:underline">
                      View Details
                      <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
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
