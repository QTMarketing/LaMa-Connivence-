'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { getProductsByCategory, getFeaturedProduct } from '@/lib/productData';
import Image from 'next/image';

export default function FreshFoodPage() {
  const products = getProductsByCategory('fresh-food');
  const featured = getFeaturedProduct('fresh-food') || products[0];
  const regularProducts = products.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/products" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <UtensilsCrossed className="text-primary" size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-secondary mb-4">
              Fresh Food
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Made fresh daily. Hot dogs, pizza, sandwiches, and more prepared with quality ingredients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Product */}
      {featured && (
        <section className="px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
            >
              <div className="md:flex">
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                  <span className="text-primary font-bold text-sm mb-2">FEATURED</span>
                  <h2 className="text-4xl md:text-5xl font-black text-secondary mb-4">
                    {featured.name}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {featured.description}
                  </p>
                  {featured.price && (
                    <div className="text-3xl font-black text-primary mb-6">
                      {featured.price}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black text-secondary mb-8">All Fresh Food</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  {product.price && (
                    <div className="text-xl font-black text-primary">
                      {product.price}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
