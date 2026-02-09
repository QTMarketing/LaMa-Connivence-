'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllDeals, getDealsByCategory, type Deal } from '@/lib/dealsData';
import { Tag, Coffee, Zap, Pizza, ArrowRight } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';
import { usePromo } from '@/hooks/usePromo';

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Deal['category']>('all');
  const { currentPromo, currentIndex, totalPromos, goToPromo, featuredDeals } = usePromo();

  const categories: Array<{ id: 'all' | Deal['category']; label: string; icon: typeof Tag }> = [
    { id: 'all' as const, label: 'ALL DEALS', icon: Tag },
    // Pizza-focused deals (use meal-deals category)
    { id: 'meal-deals' as const, label: 'PIZZA', icon: Pizza },
    // Meal combo offers
    { id: 'combo-offers' as const, label: 'MEAL DEALS', icon: Tag },
    // Coffee-specific daily specials
    { id: 'daily-specials' as const, label: 'COFFEE', icon: Coffee },
    // General drinks / weekly promos
    { id: 'weekly-promotions' as const, label: 'DRINKS', icon: Zap },
  ];

  const filteredDeals =
    selectedCategory === 'all'
      ? getAllDeals()
      : getDealsByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
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
        {/* Container for Title and Glass Banner */}
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mb-6 sm:mb-6 md:mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
              Deals
            </h1>
          </motion.div>
          {/* Glass Banner - Floating Inside Hero */}
          <GlassBanner />
        </div>
      </section>

      {/* Featured Deal Section */}
      {currentPromo && featuredDeals.length > 0 && (
        <section className="py-12 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12"
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
                          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 min-h-[44px]"
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
                  className={`px-4 sm:px-6 py-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 min-h-[44px] ${
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
      <section className="py-12 md:py-16 px-6" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredDeals.map((deal: Deal, index: number) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white/95 rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ borderColor: '#FF6B35' }}
              >
                {/* Image */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {/* Save badge */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/90 text-xs font-semibold text-gray-800 shadow-sm">
                      Save deal
                    </span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 sm:p-5">
                  <div className="flex flex-col gap-2.5">
                  <h3 className="text-base sm:text-lg md:text-xl font-black text-secondary">
                    {deal.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {deal.description}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    {deal.savings && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-primary text-xs font-semibold">
                        {deal.savings}
                      </span>
                    )}
                    <Link
                      href={`/deals/${deal.id}`}
                      className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                    >
                      View Detail
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                  </div>
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

    </div>
  );
}
