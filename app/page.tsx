'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, ShoppingBag, IceCream, ShoppingCart, Package, UtensilsCrossed, MapPin, ArrowRight, Gift, Star, TrendingUp, Zap, Smartphone, Instagram, Facebook, Twitter, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getHomepagePromos, getFeaturedDeals } from '@/lib/dealsData';
import { products } from '@/lib/productData';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [currentDealsIndex, setCurrentDealsIndex] = useState(0);
  const dealsCarouselRef = useRef<HTMLDivElement>(null);

  // Track scroll position to update active card
  useEffect(() => {
    const carousel = dealsCarouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = 380; // base card width
      const gap = 24; // gap-6 = 24px
      const cardWidthWithGap = cardWidth + gap;
      
      // Find which card is most visible
      let activeIndex = 0;
      if (scrollLeft > 0) {
        // First card is wider, so we need to account for that
        const firstCardWidth = 540; // active card width
        if (scrollLeft < firstCardWidth) {
          activeIndex = 0;
        } else {
          // After first card, calculate based on standard width
          const remainingScroll = scrollLeft - firstCardWidth;
          activeIndex = Math.floor(remainingScroll / cardWidthWithGap) + 1;
        }
      }
      
      setCurrentDealsIndex(activeIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero slides data - Complete banners with both text and images
  const heroSlides = [
    {
      id: 1,
      italicText: 'Convenience',
      headline: 'LIKE YOU MEAN IT',
      bodyText: "We go all in on convenience. Lama is full of flavor, freshness and community spirit, bringing bold energy to every visit. We've got classic coffee, fresh food, and everyday essentials — plus specialty drinks and made-fresh meals for those who like to push boundaries. Ready yet? We thought so.",
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=1600&fit=crop',
      alt: 'Lama convenience store products',
      ctaText: 'Find a Store',
      ctaLink: '/stores',
    },
    {
      id: 2,
      italicText: 'Fresh & Fast',
      headline: 'COFFEE DEALS',
      bodyText: 'Start your day right with our premium coffee selection. Freshly brewed daily, we offer everything from classic espresso to specialty lattes. Get 20% off any coffee drink every Monday. Perfect for your morning routine or afternoon pick-me-up.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&h=1600&fit=crop',
      alt: 'Premium coffee selection',
      ctaText: 'View Coffee Deals',
      ctaLink: '/deals',
    },
    {
      id: 3,
      italicText: 'Hot & Ready',
      headline: 'FAST FOOD DEALS',
      bodyText: 'Hungry for something delicious? Our made-fresh fast food hits the spot. Hot dogs, pizza, sandwiches, and more — all made to order. Grab a lunch combo: hot dog or sandwich plus chips and drink for just $6.99. Available daily!',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=1600&fit=crop',
      alt: 'Fresh fast food options',
      ctaText: 'View Food Deals',
      ctaLink: '/deals',
    },
  ];

  // Promo slides data
  const promoSlides = [
    {
      id: 1,
      title: 'Special Promotion',
      description: 'Discover our amazing deals and special offers. Don\'t miss out on these limited-time promotions.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
      alt: 'Special Promotion',
      ctaText: 'View Deals',
      ctaLink: '/deals',
    },
    {
      id: 2,
      title: 'Weekly Specials',
      description: 'Get great discounts on your favorite snacks and beverages every week. New deals updated every Monday!',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&h=800&fit=crop',
      alt: 'Weekly Specials',
      ctaText: 'Shop Now',
      ctaLink: '/deals',
    },
    {
      id: 3,
      title: 'Combo Offers',
      description: 'Save more with our combo deals! Mix and match your favorites and get exclusive bundle pricing.',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&h=800&fit=crop',
      alt: 'Combo Offers',
      ctaText: 'Explore Combos',
      ctaLink: '/deals',
    },
    {
      id: 4,
      title: 'Fresh Daily',
      description: 'Made fresh daily! Hot food, cold drinks, and everything you need for your day-to-day convenience.',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=800&fit=crop',
      alt: 'Fresh Daily',
      ctaText: 'Find a Store',
      ctaLink: '/stores',
    },
  ];

  // Auto-advance hero slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Auto-advance promo slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoSlide((prev) => (prev + 1) % promoSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [promoSlides.length]);

  // Manual navigation functions for hero
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Manual navigation functions for promo
  const nextPromoSlide = () => {
    setCurrentPromoSlide((prev) => (prev + 1) % promoSlides.length);
  };

  const prevPromoSlide = () => {
    setCurrentPromoSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  };

  const productCategories = [
    {
      href: '/products/hot-beverages',
      icon: Coffee,
      title: 'Hot Beverages',
      description: 'Freshly brewed coffee, cappuccino, and specialty drinks.',
    },
    {
      href: '/products/fresh-food',
      icon: UtensilsCrossed,
      title: 'Fresh Food',
      description: 'Hot dogs, pizza, sandwiches, and made-fresh options.',
    },
    {
      href: '/products/cold-drinks',
      icon: IceCream,
      title: 'Cold Drinks',
      description: 'Refreshing beverages, sodas, and cold treats.',
    },
    {
      href: '/products/snacks',
      icon: Package,
      title: 'Snacks',
      description: 'Chips, candy, and your favorite convenience snacks.',
    },
    {
      href: '/products/grocery',
      icon: ShoppingCart,
      title: 'Grocery',
      description: 'Everyday essentials and household items.',
    },
    {
      href: '/products/services',
      icon: ShoppingBag,
      title: 'Services',
      description: 'Additional services and conveniences we offer.',
    },
  ];

  return (
    <>
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section - Empty Full Width Banner */}
      <section className="relative pt-0 pb-12 md:pb-16 lg:pb-20 overflow-visible">
        <div className="w-full h-[550px] md:h-[650px] lg:h-[750px] relative overflow-visible">
          {/* Fixed Rectangle Container - Orange Background - Full Width */}
          <div 
            className="w-full h-[550px] md:h-[650px] lg:h-[750px] rounded-t-none rounded-b-3xl md:rounded-b-[40px] border-2 border-t-0"
            style={{ 
              backgroundColor: '#FF6B35',
              borderColor: '#FAFAF5',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Long Rectangular Banner with Image and Content - Carousel */}
            <div className="w-full h-full flex items-center justify-center px-2 md:px-4 lg:px-6 relative group/promo">
              <div className="w-full max-w-[98%] relative">
                <AnimatePresence mode="wait">
                  {promoSlides.map((slide, index) => {
                    if (index !== currentPromoSlide) return null;
                    return (
                      <motion.div
                        key={slide.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row relative"
                      >
                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary mb-4">
                            {slide.title}
                          </h2>
                          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                            {slide.description}
                          </p>
                          <Link
                            href={slide.ctaLink}
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm md:text-base uppercase transition-all hover:bg-primary-dark hover:scale-105 w-fit"
                            style={{ backgroundColor: '#FF6B35' }}
                          >
                            {slide.ctaText}
                            <ArrowRight size={18} />
            </Link>
                        </div>
                        
                        {/* Image Section */}
                        <div className="relative w-full md:w-1/2 h-96 md:h-[500px] lg:h-[600px]">
                          <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Previous/Next Navigation Buttons (Visible on hover) */}
                <button
                  onClick={prevPromoSlide}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-lg p-3 md:p-4 shadow-lg transition-all hover:scale-110 z-30 opacity-0 group-hover/promo:opacity-100"
                  aria-label="Previous promo slide"
                  style={{ color: '#FF6B35' }}
                >
                  <ChevronLeft size={24} className="md:w-6 md:h-6" />
                </button>

                <button
                  onClick={nextPromoSlide}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-primary rounded-lg p-3 md:p-4 shadow-lg transition-all hover:scale-110 z-30 opacity-0 group-hover/promo:opacity-100"
                  aria-label="Next promo slide"
                  style={{ color: '#FF6B35' }}
                >
                  <ChevronRight size={24} className="md:w-6 md:h-6" />
                </button>

                {/* Slide Indicators - Bottom Center */}
                <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                  {promoSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPromoSlide(index)}
                      className={`transition-all duration-300 rounded-lg ${
                        index === currentPromoSlide
                          ? 'w-8 h-2 bg-primary'
                          : 'w-2 h-2 bg-gray-400 hover:bg-gray-600'
                      }`}
                      aria-label={`Go to promo slide ${index + 1}`}
                      style={index === currentPromoSlide ? { backgroundColor: '#FF6B35' } : {}}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section - Right below orange border - Aligned with white card text */}
        <div
          className="absolute left-16 md:left-20 lg:left-24 z-40"
          style={{ 
            bottom: '3px',
            transform: 'translateY(0%)'
          }}
        >
          <div className="flex flex-wrap items-center gap-8 md:gap-10 lg:gap-12">
            {/* Statistics */}
            <div className="text-center">
              <p className="text-xl md:text-2xl font-black text-secondary mb-1">25+</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Locations</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-black text-secondary mb-1">10+</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Years Serving</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-black text-secondary mb-1">150+</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Products</p>
            </div>
            
            {/* Search Bar and Find a Store Button - Reduced gap */}
            <div className="ml-4 md:ml-6 lg:ml-8 flex items-center gap-3">
              {/* Search Bar - Longer width */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2.5 border-2 rounded-lg focus:outline-none focus:border-secondary text-sm md:text-base w-56 md:w-72 lg:w-80"
                  style={{ borderColor: 'rgba(156, 163, 175, 0.3)' }}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              
              {/* Find a Store Button - Black color */}
              <Link
                href="/stores"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-sm uppercase transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#1A1A1A' }}
              >
                Find a Store
                <MapPin size={16} />
            </Link>
            </div>
          </div>
        </div>

        {/* LaMa Logo - Bottom right corner, overlapping hero and promo sections */}
        <div
          className="absolute"
          style={{ 
            right: '20px',
            bottom: '100px',
            transform: 'translateY(50%)',
            pointerEvents: 'auto',
            zIndex: 9999
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative"
            style={{ display: 'block' }}
          >
            <Image
              src="/Lama.png"
              alt="LaMa Logo"
              width={300}
              height={300}
              className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* The star of Your Deals Section - Dark Theme Carousel (Yo Quiero Style) */}
      <section className="py-16 md:py-20 lg:py-24 px-6 bg-secondary relative overflow-hidden group mt-8 md:mt-12 lg:mt-16" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-8">
              {/* Left Side - Title and Description */}
              <div className="flex-1">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                  <span className="italic font-light text-3xl md:text-4xl lg:text-5xl">The star of</span>{' '}
                  <span className="uppercase text-4xl md:text-5xl lg:text-6xl">Your Deals</span>
                </h2>
                <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-6">
                  We'll let you in on a little secret: You can save more with your convenience. Broaden your savings with some of our featured deals.
                </p>
                <Link
                  href="/deals"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-secondary px-8 py-4 rounded-lg font-bold text-base transition-all duration-300 hover:scale-105"
                  style={{ color: '#1A1A1A' }}
                >
                  Current Promos
                </Link>
              </div>

              {/* Right Side - Carousel Navigation Arrows (Visible on hover) */}
              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => {
                    if (dealsCarouselRef.current) {
                      const prevIndex = Math.max(0, currentDealsIndex - 1);
                      
                      // Get actual card widths based on viewport
                      const isMobile = window.innerWidth < 768;
                      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
                      const activeCardWidth = isMobile ? 540 : isTablet ? 600 : 650;
                      const normalCardWidth = isMobile ? 380 : isTablet ? 420 : 450;
                      const gap = 24;
                      
                      // Calculate scroll position
                      let scrollPosition = 0;
                      if (prevIndex === 0) {
                        scrollPosition = 0;
                      } else {
                        // Scroll past the first (wider) card
                        scrollPosition = activeCardWidth + gap;
                        // Add width of each normal card we need to pass
                        for (let i = 1; i < prevIndex; i++) {
                          scrollPosition += normalCardWidth + gap;
                        }
                      }
                      
                      setCurrentDealsIndex(prevIndex);
                      dealsCarouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-lg flex items-center justify-center transition-all duration-300 group"
                  aria-label="Previous deals"
                >
                  <ChevronLeft size={24} className="text-white group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    if (dealsCarouselRef.current) {
                      const maxIndex = getFeaturedDeals().length - 1;
                      const nextIndex = Math.min(maxIndex, currentDealsIndex + 1);
                      
                      // Get actual card widths based on viewport
                      const isMobile = window.innerWidth < 768;
                      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
                      const activeCardWidth = isMobile ? 540 : isTablet ? 600 : 650;
                      const normalCardWidth = isMobile ? 380 : isTablet ? 420 : 450;
                      const gap = 24;
                      
                      // Calculate scroll position
                      let scrollPosition = 0;
                      if (nextIndex === 0) {
                        scrollPosition = 0;
                      } else {
                        // Scroll past the first (wider) card
                        scrollPosition = activeCardWidth + gap;
                        // Add width of each normal card we need to pass
                        for (let i = 1; i < nextIndex; i++) {
                          scrollPosition += normalCardWidth + gap;
                        }
                      }
                      
                      setCurrentDealsIndex(nextIndex);
                      dealsCarouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                    }
                  }}
                  className="w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 rounded-lg flex items-center justify-center transition-all duration-300 group"
                  aria-label="Next deals"
                >
                  <ChevronRight size={24} className="text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Carousel Container - Shows partial next card */}
          <div className="relative">
            <div 
              ref={dealsCarouselRef}
              className="overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <div className="flex gap-6 w-max">
                {getFeaturedDeals().map((deal, index) => {
                  // Determine if this card is currently active (should be wider)
                  const isActive = index === currentDealsIndex;
                  return (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      animate={{
                        width: isActive ? 650 : 450
                      }}
                      transition={{ 
                        width: { duration: 0.6, ease: 'easeInOut' }
                      }}
                      className={`flex-shrink-0 ${
                        isActive 
                          ? 'md:w-[600px] lg:w-[650px]' 
                          : 'md:w-[420px] lg:w-[450px]'
                      }`}
                      style={{
                        width: isActive ? '540px' : '380px'
                      }}
                    >
                    <Link
                      href={`/deals/${deal.id}`}
                      className="block bg-white rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                      style={{ backgroundColor: '#FFFFFF' }}
                    >
                      {/* Image Section - Rounded Top Corners Only - Fixed Height for All Cards */}
                      <div className="relative w-full h-[200px] md:h-[230px] lg:h-[260px] overflow-hidden rounded-t-xl">
                        <Image
                          src={deal.image}
                          alt={deal.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Title and Metadata Section - Same Line, White Background */}
                      <div 
                        className="px-6 py-5 bg-white flex items-center justify-between gap-4"
                      >
                        {/* Title on the left */}
                        <h3 
                          className="text-xl md:text-2xl font-black leading-tight transition-colors duration-300 text-secondary flex-shrink-0"
                          style={{ color: '#1A1A1A' }}
                        >
                          {deal.title}
                        </h3>
                        
                        {/* Metadata on the right */}
                        <div className="flex items-center gap-3 text-xs md:text-sm text-secondary uppercase tracking-wide font-medium flex-shrink-0">
                          <span>{deal.savings.toUpperCase()}</span>
                          {deal.expirationDate && (
                            <>
                              <span className="text-gray-400">|</span>
                              <span>EXPIRES: {new Date(deal.expirationDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* CTA Button - White Background with Orange Button (LaMa Style) */}
                      <div className="px-6 pb-6 pt-5 bg-white">
                        <button 
                          className="text-white px-6 py-3 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 w-full hover:opacity-90"
                          style={{ 
                            backgroundColor: '#FF6B35'
                          }}
                        >
                          View Full Deal
                        </button>
                      </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Carousel Progress Indicators (Yo Quiero Style) */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {getFeaturedDeals().slice(0, 5).map((_, index) => (
                <div
                  key={index}
                  className={`h-1 transition-all duration-300 ${
                    index === currentDealsIndex ? 'w-8 bg-white' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to allow logo overlap into promo section */}
      <div className="relative overflow-visible" style={{ height: '150px', marginTop: '-150px', zIndex: 40 }}>
      </div>

      {/* Current Promos Section - Yo Quiero Style Layout (Exact Match) */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-4 text-center">
              Current Promos
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto text-center">
              Great deals happening now. Save more on your favorites every day.
            </p>
          </motion.div>

          {/* Promo Cards Grid - Exact Yo Quiero Stacking: Left/Middle = 1 image, Right = 2 stacked, Middle wider */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-8">
            {/* Left Column - Single Large Image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0 }}
              className="group flex flex-col md:col-span-3"
            >
              <Link href="/deals" className="block flex-1 flex flex-col">
                {/* Large Image - Increased Height with Label Inside */}
                <div className="relative w-full flex-1 min-h-[320px] md:min-h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <Image
                    src={getHomepagePromos()[0]?.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'}
                    alt={getHomepagePromos()[0]?.title || 'Promo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Label Inside Card - Top Left */}
                  <div className="absolute top-4 left-4 z-10">
                    <div 
                      className="px-6 py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#1A1A1A',
                        color: '#FFFFFF'
                      }}
                    >
                      <span className="font-black text-lg md:text-xl uppercase tracking-wide">
                        {getHomepagePromos()[0]?.title || 'Meal Deals'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Middle Column - Single Large Image (Wider) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group flex flex-col md:col-span-5"
            >
              <Link href="/deals" className="block flex-1 flex flex-col">
                {/* Large Image - Increased Height with Label Inside */}
                <div className="relative w-full flex-1 min-h-[320px] md:min-h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <Image
                    src={getHomepagePromos()[1]?.image || 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'}
                    alt={getHomepagePromos()[1]?.title || 'Promo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Label Inside Card - Top Left */}
                  <div className="absolute top-4 left-4 z-10">
                    <div 
                      className="px-6 py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#FAFAF5',
                        color: '#1A1A1A'
                      }}
                    >
                      <span className="font-black text-lg md:text-xl uppercase tracking-wide">
                        {getHomepagePromos()[1]?.title || 'Food Specials'}
                      </span>
                    </div>
                  </div>
                </div>
            </Link>
            </motion.div>

            {/* Right Column - Two Images Stacked Vertically */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group flex flex-col gap-6 md:col-span-4"
            >
              {/* Top Image in Right Column */}
              <Link href="/deals" className="block">
                {/* Top Image - Increased Height with Label Inside */}
                <div className="relative w-full aspect-[5/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <Image
                    src={getHomepagePromos()[2]?.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop'}
                    alt={getHomepagePromos()[2]?.title || 'Promo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Label Inside Card - Top Left */}
                  <div className="absolute top-4 left-4 z-10">
                    <div 
                      className="px-6 py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#FF6B35',
                        color: '#FFFFFF'
                      }}
                    >
                      <span className="font-black text-lg md:text-xl uppercase tracking-wide">
                        {getHomepagePromos()[2]?.title || 'Weekly Promotions'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Bottom Image in Right Column - Label Inside */}
              <Link href="/deals" className="block">
                {/* Bottom Image - Increased Height with Label Inside */}
                <div className="relative w-full aspect-[5/4] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <Image
                    src={getHomepagePromos()[3]?.image || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop'}
                    alt={getHomepagePromos()[3]?.title || 'Promo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Label Inside Card - Top Left */}
                  <div className="absolute top-4 left-4 z-10">
                    <div 
                      className="px-6 py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#FAFAF5',
                        color: '#1A1A1A'
                      }}
                    >
                      <span className="font-black text-lg md:text-xl uppercase tracking-wide">
                        {getHomepagePromos()[3]?.title || 'Combo Offers'}
                      </span>
                    </div>
                  </div>
                </div>
            </Link>
          </motion.div>
        </div>

          {/* Button Links Below - Matching Card Column Widths Above */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {['Coffee Deals', 'Food Specials', 'Combo Offers'].map((buttonText, index) => {
              const buttonColors = [
                { bg: '#2E7D32', text: '#FFFFFF' }, // Green (like AVOCADO)
                { bg: '#1A1A1A', text: '#FFFFFF' }, // Dark (like WHITE DIP)
                { bg: '#FF6B35', text: '#FFFFFF' }, // Orange (like VEGGIE DIPS)
              ];
              const button = buttonColors[index % buttonColors.length];
              // Match column widths: left=3, middle=5, right=4
              const colSpans = ['md:col-span-3', 'md:col-span-5', 'md:col-span-4'];
              
              return (
              <motion.div
                  key={buttonText}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className={colSpans[index]}
                >
                  <Link
                    href="/deals"
                    className="block w-full px-8 py-6 rounded-lg font-black text-xl md:text-2xl uppercase tracking-wide text-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{ 
                      backgroundColor: button.bg,
                      color: button.text
                    }}
                  >
                    {buttonText}
                  </Link>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hiring Banner - Orange Color */}
      <section className="py-6 md:py-8 px-6" style={{ backgroundColor: '#FF6B35' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <h3 className="text-xl md:text-2xl font-black text-white">We're Hiring!</h3>
              <p className="text-base md:text-lg text-white/90">Employees can save 15¢/gal.</p>
            </div>
            <Link
              href="/careers"
              className="inline-flex items-center justify-center border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-sm md:text-base transition-all duration-300 hover:bg-white hover:text-primary whitespace-nowrap"
              style={{ borderColor: '#FFFFFF' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.color = '#FF6B35';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* LaMa Rewards Section */}
      <section className="py-12 md:py-16 lg:py-20 px-6" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-6">
                LaMa Rewards
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Join our rewards program and start earning points on every purchase. Unlock exclusive deals and save more with Lama.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-secondary mb-1">Earn Points</h3>
                    <p className="text-gray-600 text-sm">Get points on every purchase. 1 point for every dollar spent.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Gift className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-secondary mb-1">Exclusive Deals</h3>
                    <p className="text-gray-600 text-sm">Access member-only promotions and special offers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-secondary mb-1">Redeem Rewards</h3>
                    <p className="text-gray-600 text-sm">Use your points for discounts, free items, and more.</p>
                  </div>
                </div>
              </div>
              <Link
                href="/rewards"
                className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-primary text-gray-900 hover:text-primary px-6 py-3 rounded-lg font-bold transition-all duration-300 group hover:scale-105"
              >
                Learn More
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-64 md:h-96 rounded-xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&h=800&fit=crop"
                alt="LaMa Rewards Mobile App"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                <div className="flex gap-3">
                  <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 text-white text-xs">
                    <Smartphone size={16} className="inline mr-2" />
                    Download App
                  </div>
          </div>
        </div>
            </motion.div>
          </div>
        </div>
      </section>

          </div>
    </>
  );
}
