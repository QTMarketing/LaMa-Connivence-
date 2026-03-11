'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllDrinks, getDrinksByCategory, type Drink } from '@/lib/drinksData';
import { drinkPromos, type DrinkPromo } from '@/lib/drinkPromos';
import { usePromo } from '@/hooks/usePromo';
import { Tag, Search, ShoppingBag, Percent, Calendar, ArrowRight } from 'lucide-react';
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

  const promosByBrand = drinkPromos.reduce<Record<string, DrinkPromo[]>>(
    (acc, promo) => {
      if (!acc[promo.brand]) acc[promo.brand] = [];
      acc[promo.brand].push(promo);
      return acc;
    },
    {},
  );

  // Sort brands by number of promos (descending) so the brands with the most offers appear first
  const sortedPromosByBrandEntries = Object.entries(promosByBrand).sort(
    (a, b) => b[1].length - a[1].length,
  );

  const brandRows: Array<{
    id: string;
    label: string;
    match: (drink: Drink) => boolean;
  }> = [
    {
      id: 'monster',
      label: 'Monster',
      match: (drink) => drink.title.toLowerCase().includes('monster'),
    },
    {
      id: 'redbull',
      label: 'RedBull',
      match: (drink) =>
        drink.title.toLowerCase().includes('red bull') ||
        drink.title.toLowerCase().includes('redbull'),
    },
    {
      id: 'c4',
      label: 'C4',
      match: (drink) => drink.title.toLowerCase().includes('c4'),
    },
    {
      id: 'ghost',
      label: 'Ghost',
      match: (drink) => drink.title.toLowerCase().includes('ghost'),
    },
    {
      id: 'celcius',
      label: 'Celcius',
      match: (drink) =>
        drink.title.toLowerCase().includes('celcius') ||
        drink.title.toLowerCase().includes('celsius'),
    },
  ];

  const hasAnyBrandDrinks = brandRows.some((brand) =>
    filteredDrinks.some((drink) => brand.match(drink)),
  );

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
        {/* Container for Title */}
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            <h1 className="typography-h1 text-white">
              Drinks
            </h1>
          </motion.div>
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

      {/* Brand picker – top 8 brands, 3 per row, large product tiles */}
      <section className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard space-y-10 md:space-y-14">
          <div className="text-center space-y-2">
            <h2 className="typography-h2 text-secondary">We Keep That Energy Going</h2>
            <p className="typography-body-sm text-gray-600">
              Choose your favorite drink brand to see all current offers.
            </p>
          </div>

          {(() => {
            const TOP_BRANDS = [
              'Monster',
              'Red Bull',
              'Celsius',
              'Ghost',
              'C4',
              'Alani Nu',
              'Pepsi',
              'Gatorade',
            ];
            const topEntries = TOP_BRANDS.filter((b) =>
              sortedPromosByBrandEntries.some(([brand]) => brand === b),
            );

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {topEntries.map((brand) => {
                  const slug = brand.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <Link
                      key={brand}
                      href={`/drinks/brand/${slug}`}
                      className="group cursor-pointer block"
                    >
                      {/* Card tile: image top, title bottom */}
                      <div className="bg-white rounded-sm overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        {/* Can image area */}
                        <div className="relative h-52 sm:h-60 md:h-64 w-full overflow-hidden">
                          <Image
                            src="/foo/C4.png"
                            alt={brand}
                            fill
                            className="object-contain p-6 drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1"
                          />
                        </div>

                        {/* Brand name strip – centred */}
                        <div className="border-t border-gray-100 px-5 py-4 flex items-center justify-center">
                          <p className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary group-hover:text-primary transition-colors leading-none text-center">
                            {brand}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Drinks by Brand – one horizontal row per brand */}
      <section className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard space-y-10 md:space-y-12">
          {brandRows.map((brand, idx) => {
            const brandDrinks = filteredDrinks.filter((drink) => brand.match(drink));

            if (brandDrinks.length === 0) return null;

            return (
              <div
                key={brand.id}
                className="space-y-4 md:space-y-5 pb-6 md:pb-8 border-b border-gray-200 last:border-b-0"
              >
                {/* Brand title */}
                <h2 className="typography-h3 md:typography-h2 text-secondary">
                  {brand.label}
                </h2>

                {/* Horizontally scrollable row – ~3 cards in view */}
                <div className="relative">
                  <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                    {brandDrinks.map((drink: Drink, index: number) => (
                      <motion.div
                        key={drink.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: index * 0.04 }}
                        whileHover={{ y: -4, boxShadow: '0 18px 30px rgba(0,0,0,0.18)' }}
                        className="card relative flex-shrink-0 w-[220px] md:w-[240px] lg:w-[260px] snap-center overflow-hidden group cursor-pointer"
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

                        {/* Social Share – Top Right */}
                        <div className="absolute z-10 top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <SocialShare
                            url={`/drinks`}
                            title={drink.title}
                            description={drink.description}
                          />
                        </div>

                        {/* Image – deals-style aspect ratio */}
                        <div className="relative w-full aspect-video overflow-hidden rounded-md">
                          <Image
                            src="/foo/C4.png"
                            alt={drink.title}
                            fill
                            className="object-contain bg-[#F5F5F5] transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Content – compact height */}
                        <div className="p-3 md:p-4 flex flex-col gap-2">
                          <h3 className="text-sm md:text-base font-semibold text-secondary leading-snug line-clamp-2">
                            {drink.title}
                          </h3>

                          {/* Price row */}
                          <div className="flex flex-col gap-0.5 min-h-[1.6rem]">
                            <span className="text-sm md:text-base font-black text-primary">
                              {drink.price || '$0.00'}
                            </span>
                            <span className="typography-caption text-gray-500">
                              Price may vary by store.
                            </span>
                          </div>

                          <p className="typography-body-sm text-gray-600 line-clamp-2">
                            {drink.description}
                          </p>

                          {/* Meta row */}
                          <div className="flex items-center justify-between mt-1 min-h-[1.1rem]">
                            {drink.expirationDate && (
                              <span className="typography-caption text-gray-500">
                                Ends {drink.expirationDate}
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex items-center justify-center gap-2 border-t border-gray-100 pt-3">
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.96 }}
                              type="button"
                              className="inline-flex items-center justify-center w-full px-4 py-2 rounded-md bg-primary text-white text-xs md:text-sm font-semibold hover:brightness-110 transition-all"
                            >
                              Redeem Now
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Fallback: if no brand match yet (current data is generic), show a single All Drinks row */}
          {!hasAnyBrandDrinks && filteredDrinks.length > 0 && (
            <div className="space-y-4 md:space-y-5">
              <h2 className="typography-h3 md:typography-h2 text-secondary">
                All Drinks
              </h2>
              <div className="relative">
                <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                  {filteredDrinks.map((drink: Drink, index: number) => (
                    <motion.div
                      key={drink.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: index * 0.04 }}
                      whileHover={{ y: -4, boxShadow: '0 18px 30px rgba(0,0,0,0.18)' }}
                      className="card relative flex-shrink-0 w-[220px] md:w-[240px] lg:w-[260px] snap-center overflow-hidden group cursor-pointer"
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

                      {/* Social Share – Top Right */}
                      <div className="absolute z-10 top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <SocialShare
                          url={`/drinks`}
                          title={drink.title}
                          description={drink.description}
                        />
                      </div>

                      {/* Image – deals-style aspect ratio */}
                      <div className="relative w-full aspect-video overflow-hidden rounded-md">
                        <Image
                          src="/foo/C4.png"
                          alt={drink.title}
                          fill
                          className="object-contain bg-[#F5F5F5] transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Content – compact height */}
                      <div className="p-3 md:p-4 flex flex-col gap-2">
                        <h3 className="text-sm md:text-base font-semibold text-secondary leading-snug line-clamp-2">
                          {drink.title}
                        </h3>

                        {/* Price row */}
                        <div className="flex flex-col gap-0.5 min-h-[1.6rem]">
                          <span className="text-sm md:text-base font-black text-primary">
                            {drink.price || '$0.00'}
                          </span>
                          <span className="typography-caption text-gray-500">
                            Price may vary by store.
                          </span>
                        </div>

                        <p className="typography-body-sm text-gray-600 line-clamp-2">
                          {drink.description}
                        </p>

                        {/* Meta row */}
                        <div className="flex items-center justify-between mt-1 min-h-[1.1rem]">
                          {drink.expirationDate && (
                            <span className="typography-caption text-gray-500">
                              Ends {drink.expirationDate}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 flex items-center justify-center gap-2 border-t border-gray-100 pt-3">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                            type="button"
                            className="inline-flex items-center justify-center w-full px-4 py-2 rounded-md bg-primary text-white text-xs md:text-sm font-semibold hover:brightness-110 transition-all"
                          >
                            Redeem Now
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {filteredDrinks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No drinks found. Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
