'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, ShoppingBag, IceCream, ShoppingCart, Package, UtensilsCrossed, MapPin, ArrowRight, Gift, Star, TrendingUp, Zap, Instagram, Facebook, Twitter, ChevronDown, Search, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { readingMinutes, type BlogView } from '@/lib/blog/types';
import { type Deal } from '@/lib/dealsData';
import type { HeroSlideView } from '@/lib/settings/queries';
import { CAMPAIGN } from '@/lib/campaignImages';
import { useState, useEffect, useLayoutEffect } from 'react';
import { DealCountdownBadge } from '@/components/DealCountdownBadge';
import HeroCampaignBand from '@/components/HeroCampaignBand';

interface HomeClientProps {
  promoSlides: Deal[];
  blogCards: BlogView[];
  heroSlides: HeroSlideView[];
}

export default function HomeClient({
  promoSlides,
  blogCards,
  heroSlides,
}: HomeClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Hero slides arrive from Postgres via the server page.

  // Featured promo slider (Concha y Toro style)
  const [featuredPromoIndex, setFeaturedPromoIndex] = useState(0);

  const currentPromo = promoSlides[featuredPromoIndex % Math.max(promoSlides.length, 1)] || promoSlides[0];
  const nextPromo =
    promoSlides.length > 1
      ? promoSlides[(featuredPromoIndex + 1) % promoSlides.length]
      : currentPromo;

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
    if (heroSlides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

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

  const activeHero =
    heroSlides.length > 0
      ? heroSlides[currentSlide % heroSlides.length]
      : null;

  return (
    <>
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Campaign band — see ART_DIRECTION.md. Copy and price come from
          hero_slides so Monday coffee deals / combo pricing can change without
          a deploy. */}
      <HeroCampaignBand
        eyebrow={activeHero?.italicText}
        title={<>{activeHero?.headline ?? 'Fuel Up Fast.'}</>}
        subtitle={
          activeHero?.bodyText ??
          'Fresh hot dogs, crispy taquitos, coffee, and cold drinks, ready when you are.'
        }
        imageSrc={activeHero?.image}
        imageAlt={activeHero?.alt}
        price={
          activeHero?.priceAmount
            ? {
                amount: activeHero.priceAmount,
                label: activeHero.priceLabel ?? undefined,
              }
            : undefined
        }
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href={activeHero?.ctaLink ?? '/stores'}
              className="btn-primary inline-flex w-fit items-center gap-2 !bg-[#1A1A1A] text-base !text-white shadow-[0_6px_18px_rgba(26,26,26,0.28)] hover:!bg-black md:text-lg"
            >
              {activeHero?.ctaText ?? 'Find a Store Near You'}
              <MapPin size={18} />
            </Link>
            <Link
              href="/deals"
              className="btn-secondary inline-flex w-fit items-center gap-2 border-2 !border-white/55 text-base !text-[#1A1A1A] hover:!border-white hover:!bg-white/25 md:text-lg"
            >
              See Current Deals
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-[#1A1A1A]">
              <Clock size={15} />
              <span className="text-sm font-semibold">Open 24/7 locations</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-[#1A1A1A]">
              <Gift size={15} />
              <span className="text-sm font-semibold">Member-only rewards</span>
            </div>
          </div>

          {heroSlides.length > 1 && (
            <div className="flex gap-2" role="tablist" aria-label="Hero slides">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={index === currentSlide % heroSlides.length}
                  aria-label={`Show slide: ${slide.headline}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    index === currentSlide % heroSlides.length
                      ? 'bg-[#1A1A1A]'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </HeroCampaignBand>

      {/* Loyalty + Current Promos Section - 7-Eleven style two-up cards */}
      <section className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* LaMa Loyalty Card - Coke Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="card-interactive relative overflow-hidden bg-[#1A1A1A]"
          >
            {/* FIFA collab photo */}
            <Image
              src="/foo/coke.jpg"
              alt="Fans celebrating with Coca-Cola"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

              <Link
              href="/rewards"
              className="relative block p-8 md:p-12 min-h-[260px] md:min-h-[360px] flex flex-col justify-center items-center text-center"
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
            className="card-interactive relative overflow-hidden bg-[#1A1A1A]"
          >
            {/* Coke six-pack product shot */}
            <Image
              src="/foo/coke-sixpack.png"
              alt="Six-pack of Coca-Cola Original Taste glass bottles"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

            <Link
              href="/deals"
              className="relative block p-8 md:p-12 min-h-[260px] md:min-h-[360px] flex flex-col justify-center items-center text-center text-white"
            >
              {/* Graphics-only card - no text */}
            </Link>
                    </motion.div>
        </div>
      </section>

      {/* OLD CURRENT PROMO SECTION - Hidden but preserved for future use */}
      <div className="hidden" id="old-current-promo-section">
      {/* Current Promos Section - Yo Quiero Style Layout (Exact Match) */}
      <section className="section bg-white">
        <div className="container-standard">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="typography-h1 text-secondary mb-4 text-center">
              Current Promos
            </h2>
            <p className="typography-body-lg text-gray-600 max-w-2xl mx-auto text-center">
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
                <div className="card-interactive relative w-full flex-1 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] rounded-md overflow-hidden">
                  <Image
                    src={promoSlides[0]?.image || CAMPAIGN.homeHero}
                    alt={promoSlides[0]?.title || 'Promo'}
                    fill
                    className="object-cover"
                  />
                  {/* Label Inside Card - Top Left */}
                  <div className="absolute top-4 left-4 z-10">
                    <div 
                      className="px-4 md:px-6 py-2 md:py-3 rounded-lg shadow-lg"
                      style={{ 
                        backgroundColor: '#1A1A1A',
                        color: '#FFFFFF'
                      }}
                    >
                      <span className="typography-body-sm md:typography-body font-black uppercase tracking-wide">
                        {promoSlides[0]?.title || 'Hot Grill Deals'}
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
                <div className="card-interactive relative w-full flex-1 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] rounded-md overflow-hidden">
                  <Image
                    src={promoSlides[1]?.image || CAMPAIGN.sausage}
                    alt={promoSlides[1]?.title || 'Promo'}
                    fill
                    className="object-cover"
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
                        {promoSlides[1]?.title || 'Hot Grill Deals'}
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
                <div className="card-interactive relative w-full aspect-[5/4] rounded-md overflow-hidden">
                  <Image
                    src={promoSlides[2]?.image || CAMPAIGN.taquito}
                    alt={promoSlides[2]?.title || 'Promo'}
                    fill
                    className="object-cover"
                  />
                  {/* Label Inside Card - Top Left */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
                    <div 
                      className="px-4 sm:px-6 py-2 sm:py-3 rounded-md shadow-lg"
                      style={{ 
                        backgroundColor: '#FF6B35',
                        color: '#1A1A1A'
                      }}
                    >
                      <span className="font-black text-sm sm:text-base md:text-lg lg:text-xl uppercase tracking-wide">
                        {promoSlides[2]?.title || 'Grill Items'}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Bottom Image in Right Column - Label Inside */}
              <Link href="/deals" className="block">
                {/* Bottom Image - Increased Height with Label Inside */}
                <div className="card-interactive relative w-full aspect-[5/4] rounded-md overflow-hidden">
                  <Image
                    src={promoSlides[3]?.image || CAMPAIGN.bites}
                    alt={promoSlides[3]?.title || 'Promo'}
                    fill
                    className="object-cover"
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
                        {promoSlides[3]?.title || 'Mix & Match'}
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
                { bg: '#1A1A1A', text: '#FFFFFF' },
                { bg: '#1A1A1A', text: '#FFFFFF' },
                { bg: '#FF6B35', text: '#FFFFFF' },
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
      <section className="section bg-[#FAFAF5]">
        <div className="container-standard mb-12 md:mb-16">
          <h2 className="typography-h2 text-secondary text-center mb-4">
            Current Promos
          </h2>
          <p className="typography-body-lg text-gray-600 max-w-2xl mx-auto text-center">
            Big, bold offers on your favorites – pizza, hot coffee, cold drinks, and more.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3">
            <Link
              href="/deals"
              className="btn-primary inline-flex items-center gap-2"
            >
              Browse All Deals
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/rewards"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Join Rewards
              <Gift size={16} />
            </Link>
          </div>
        </div>

        <div className="container-standard">
          {/* Outer wrapper keeps overall rectangular shape with tighter gaps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* LEFT COLUMN – BIG PIZZA CARD (spans 2 rows on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card-interactive relative md:row-span-2 overflow-hidden rounded-md"
              style={{ minHeight: '520px' }}
            >
              <Link href="/deals" className="flex h-full min-h-[520px] flex-col bg-white">
                <div className="relative min-h-[320px] flex-1 sm:min-h-[420px]">
                  <Image
                    src={CAMPAIGN.pizza}
                    alt="Pizza Deals"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="px-6 py-5 text-left">
                  <p className="typography-caption mb-2 font-semibold uppercase tracking-[0.22em] text-[#1A1A1A]/65">
                    Pizza
                  </p>
                  <h3 className="typography-h2 text-[#1A1A1A]">
                    Hot, cheesy slices
                  </h3>
                </div>
              </Link>
            </motion.div>

            {/* RIGHT COLUMN – STACKED CARDS */}
            <div className="md:col-span-2 flex flex-col gap-4 md:gap-6">
              {/* ROW 1 – TWO CARDS: ¢.99 COFFEE + DRINKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {/* ¢.99 COFFEE */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  className="card-interactive relative overflow-hidden rounded-md"
                >
                  <Link href="/deals" className="flex h-full flex-col bg-white">
                    <div className="relative h-[230px] w-full sm:h-[250px] md:h-[260px] lg:h-[270px]">
                      <Image
                        src={CAMPAIGN.promoBlobCoffee}
                        alt="Coffee"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="px-5 py-4 text-left">
                      <p className="typography-caption mb-1 font-semibold uppercase tracking-[0.22em] text-[#1A1A1A]/65">
                        Coffee
                      </p>
                      <h3 className="typography-h4 text-[#1A1A1A]">
                        Hot brews, tiny price
                      </h3>
                    </div>
                  </Link>
                </motion.div>

                {/* DRINKS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="card-interactive relative overflow-hidden rounded-md"
                >
                  <Link href="/deals" className="flex h-full flex-col bg-white">
                    <div className="relative h-[230px] w-full sm:h-[250px] md:h-[260px] lg:h-[270px]">
                      <Image
                        src={CAMPAIGN.promoBlobDrinks}
                        alt="Drinks"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="px-5 py-4 text-left">
                      <p className="typography-caption mb-1 font-semibold uppercase tracking-[0.22em] text-[#1A1A1A]/65">
                        Drinks
                      </p>
                      <h3 className="typography-h4 text-[#1A1A1A]">
                        Ice‑cold refreshment
                      </h3>
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
                className="card-interactive relative overflow-hidden rounded-md"
              >
                <Link href="/deals" className="flex h-full flex-col bg-white">
                  <div className="relative h-[230px] w-full sm:h-[250px] md:h-[260px] lg:h-[270px]">
                    <Image
                      src={CAMPAIGN.promoComboHz}
                      alt="Meal Deal"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="px-5 py-4 text-left sm:px-6">
                    <p className="typography-caption mb-1 font-semibold uppercase tracking-[0.22em] text-[#1A1A1A]/65">
                      Meal Deal
                    </p>
                    <h3 className="typography-h3 text-[#1A1A1A]">
                      Combo meals made easy
                    </h3>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Hiring Banner - Orange Color */}
      <section className="py-5 md:py-6 px-4 md:px-6" style={{ backgroundColor: '#FF6B35' }}>
        <div className="container-standard">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
              <h3 className="typography-h3 text-[#1A1A1A]">We're Hiring!</h3>
              <ChevronDown size={24} className="text-[#1A1A1A]" />
            </div>
            <Link
              href="/careers"
              className="btn-secondary !border-[#1A1A1A] !text-[#1A1A1A] hover:!bg-[#1A1A1A] hover:!text-white"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* LaMa Rewards Section */}
      <section className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="typography-h1 text-secondary mb-6" style={{ color: '#1A1A1A' }}>
                LaMa Rewards
              </h2>
              <p className="typography-body-lg text-gray-600 mb-6">
                Join our rewards program and start earning points on every purchase. Unlock exclusive deals and save more with Lama.
              </p>
              <div className="space-y-6 mb-8">
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="typography-h5 text-secondary mb-2">Earn Points</h3>
                    <p className="typography-body-sm text-gray-600">Get points on every purchase. 1 point for every dollar spent.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Gift className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="typography-h5 text-secondary mb-2">Exclusive Deals</h3>
                    <p className="typography-body-sm text-gray-600">Access member-only promotions and special offers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="typography-h5 text-secondary mb-2">Redeem Rewards</h3>
                    <p className="typography-body-sm text-gray-600">Use your points for discounts, free items, and more.</p>
                  </div>
                </div>
              </div>
              <Link
                href="/rewards"
                className="btn-secondary inline-flex items-center gap-2"
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
              className="relative h-64 md:h-96 overflow-hidden"
            >
              <Image
                src={CAMPAIGN.rewardsIllustration}
                alt="Gift box, phone, and piggy bank with coins bursting out"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="origin-bottom object-contain scale-[1.22]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog & News Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="typography-h2 text-secondary mb-4">
              Most Recent Post
            </h2>
            <p className="typography-body-lg text-gray-600 max-w-2xl mx-auto">
              Read our most recent post for the latest news and insights.
            </p>
          </motion.div>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="blog-marquee-track pl-4 sm:pl-6">
            {[0, 1].map((copy) => (
              <div
                key={`blog-copy-${copy}`}
                className={`flex gap-5 pr-5 ${copy === 1 ? 'blog-marquee-clone' : ''}`}
                aria-hidden={copy === 1}
              >
                {blogCards.map((blog) => (
                  <article
                    key={`${copy}-${blog.id}`}
                    className="flex-shrink-0 w-[min(88vw,440px)]"
                  >
                    <Link
                      href={`/media/blog/${blog.slug}`}
                      className="card block h-full group"
                      tabIndex={copy === 1 ? -1 : undefined}
                    >
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#FAFAF5]">
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                          sizes="440px"
                        />
                      </div>
                      <div className="card-body flex flex-col">
                        <div className="flex items-center gap-2 text-[#4A5568] typography-caption mb-2">
                          <Clock size={14} />
                          <span>{readingMinutes(blog.content)} min</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#1A1A1A] line-clamp-2 min-h-[2.5em]">
                          {blog.title}
                        </h3>
                        <span className="btn-primary mt-5 w-fit !text-sm !px-5 !py-2.5">
                          Read More
                          <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Locator Section */}
      <section className="relative section overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/photos/lama.jpg"
            alt="LaMa Store"
            fill
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
          {/* Contrast is shaped to the copy, not flattened across the photo.
              A single bg-black/40 veil kills the storefront everywhere; this keeps a
              light base and concentrates the darkness behind the headline + search. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-black/30" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 68% 62% at 50% 60%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.36) 55%, rgba(0,0,0,0) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="typography-display text-white mb-6"
              style={{
                textShadow: '0 1px 2px rgba(0,0,0,0.35), 0 4px 24px rgba(0,0,0,0.35)',
              }}
            >
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
              className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  name="search"
                  placeholder="Enter your address, city, or zip code"
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/95 backdrop-blur-sm border-2 border-white/20 shadow-[0_10px_34px_rgba(0,0,0,0.45)] focus:outline-none focus:border-white/40 focus:bg-white text-gray-900 placeholder-gray-500 typography-body font-medium transition-all duration-300"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button
                type="submit"
                className="btn-primary px-6 md:px-8 py-4 uppercase min-h-[56px] flex items-center justify-center gap-2 whitespace-nowrap bg-[#1A1A1A] hover:bg-black shadow-[0_10px_34px_rgba(0,0,0,0.45)]"
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
