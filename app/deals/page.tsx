'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { deals, getDealsByCategory, type Deal } from '@/lib/dealsData';
import { ArrowRight, Tag, Coffee, Zap, Gift, Users } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';
import { usePromo } from '@/hooks/usePromo';

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Deal['category']>('all');
  const { currentPromo, currentIndex, totalPromos, goToPromo, featuredDeals } = usePromo();

  const categories = [
    { id: 'all' as const, label: 'ALL DEALS', icon: Tag },
    { id: 'meal-deals' as const, label: 'FOOD', icon: Coffee },
    { id: 'daily-specials' as const, label: 'DRINKS', icon: Zap },
    { id: 'weekly-promotions' as const, label: 'SNACKS', icon: Gift },
    { id: 'combo-offers' as const, label: 'COMBOS', icon: Tag },
    { id: 'member-exclusive' as const, label: 'MEMBER EXCLUSIVE', icon: Users },
  ];

  const filteredDeals = selectedCategory === 'all' 
    ? getAllDeals() 
    : getDealsByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        {/* Glass Banner - Floating Inside Hero */}
        <GlassBanner />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1920&h=1080&fit=crop"
            alt="Deals Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-40 h-full flex items-start justify-center pt-4 px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Deals
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Featured Deal Section */}
      {currentPromo && featuredDeals.length > 0 && (
        <section className="py-12 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-6 md:p-8 lg:p-12"
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="grid md:grid-cols-2 gap-8 items-center"
                  >
                    <div className="relative w-full aspect-video md:aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={currentPromo.image}
                        alt={currentPromo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
                        {currentPromo.title}
                      </h2>
                      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                        {currentPromo.description}
                      </p>
                      <div className="mb-6">
                        <Link
                          href="/stores"
                          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105"
                          style={{ backgroundColor: '#FF6B35' }}
                        >
                          Find a Store
                        </Link>
                      </div>
                      <p className="text-sm text-gray-500">
                        *Valid at participating locations through Sunday. While supplies last.
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dot Indicators */}
                {totalPromos > 1 && (
                  <div className="flex items-center justify-center gap-2.5 mt-8">
                    {featuredDeals.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToPromo(index)}
                        className="focus:outline-none transition-all p-1"
                        aria-label={`Go to promo ${index + 1}`}
                      >
                        <motion.div
                          className={`rounded-full transition-all ${
                            index === currentIndex
                              ? 'w-8 h-2.5 bg-primary'
                              : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                          }`}
                          whileHover={{ scale: 1.3 }}
                          whileTap={{ scale: 0.9 }}
                          animate={{
                            opacity: index === currentIndex ? 1 : 0.5,
                          }}
                          style={index === currentIndex ? { backgroundColor: '#FF6B35' } : {}}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section className="py-8 px-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="flex flex-wrap gap-3 md:gap-4 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                  style={selectedCategory === category.id ? { backgroundColor: '#FF6B35' } : {}}
                >
                  <Icon size={18} />
                  {category.label}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      {/* Deals Grid */}
      <section className="py-12 md:py-16 px-6" style={{ backgroundColor: '#E5E5E5' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-3 right-3 bg-white/90 hover:bg-white text-secondary px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                    Save deal
                  </button>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {deal.description}
                  </p>
                  <Link
                    href={`/deals/${deal.id}`}
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105 w-full justify-center"
                    style={{ backgroundColor: '#FF6B35' }}
                  >
                    View Detail
                  </Link>
                </div>
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

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
              Never Miss a Deal
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Sign up for our newsletter and get the latest promotions delivered straight to your inbox.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Handle newsletter subscription
              }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
              />
              <button
                type="submit"
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 whitespace-nowrap"
                style={{ backgroundColor: '#FF6B35' }}
              >
                Subscribe Now
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
