'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllDeals, getDealsByCategory, type Deal } from '@/lib/dealsData';
import { Tag, Coffee, Zap, Pizza, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';
import { usePromo } from '@/hooks/usePromo';
import { DealCountdown } from './DealCountdown';
import { DealCountdownBadge } from '@/components/DealCountdownBadge';
import SocialShare from '@/components/SocialShare';

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Deal['category']>('all');
  const [currentPage, setCurrentPage] = useState(0);
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

  // Pagination: 6 deals per page (2 rows of 3)
  const dealsPerPage = 6;
  const totalPages = Math.ceil(filteredDeals.length / dealsPerPage);
  const startIndex = currentPage * dealsPerPage;
  const endIndex = startIndex + dealsPerPage;
  const currentDeals = filteredDeals.slice(startIndex, endIndex);

  // Reset to first page when category changes
  const handleCategoryChange = (category: 'all' | Deal['category']) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
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
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mb-8"
          >
            <h1 className="typography-h1 text-white">
              Deals
            </h1>
          </motion.div>
          {/* Glass Banner - Floating Inside Hero */}
          <GlassBanner />
        </div>
      </section>

      {/* Featured Deal Section */}
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
                    transition={{ duration: 0.5, ease: "easeInOut" }}
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

      {/* Category Filters – sticky on scroll */}
      <section className="py-4 md:py-5 px-4 md:px-6 bg-white border-b border-gray-200 sticky top-[72px] z-20">
        <div className="container-standard">
          <nav className="flex flex-wrap items-center justify-center gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-2 md:pb-0 md:overflow-visible">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
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
        </div>
      </section>

      {/* Deals Grid */}
      <section id="deals-grid" className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 deals-grid">
            {currentDeals.map((deal: Deal, index: number) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4, boxShadow: '0 18px 30px rgba(0,0,0,0.16)' }}
                  className="card relative overflow-hidden group cursor-pointer"
                >
                  {/* Badges / urgency */}
                  <div className="absolute z-10 top-3 left-3 flex flex-col gap-2">
                    {deal.savings && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-500 text-white typography-caption font-semibold shadow">
                        {deal.savings}
                      </span>
                    )}
                    {deal.expirationDate && (
                      <DealCountdownBadge target={deal.expirationDate} compact />
                    )}
                  </div>
                  
                  {/* Social Share - Top Right */}
                  <div 
                    className="absolute z-10 top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.preventDefault()}
                  >
                    <SocialShare 
                      url={`/deals/${deal.id}`}
                      title={deal.title}
                      description={deal.description}
                    />
                  </div>

                  {/* Image */}
                  <div className="relative w-full aspect-video overflow-hidden rounded-md">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 md:p-6 flex flex-col gap-3">
                    <h3 className="typography-h3 text-secondary">
                      {deal.title}
                    </h3>

                    {/* Price row - Enhanced for sales */}
                    {(deal.price || deal.originalPrice) && (
                      <div className="flex items-baseline gap-3">
                        {typeof deal.price === 'number' && (
                          <span className="text-3xl md:text-4xl font-black text-primary">
                            ${deal.price.toFixed(2)}
                          </span>
                        )}
                        {typeof deal.originalPrice === 'number' && (
                          <div className="flex flex-col">
                            <span className="text-base md:text-lg text-gray-400 line-through">
                              ${deal.originalPrice.toFixed(2)}
                            </span>
                            {typeof deal.price === 'number' && (
                              <span className="text-xs text-green-600 font-semibold">
                                Save ${(deal.originalPrice - deal.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <p className="typography-body-sm text-gray-600 line-clamp-2">
                      {deal.description}
                    </p>

                    {/* Urgency indicators */}
                    <div className="flex items-center justify-between mt-1 flex-wrap gap-2">
                      {typeof deal.stockLeft === 'number' && deal.stockLeft < 20 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-700 typography-caption font-semibold">
                          ⚡ Only {deal.stockLeft} left!
                        </span>
                      )}
                      {deal.expirationDate && (
                        <span className="typography-caption text-gray-500">
                          Valid until {new Date(deal.expirationDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="btn-primary flex-1 justify-center text-center">
                        Redeem Now
                      </span>
                      <span className="inline-flex items-center gap-2 typography-body-sm font-semibold text-primary whitespace-nowrap">
                        Details
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {filteredDeals.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No deals found in this category.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredDeals.length > dealsPerPage && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-all ${
                  currentPage === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:scale-105'
                }`}
                style={currentPage > 0 ? { backgroundColor: '#FF6B35' } : {}}
                aria-label="Previous page"
              >
                <ChevronLeft size={20} />
                Previous
              </button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-10 h-10 rounded font-bold transition-all ${
                      currentPage === i
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                    style={currentPage === i ? { backgroundColor: '#FF6B35' } : {}}
                    aria-label={`Go to page ${i + 1}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded font-bold transition-all ${
                  currentPage === totalPages - 1
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:scale-105'
                }`}
                style={currentPage < totalPages - 1 ? { backgroundColor: '#FF6B35' } : {}}
                aria-label="Next page"
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Sticky bottom CTA on mobile */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between gap-3 md:hidden">
        <span className="typography-body-sm font-semibold">
          See today&apos;s hot deals
        </span>
        <a href="#deals-grid" className="btn-primary px-4 py-2">
          View Deals
        </a>
      </div>

    </div>
  );
}
