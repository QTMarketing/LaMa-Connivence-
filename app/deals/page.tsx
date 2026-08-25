'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllDeals, getDealsByCategory, type Deal } from '@/lib/dealsData';
import { Tag, Zap, Pizza, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePromo } from '@/hooks/usePromo';
import { DealCountdownBadge } from '@/components/DealCountdownBadge';
import SocialShare from '@/components/SocialShare';
import CategoryBand from '@/components/CategoryBand';
import FeaturedPromo from '@/components/FeaturedPromo';
import FilterChips from '@/components/FilterChips';
import { CAMPAIGN, resolveDealImage } from '@/lib/campaignImages';
import { savingsChipClass } from '@/lib/semantic';

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Deal['category']>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [showCategoryBar, setShowCategoryBar] = useState(true);
  const lastScrollY = useRef(0);
  const { currentPromo, currentIndex, goToPromo, featuredDeals } = usePromo();

  const categories: Array<{ id: 'all' | Deal['category']; label: string; icon: typeof Tag }> = [
    { id: 'all' as const, label: 'ALL DEALS', icon: Tag },
    { id: 'grill-items' as const, label: 'GRILL ITEMS', icon: Zap },
    { id: 'mix-and-match' as const, label: 'MIX & MATCH', icon: Pizza },
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

  // Hide secondary sticky category bar when scrolling down on mobile,
  // and reveal it when scrolling up or near the top.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const isMobile = window.innerWidth < 768;

      if (!isMobile) {
        setShowCategoryBar(true);
        lastScrollY.current = y;
        return;
      }

      if (y < 140) {
        setShowCategoryBar(true);
      } else if (y > lastScrollY.current + 6) {
        setShowCategoryBar(false);
      } else if (y < lastScrollY.current - 6) {
        setShowCategoryBar(true);
      }

      lastScrollY.current = y;
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
        <CategoryBand
          heading="h1"
          field="peach"
          title="Hot off the grill"
          subtitle="Crispitos, Rollerbites and Bahama Mama, hot and ready all day."
          cta={{ label: 'Join LaMa Rewards', href: '/rewards' }}
          ctaNote="Free to join · earn on every visit"
          imageSrc={CAMPAIGN.cutCrispitos}
          imageAlt="Crispitos rolled taquitos"
        />

      {featuredDeals.length > 0 && (
        <FeaturedPromo
          current={currentPromo}
          currentIndex={currentIndex}
          items={featuredDeals}
          onGoTo={goToPromo}
          resolveImage={resolveDealImage}
        />
      )}

      {/* Category Filters – sticky on scroll */}
      <section
        className={`py-4 md:py-5 px-4 md:px-6 bg-white border-b border-gray-200 sticky top-16 lg:top-20 z-20 transition-transform duration-300 ${
          showCategoryBar ? 'translate-y-0' : '-translate-y-full md:translate-y-0'
        }`}
      >
        <div className="container-standard">
          <FilterChips
            items={categories}
            value={selectedCategory}
            onChange={handleCategoryChange}
            ariaLabel="Deal categories"
          />
        </div>
      </section>

      {/* Deals Grid */}
      <section id="deals-grid" className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 deals-grid">
            {currentDeals.map((deal: Deal, index: number) => {
              const src = resolveDealImage(deal.image);
              const isCutout = src.includes('/cut-');
              return (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="block h-full min-w-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="card relative flex h-full flex-col overflow-hidden group cursor-pointer"
                >
                  {/* Badges / urgency */}
                  <div className="absolute z-10 top-3 left-3 flex flex-col gap-2">
                    {deal.savings && (
                      <span className={savingsChipClass(deal.savings)}>
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

                  {/* Image: locked frame so mixed POS art and photos share one row height */}
                  <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-white">
                    {isCutout ? (
                    <div className="absolute inset-5 md:inset-6">
                      <Image
                        src={src}
                        alt={deal.title}
                        fill
                        className="object-contain"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    ) : (
                      <Image
                        src={src}
                        alt={deal.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="card-body flex flex-1 flex-col gap-2">
                    <h3 className="typography-h3 text-secondary line-clamp-2 min-h-[2.6em]">
                      {deal.title}
                    </h3>

                    {/* Price row - Enhanced for sales */}
                    {(deal.price || deal.originalPrice) && (
                      <div className="flex items-baseline gap-3">
                        {typeof deal.price === 'number' && (
                          <span className="text-2xl font-black text-primary">
                            ${deal.price.toFixed(2)}
                          </span>
                        )}
                        {typeof deal.originalPrice === 'number' && (
                          <div className="flex flex-col">
                            <span className="text-base md:text-lg text-gray-400 line-through">
                              ${deal.originalPrice.toFixed(2)}
                            </span>
                            {typeof deal.price === 'number' && (
                              <span className="text-xs font-semibold text-savings">
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
                        <span className="badge-urgency px-3 py-1 typography-caption font-semibold">
                          Only {deal.stockLeft} left
                        </span>
                      )}
                      {deal.expirationDate && (
                        <span className="typography-caption text-gray-500">
                          Valid until {new Date(deal.expirationDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
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
              );
            })}
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
