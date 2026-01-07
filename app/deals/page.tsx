'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deals, getDealsByCategory, type Deal } from '@/lib/dealsData';
import { ArrowRight } from 'lucide-react';

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Deal['category']>('all');

  const categories = [
    { id: 'all' as const, label: 'All Deals' },
    { id: 'meal-deals' as const, label: 'Meal Deals' },
    { id: 'daily-specials' as const, label: 'Daily Specials' },
    { id: 'weekly-promotions' as const, label: 'Weekly Promotions' },
    { id: 'combo-offers' as const, label: 'Combo Offers' },
  ];

  const filteredDeals = selectedCategory === 'all' 
    ? deals 
    : getDealsByCategory(selectedCategory);

  const featuredDeal = deals.find(d => d.featured);

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28">
      {/* Hero Section */}
      <section className="relative bg-secondary py-16 md:py-24 px-6" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              <span className="italic font-light text-4xl md:text-5xl">The star of</span>{' '}
              <span>Your Deals</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              We'll let you in on a little secret: You can save more with your convenience. Broaden your savings with some of our featured deals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Deal Section */}
      {featuredDeal && (
        <section className="py-12 md:py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-6 md:p-8 lg:p-12"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="relative w-full aspect-video md:aspect-square rounded-xl overflow-hidden">
                  <Image
                    src={featuredDeal.image}
                    alt={featuredDeal.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="inline-block bg-primary text-white text-sm font-bold px-3 py-1 rounded mb-4">
                    Featured Deal
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
                    {featuredDeal.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {featuredDeal.description}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-2xl font-black text-primary">{featuredDeal.savings}</span>
                    {featuredDeal.expirationDate && (
                      <span className="text-sm text-gray-500">
                        Expires: {new Date(featuredDeal.expirationDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/stores"
                    className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-primary text-gray-900 hover:text-primary px-6 py-3 rounded-lg font-bold transition-colors"
                  >
                    Get This Deal
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section className="py-8 px-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={selectedCategory === category.id ? { backgroundColor: '#FF6B35' } : {}}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/deals/${deal.id}`}
                  className="block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary transition-all group"
                >
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded">
                        {deal.savings}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs font-bold text-primary uppercase tracking-wide">
                        {deal.category.replace('-', ' ')}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {deal.description}
                    </p>
                    {deal.expirationDate && (
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">
                          Expires: {new Date(deal.expirationDate).toLocaleDateString()}
                        </span>
                        <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                    {!deal.expirationDate && (
                      <div className="flex items-center justify-end pt-4 border-t border-gray-100">
                        <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredDeals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No deals found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-secondary mb-4">
              Ready to Save?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Visit your nearest Lama location to take advantage of these great deals.
            </p>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 bg-secondary border-2 border-primary text-white px-8 py-4 rounded-lg font-bold uppercase transition-all hover:border-primary-dark"
              style={{ backgroundColor: '#1A1A1A', borderColor: '#FF6B35' }}
            >
              Find a Store
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
