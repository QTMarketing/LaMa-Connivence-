'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, ShoppingBag, IceCream, ShoppingCart, Package, UtensilsCrossed, MapPin, ArrowRight, Gift, Star, TrendingUp, Zap, Smartphone, Instagram, Facebook, Twitter, ChevronLeft, ChevronRight, ChevronDown, Search, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getHomepagePromos, getFeaturedDeals } from '@/lib/dealsData';
import { products } from '@/lib/productData';
import { blogs } from '@/lib/blogData';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

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

  // Promo slides data - driven by admin-managed deals
  const promoSlides = getHomepagePromos();

  // Local hero banner images
  const heroImages = [
    '/photos/monster.jpg',
    '/photos/redbull.jpg',
    '/photos/c4.jpg',
    '/photos/hotdog.jpg',
  ];


  // Featured promo slider (Concha y Toro style)
  const [featuredPromoIndex, setFeaturedPromoIndex] = useState(0);

  const currentPromo = promoSlides[featuredPromoIndex % Math.max(promoSlides.length, 1)] || promoSlides[0];
  const nextPromo =
    promoSlides.length > 1
      ? promoSlides[(featuredPromoIndex + 1) % promoSlides.length]
      : currentPromo;


  // Blog carousel active index (for scroll indicators)
  const [blogIndex, setBlogIndex] = useState(0);
  const blogScrollRef = useRef<HTMLDivElement | null>(null);

  const handleBlogScroll = () => {
    const el = blogScrollRef.current;
    if (!el) return;
    const firstChild = el.firstElementChild as HTMLElement | null;
    if (!firstChild) return;

    const cardWidth = firstChild.clientWidth || 1;
    const index = Math.round(el.scrollLeft / cardWidth);
    setBlogIndex(Math.max(0, Math.min(index, blogs.slice(0, 4).length - 1)));
  };

  const goToNextFeaturedPromo = () => {
    if (promoSlides.length === 0) return;
    setFeaturedPromoIndex((prev) => (prev + 1) % promoSlides.length);
  };

  const goToPrevFeaturedPromo = () => {
    if (promoSlides.length === 0) return;
    setFeaturedPromoIndex((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  };

  // Auto-advance hero slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);


  // Manual navigation functions for hero
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
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
      href: '/services',
      icon: ShoppingBag,
      title: 'Services',
      description: 'Additional services and conveniences we offer.',
    },
  ];

  return (
    <>
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section - Static coke2.jpg image */}
      <section className="relative pt-20 pb-0 overflow-hidden">
        <div className="relative w-full h-[calc(100vh-80px)] min-h-[500px]">
          <Image
            src="/foo/bet.jpg"
            alt="Hero banner"
            fill
            className="object-cover"
            priority
          />
          
          {/* Content Overlay */}
          <div className="hero-section absolute inset-0 flex items-center px-6 sm:px-8 md:px-12 lg:px-16">
            {/* Left Side - Title, Description and Button */}
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 max-w-3xl z-10">
              <h1 
                className="font-black text-white leading-tight whitespace-nowrap"
                style={{ 
                  fontSize: 'clamp(4rem, 8vw, 7rem) !important',
                }}
              >
                Fuel Up Fast.
              </h1>
              <p
                className="font-bold text-white"
                style={{ 
                  color: '#FFFFFF',
                  fontSize: 'clamp(1rem, 2vw, 1.5rem) !important',
                  opacity: 0.8,
                }}
              >
                Fresh hot dogs and crispy taquitos,<br />
                hot and ready to fuel your day
              </p>
              <Link
                href="/deals"
                className="inline-block px-10 py-4 bg-[#FF6B35] text-white font-bold text-lg sm:text-xl md:text-2xl rounded hover:bg-[#E55A2B] transition-colors duration-300 w-fit"
                style={{ borderRadius: '4px' }}
              >
                Order Now
              </Link>
            </div>

            {/* Price - Bottom Right, closer to food */}
            <div className="absolute bottom-8 right-6 sm:bottom-12 sm:right-8 md:bottom-16 md:right-12 lg:bottom-20 lg:right-16 z-10">
              <div
                className="inline-flex w-fit px-5 sm:px-6 md:px-7 py-2.5 sm:py-3 rounded-md border"
                style={{
                  background: 'linear-gradient(180deg, rgba(20,20,20,0.7) 0%, rgba(8,8,8,0.82) 100%)',
                  borderColor: 'rgba(255, 215, 0, 0.35)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                }}
              >
                <span
                  className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none"
                  style={{
                    color: '#FFD700',
                    textShadow: '0 0 6px rgba(255, 215, 0, 0.25)',
                    WebkitTextStroke: '0.5px rgba(108, 72, 0, 0.3)',
                  }}
                >
                  $4
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty + Current Promos Section - 7-Eleven style two-up cards */}
      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* LaMa Loyalty Card - Coke Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden border-2 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-[#1A1A1A]"
          >
            {/* Background coke image */}
            <Image
              src="/foo/coke.jpg"
              alt="Coke"
              fill
              className="object-cover"
            />

              <Link
              href="/rewards"
              className="relative block p-8 sm:p-10 md:p-12 min-h-[260px] sm:min-h-[320px] md:min-h-[360px] flex flex-col justify-center items-center text-center"
            >
              {/* Graphics-only card - no text */}
            </Link>
          </motion.div>

          {/* Current Promos Card - Static cola1 image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden border-2 border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01] bg-[#1A1A1A]"
          >
            {/* Background cola1 image */}
            <Image
              src="/foo/cola1.jpg"
              alt="Cola"
              fill
              className="object-cover"
            />

            <Link
              href="/deals"
              className="relative block p-8 sm:p-10 md:p-12 min-h-[260px] sm:min-h-[320px] md:min-h-[360px] flex flex-col justify-center items-center text-center text-white"
            >
              {/* Graphics-only card - no text */}
            </Link>
                    </motion.div>
        </div>
      </section>

      {/* OLD CURRENT PROMO SECTION - Hidden but preserved for future use */}
      <div className="hidden" id="old-current-promo-section">
      {/* Current Promos Section - Yo Quiero Style Layout (Exact Match) */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="section-title-large text-secondary mb-3 sm:mb-4 text-center">
              Current Promos
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto text-center px-4">
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
                <div className="relative w-full flex-1 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <Image
                    src={getHomepagePromos()[0]?.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'}
                    alt={getHomepagePromos()[0]?.title || 'Promo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Label Inside Card - Top Left */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <div 
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#1A1A1A',
                        color: '#FFFFFF'
                      }}
                    >
                      <span className="font-black text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-wide">
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
                <div className="relative w-full flex-1 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <Image
                    src={getHomepagePromos()[1]?.image || 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop'}
                    alt={getHomepagePromos()[1]?.title || 'Promo'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Label Inside Card - Top Left */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <div 
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#FAFAF5',
                        color: '#1A1A1A'
                      }}
                    >
                      <span className="font-black text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-wide">
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
              className="group flex flex-col gap-4 sm:gap-6 md:col-span-4"
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
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <div 
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#FF6B35',
                        color: '#FFFFFF'
                      }}
                    >
                      <span className="font-black text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-wide">
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
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <div 
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#FAFAF5',
                        color: '#1A1A1A'
                      }}
                    >
                      <span className="font-black text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-wide">
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
        </div>
      {/* END OLD CURRENT PROMO SECTION */}

      {/* Current Promos – 4‑Card Mosaic Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAF5]">
        <div className="max-w-7xl mx-auto mb-10 sm:mb-14 md:mb-16">
          <h2 className="section-title-large text-secondary text-center mb-4 sm:mb-6">
            Current Promos
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto text-center px-4">
            Big, bold offers on your favorites – pizza, hot coffee, cold drinks, and more.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Outer wrapper keeps overall rectangular shape with tighter gaps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
            {/* LEFT COLUMN – BIG PIZZA CARD (spans 2 rows on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative md:row-span-2 overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]"
              style={{ minHeight: '520px' }}
            >
              <Link href="/deals">
                <div className="relative w-full h-[320px] sm:h-[420px] md:h-full">
                  <Image
                    src="/foo/pizza.jpg" // Pizza image
                    alt="Pizza Deals"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                  <div className="absolute inset-x-6 bottom-8 text-left">
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] mb-2" style={{ color: '#FFFFFF' }}>
                      Pizza
                    </p>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2" style={{ color: '#FFFFFF' }}>
                      Hot, cheesy slices
                    </h3>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* RIGHT COLUMN – STACKED CARDS */}
            <div className="md:col-span-2 flex flex-col gap-3 sm:gap-4 lg:gap-5">
              {/* ROW 1 – TWO CARDS: ¢.99 COFFEE + DRINKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                {/* ¢.99 COFFEE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]"
                >
                  <Link href="/deals">
                    <div className="relative w-full h-[230px] sm:h-[250px] md:h-[260px] lg:h-[270px]">
                      <Image
                        src="/foo/coffee.jpg" // Coffee image
                        alt="Coffee"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="absolute inset-x-5 bottom-6 text-left">
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: '#FFFFFF' }}>
                          Coffee
                        </p>
                        <h3 className="text-xl sm:text-2xl font-black" style={{ color: '#FFFFFF' }}>
                          Hot brews, tiny price
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>

                {/* DRINKS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]"
                >
                  <Link href="/deals">
                    <div className="relative w-full h-[230px] sm:h-[250px] md:h-[260px] lg:h-[270px] bg-[#000000]">
                      <Image
                        src="/foo/drink.jpg" // Drinks image
                        alt="Drinks"
                        fill
                        className="object-cover opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                      <div className="absolute inset-x-5 bottom-6 text-left">
                        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: '#FFFFFF' }}>
                          Drinks
                        </p>
                        <h3 className="text-xl sm:text-2xl font-black" style={{ color: '#FFFFFF' }}>
                          Ice‑cold refreshment
                        </h3>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </div>

              {/* ROW 2 – WIDE MEAL DEAL CARD */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]"
              >
                <Link href="/deals">
                  <div className="relative w-full h-[230px] sm:h-[250px] md:h-[260px] lg:h-[270px] bg-[#FF6B35]">
                    <Image
                      src="/foo/burger.jpg" // Meal deal image
                      alt="Meal Deal"
                      fill
                      className="object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-x-5 sm:inset-x-6 bottom-6 text-left">
                      <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] mb-1" style={{ color: '#FFFFFF' }}>
                        Meal Deal
                      </p>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-black" style={{ color: '#FFFFFF' }}>
                        Combo meals made easy
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Banner - Orange Color */}
      <section className="py-6 md:py-8 px-6" style={{ backgroundColor: '#FF6B35' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
              <h3 className="hiring-banner text-white">We're Hiring!</h3>
              <ChevronDown size={24} className="text-white" />
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
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="rewards-title text-secondary mb-4 sm:mb-6">
                LaMa Rewards
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed mb-4 sm:mb-6">
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

      {/* Blog & News Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="section-title-large text-secondary mb-4 sm:mb-6">
              Most Recent Post
            </h2>
            <p className="text-sm sm:text-base md:text-base text-gray-600 max-w-2xl mx-auto">
              Read our most recent post for the latest news and insights.
            </p>
          </motion.div>
        </div>

        {/* Blog Cards Carousel - Full Width with Overflow */}
        <div className="relative w-full overflow-hidden">
          <div
            ref={blogScrollRef}
            onScroll={handleBlogScroll}
            className="overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className="flex gap-6 sm:gap-8 w-max pl-4 sm:pl-6 pr-[calc(85vw-100px)] sm:pr-[calc(500px-100px)] md:pr-[calc(600px-120px)] lg:pr-[calc(700px-150px)]">
              {blogs.slice(0, 4).map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: index < 3 ? 1 : 0, x: index < 3 ? 0 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-200px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[85vw] sm:w-[500px] md:w-[600px] lg:w-[700px]"
                >
                  <Link
                    href={`/media/blog/${blog.slug}`}
                    className="block bg-white rounded-xl overflow-hidden border-2 border-gray-100 hover:shadow-xl hover:border-primary transition-all duration-300 group h-full"
                  >
                    {/* Image Section */}
                    <div className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] lg:h-[550px] overflow-hidden bg-gray-200">
                      <Image
                        src={
                          blog.image && blog.image.startsWith('http')
                            ? blog.image
                            : '/photos/store1.jpg'
                        }
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 sm:p-6">
                        <div className="flex items-center gap-2 text-white text-xs sm:text-sm mb-2">
                          <Clock size={14} />
                          <span>1 min</span>
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-black text-white line-clamp-2">
                          {blog.title}
                        </h3>
                        <div className="mt-3 sm:mt-4">
                          <span className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300">
                            Read More
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint indicators under cards */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={`inline-block rounded-full ${
                i === blogIndex ? 'w-10' : 'w-4'
              } h-[3px] sm:h-1`}
              style={{
                backgroundColor: '#FF6B35',
                opacity: i === blogIndex ? 1 : 0.35,
              }}
            />
          ))}
        </div>
      </section>

      {/* Store Locator Section */}
      <section className="relative py-24 sm:py-28 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/photos/lama.jpg"
            alt="LaMa Store"
            fill
            className="object-cover"
            priority
          />
          {/* Base overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Black mist at edges - top */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent"></div>
          {/* Black mist at edges - bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          {/* Black mist at edges - left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent"></div>
          {/* Black mist at edges - right */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Heading */}
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 sm:mb-6">
              Find Your Nearest
              <br />
              <span className="text-white">LaMa Convenience Store</span>
            </h2>

            {/* Search Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const searchQuery = formData.get('search') as string;
                // Navigate to stores page with search query
                window.location.href = `/stores?search=${encodeURIComponent(searchQuery)}`;
              }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  name="search"
                  placeholder="Enter your address, city, or zip code"
                  className="w-full pl-12 pr-4 py-4 sm:py-5 rounded-lg bg-white/95 backdrop-blur-sm border-2 border-white/20 focus:outline-none focus:border-white/40 focus:bg-white text-gray-900 placeholder-gray-500 text-sm sm:text-base font-medium transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button
                type="submit"
                className="px-6 sm:px-8 py-4 sm:py-5 rounded-lg bg-[#1A1A1A] hover:bg-black text-white font-bold text-sm sm:text-base uppercase tracking-wide transition-all duration-300 hover:scale-105 min-h-[56px] sm:min-h-[60px] flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <MapPin size={18} />
                Find Store
              </button>
            </form>
          </motion.div>
        </div>
      </section>

          </div>
    </>
  );
}
