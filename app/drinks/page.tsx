'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllDrinks, getDrinksByCategory, type Drink } from '@/lib/drinksData';
import { drinkPromos, type DrinkPromo } from '@/lib/drinkPromos';
import BrandPackImage from '@/components/BrandPackImage';
import { usePromo } from '@/hooks/usePromo';
import { Tag, Search, ShoppingBag, Percent, Calendar } from 'lucide-react';
import { DealCountdownBadge } from '@/components/DealCountdownBadge';
import { CAMPAIGN } from '@/lib/campaignImages';
import CategoryBand from '@/components/CategoryBand';
import FeaturedPromo from '@/components/FeaturedPromo';
import FilterChips from '@/components/FilterChips';
import SocialShare from '@/components/SocialShare';
import { savingsChipClass } from '@/lib/semantic';

export default function DrinksPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Drink['category']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { currentPromo, currentIndex, goToPromo, featuredDeals } = usePromo('drinks');

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

  const activeLabel =
    categories.find((category) => category.id === selectedCategory)?.label ?? 'ALL DRINKS';
  const showBrandPicker = selectedCategory === 'all' && !searchQuery;

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
        <CategoryBand
          heading="h1"
          field="mist"
          title="Ice-cold, all day"
          subtitle="Fountain drinks, energy, and bottled water from the brands you know."
          cta={{ label: 'Join LaMa Rewards', href: '/rewards' }}
          ctaNote="Free to join · earn on every visit"
          imageSrc={CAMPAIGN.cutDrinks}
          imageAlt="Fountain drink, bottled water and an energy can"
        />

      {currentPromo && featuredDeals.length > 0 && (
        <FeaturedPromo
          current={currentPromo}
          currentIndex={currentIndex}
          items={featuredDeals}
          onGoTo={goToPromo}
        />
      )}

      {/* Category Filters and Search */}
      <section className="py-4 md:py-5 px-0 md:px-6 bg-white border-b border-gray-200">
        <div className="container-standard">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="w-full md:flex-1 min-w-0">
              <FilterChips
                items={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
                ariaLabel="Drink categories"
              />
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2 w-full px-4 md:px-0 md:w-auto md:flex-1 md:max-w-md">
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

      <section id="drink-results" className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard space-y-6">
          <h2 className="typography-h2 text-secondary">{activeLabel}</h2>

          {filteredDrinks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No drinks found. Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filteredDrinks.map((drink, index) => (
                <motion.div
                  key={drink.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.04 }}
                  className="card relative overflow-hidden group"
                >
                  <div className="absolute z-10 top-3 left-3 flex flex-col gap-2">
                    {drink.savings && (
                      <span className={savingsChipClass(drink.savings)}>{drink.savings}</span>
                    )}
                    {drink.expirationDate && (
                      <DealCountdownBadge target={drink.expirationDate} compact />
                    )}
                  </div>
                  <div className="absolute z-10 top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <SocialShare url="/drinks" title={drink.title} description={drink.description} />
                  </div>
                  <div className="relative w-full aspect-video overflow-hidden bg-white min-h-[11rem]">
                    <div className="absolute inset-4">
                      <Image
                        src={drink.image}
                        alt={drink.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </div>
                  <div className="card-body flex flex-col gap-2">
                    <h3 className="text-sm md:text-base font-semibold text-secondary leading-snug line-clamp-2">
                      {drink.title}
                    </h3>
                    <span className="text-sm md:text-base font-black text-primary">
                      {drink.price || '$0.00'}
                    </span>
                    <p className="typography-body-sm text-gray-600 line-clamp-2">{drink.description}</p>
                    <span className="btn-primary w-full !text-sm mt-2">Redeem Now</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showBrandPicker && (
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
                      <div className="brand-tile">
                        <div className="brand-tile-pack">
                          <BrandPackImage brand={brand} alt={brand} />
                        </div>
                        <div className="card-body flex items-center justify-center">
                          <p className="typography-h4 text-[#1A1A1A] text-center group-hover:text-primary transition-colors duration-[220ms]">
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
      )}
    </div>
  );
}
