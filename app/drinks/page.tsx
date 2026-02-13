'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllDrinks, getDrinksByCategory, type Drink } from '@/lib/drinksData';
import { usePromo } from '@/hooks/usePromo';
import { Tag, Search, ShoppingBag, Percent, Calendar, ArrowRight } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';

export default function DrinksPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Drink['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentPromo, currentIndex, totalPromos, goToPromo, featuredDeals } = usePromo();

  const categories: Array<{ id: 'all' | Drink['category']; label: string; icon: typeof Tag }> = [
    { id: 'all' as const, label: 'ALL DRINKS', icon: Tag },
    { id: 'buy-2-save' as const, label: 'BUY 2 & SAVE', icon: ShoppingBag },
    { id: 'discounted' as const, label: 'DISCOUNTED', icon: Percent },
    { id: 'seasonal' as const, label: 'SEASONAL', icon: Calendar },
  ];

  let filteredDrinks =
    selectedCategory === 'all'
      ? getAllDrinks()
      : getDrinksByCategory(selectedCategory);

  // Apply search filter
  if (searchQuery) {
    filteredDrinks = filteredDrinks.filter(drink =>
      drink.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drink.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1920&h=1080&fit=crop"
            alt="Drinks Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        {/* Container for Title and Glass Banner */}
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mb-6 sm:mb-6 md:mb-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black">
              Drinks
            </h1>
          </motion.div>
          {/* Glass Banner - Floating Inside Hero */}
          <GlassBanner />
        </div>
      </section>

      {/* Featured Drink Promo Section */}
      {currentPromo && featuredDeals.length > 0 && (
        <section className="py-6 px-4 sm:px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded p-4 sm:p-5 md:p-6 lg:p-8"
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="grid md:grid-cols-2 gap-4 md:gap-6 items-center"
                  >
                    <div className="relative w-full aspect-[4/3] md:aspect-[3/2] rounded overflow-hidden">
                      <Image
                        src={currentPromo.image}
                        alt={currentPromo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-secondary mb-4">
                        {currentPromo.title}
                      </h2>
                      <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                        {currentPromo.description}
                      </p>
                      <div className="mb-6">
                        <Link
                          href="/stores"
                          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded font-bold transition-all hover:scale-105 min-h-[44px] text-sm sm:text-base"
                          style={{ backgroundColor: '#FF6B35' }}
                        >
                          Find a Store
                        </Link>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500">
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

      {/* Category Filters and Search */}
      <section className="py-8 px-4 sm:px-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* Category Filters */}
            <nav className="flex flex-wrap gap-3 md:gap-4 justify-center flex-1">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 sm:px-6 py-3 rounded text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
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

            {/* Search Bar */}
            <div className="flex items-center gap-2 w-full md:w-auto md:min-w-[350px]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for a specific drink..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      // Search is already handled by the filter, this is just for UX
                    }
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                onClick={() => {
                  // Search is already handled by the filter state
                }}
                className="px-4 py-3 rounded bg-primary text-white font-bold transition-all hover:scale-105 min-h-[44px] flex items-center justify-center"
                style={{ backgroundColor: '#FF6B35' }}
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Drinks Grid */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 deals-grid">
            {filteredDrinks.slice(0, 6).map((drink: Drink, index: number) => (
              <motion.div
                key={drink.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white/95 rounded overflow-hidden border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ borderColor: '#FF6B35' }}
              >
                {/* Image */}
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={drink.image}
                    alt={drink.title}
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
                <div className="p-3 sm:p-4 md:p-5">
                  <div className="flex flex-col gap-2.5">
                    <h3 className="text-[11px] sm:text-[13px] md:text-[15px] font-black text-secondary">
                      {drink.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {drink.description}
                    </p>
                    <div className="mt-1 flex items-center justify-between gap-2 flex-wrap">
                      {drink.savings && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-primary text-xs font-semibold whitespace-nowrap">
                          {drink.savings}
                        </span>
                      )}
                      <Link
                        href={`/drinks/${drink.id}`}
                        className="ml-auto inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap"
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

          {filteredDrinks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No drinks found. Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
