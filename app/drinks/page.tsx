'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllDrinks, getDrinksByCategory, type Drink } from '@/lib/drinksData';
import { usePromo } from '@/hooks/usePromo';
import { Tag, Search, ShoppingBag, Percent, Calendar, ArrowRight } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';
import { DealCountdownBadge } from '@/components/DealCountdownBadge';
import SocialShare from '@/components/SocialShare';

export default function DrinksPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Drink['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentPromo, currentIndex, totalPromos, goToPromo, featuredDeals } = usePromo('drinks');

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
    <div className="min-h-screen bg-white pb-20 md:pb-0">
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
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mb-8"
          >
            <h1 className="typography-h1 text-white">
              Drinks
            </h1>
          </motion.div>
          {/* Glass Banner - Floating Inside Hero */}
          <GlassBanner />
        </div>
      </section>

      {/* Featured Drink Promo Section */}
      {currentPromo && featuredDeals.length > 0 && (
        <section className="py-section-xs md:py-section-sm px-4 md:px-6 bg-white">
          <div className="container-standard">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-50 rounded-lg p-6 md:p-8"
            >
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="grid md:grid-cols-2 gap-6 md:gap-8 items-center"
                  >
                    <div className="relative w-full aspect-[4/3] md:aspect-[3/2] rounded-lg overflow-hidden">
                      <Image
                        src={currentPromo.image}
                        alt={currentPromo.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="typography-h2 text-secondary mb-4">
                        {currentPromo.title}
                      </h2>
                      <p className="typography-body-lg text-gray-600 mb-6">
                        {currentPromo.description}
                      </p>
                      <div className="mb-6">
                        <Link
                          href="/stores"
                          className="btn-primary"
                        >
                          Find a Store
                        </Link>
                      </div>
                      <p className="typography-caption text-gray-500">
                        *Valid at participating locations through Sunday. While supplies last.
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dot Indicators */}
                {totalPromos > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
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
      <section className="py-4 md:py-5 px-4 md:px-6 bg-white border-b border-gray-200">
        <div className="container-standard">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            {/* Category Filters */}
            <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-3 flex-1 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:overflow-visible">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`inline-flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-md typography-body-sm font-semibold transition-all min-h-[44px] border ${
                      selectedCategory === category.id
                        ? 'bg-primary text-white border-transparent shadow-sm scale-[1.02]'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
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
            <div className="flex items-center gap-2 w-full md:w-auto md:flex-1 md:max-w-md">
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
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent typography-body"
                />
              </div>
              <button
                onClick={() => {
                  // Search is already handled by the filter state
                }}
                className="btn-primary min-h-[44px]"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Drinks Grid */}
      <section className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 deals-grid">
            {filteredDrinks.slice(0, 6).map((drink: Drink, index: number) => (
              <motion.div
                key={drink.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4, boxShadow: '0 18px 30px rgba(0,0,0,0.16)' }}
                className="card relative overflow-hidden group cursor-pointer"
              >
                {/* Badges / urgency */}
                <div className="absolute z-10 top-3 left-3 flex flex-col gap-2">
                  {drink.savings && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500 text-white typography-caption font-semibold shadow">
                      {drink.savings}
                    </span>
                  )}
                  {drink.expirationDate && (
                    <DealCountdownBadge target={drink.expirationDate} compact />
                  )}
                </div>
                
                {/* Social Share - Top Right */}
                <div className="absolute z-10 top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <SocialShare 
                    url={`/drinks`}
                    title={drink.title}
                    description={drink.description}
                  />
                </div>

                {/* Image */}
                <div className="relative w-full aspect-video overflow-hidden rounded-md">
                  <Image
                    src={drink.image}
                    alt={drink.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-4 md:p-6 flex flex-col gap-3">
                  <h3 className="typography-h3 text-secondary">
                    {drink.title}
                  </h3>

                  {/* Price row – enhanced for sales */}
                  <div className="flex items-baseline gap-3 min-h-[1.75rem]">
                    <span className="text-3xl md:text-4xl font-black text-primary">
                      {drink.price || '$0.00'}
                    </span>
                  </div>

                  <p className="typography-body-sm text-gray-600 line-clamp-2">
                    {drink.description}
                  </p>

                  {/* Meta row – also fixed height for alignment */}
                  <div className="flex items-center justify-between mt-1 min-h-[1.25rem]">
                    {drink.expirationDate && (
                      <span className="typography-caption text-gray-500">
                        Ends {drink.expirationDate}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      className="btn-primary flex-1 justify-center"
                    >
                      Redeem Now
                    </motion.button>
                    <Link
                      href={`/drinks/${drink.id}`}
                      className="inline-flex items-center gap-2 typography-body-sm font-semibold text-primary hover:text-primary-dark transition-colors whitespace-nowrap"
                    >
                      Details
                      <ArrowRight size={16} />
                    </Link>
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
