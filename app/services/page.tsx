'use client';

import { motion } from 'framer-motion';
import { CreditCard, Car, Droplets, FileText, DollarSign, Ticket, Wifi, RefreshCw, Building2, Gift } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/productData';
import { getFeaturedDeals } from '@/lib/dealsData';
import GlassBanner from '@/components/GlassBanner';
import { useState, useRef, useEffect } from 'react';

const services = [
  {
    id: 1,
    name: 'Lottery',
    description: 'Play Powerball, Mega Millions, scratch-offs, and state lotteries at LaMa Convenience. We offer all major national lottery games and state-specific options. Scratch-off tickets come in various price points and themes. Our friendly staff can help you select tickets and check your winning numbers.',
    note: 'Must be 18+ to purchase.',
    icon: Ticket,
    category: 'financial',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop',
  },
  {
    id: 2,
    name: 'ATM',
    description: 'Access cash 24/7 at most LaMa locations with secure, in-store ATMs. Withdraw cash, check your account balance, and perform banking transactions in a safe, well-lit environment. Our ATMs are available around the clock and compatible with most bank cards.',
    note: 'Availability and fees may vary by location.',
    icon: CreditCard,
    category: 'financial',
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop',
  },
  {
    id: 3,
    name: 'Money Orders',
    description: 'Send money safely and securely, ideal for bills, rent, or personal payments. Money orders provide a reliable and secure way to send payments with a paper trail for your transactions. The process is quick and straightforward - our staff will help you complete the transaction.',
    note: 'Fees starting at $0.99.',
    icon: FileText,
    category: 'financial',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
  },
  {
    id: 4,
    name: 'Prepaid Phones',
    description: 'Reload prepaid phones or pick up popular prepaid options for every carrier. We offer prepaid phone cards and devices for all major carriers including Verizon, AT&T, T-Mobile, and more. Perfect for those who want to avoid long-term contracts or need a backup phone.',
    note: 'Brands vary by store.',
    icon: Wifi,
    category: 'convenience',
    image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=600&fit=crop',
  },
  {
    id: 5,
    name: 'Gift Cards',
    description: 'Grab gift cards for shopping, dining, gaming, and more—perfect for any occasion. We offer a wide selection of gift cards from popular retailers, restaurants, entertainment venues, and online services. Available in various denominations and activated immediately.',
    note: 'Selection varies by location.',
    icon: Gift,
    category: 'convenience',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
  },
];

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'financial' | 'convenience'>('all');
  const [currentDealIndex, setCurrentDealIndex] = useState(0);
  const dealsCarouselRef = useRef<HTMLDivElement>(null);
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  const featuredDeals = getFeaturedDeals();

  // Track scroll position for navigation dots
  useEffect(() => {
    const carousel = dealsCarouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = 450; // card width
      const gap = 24; // gap-6 = 24px
      const cardWidthWithGap = cardWidth + gap;
      const currentIndex = Math.round(scrollLeft / cardWidthWithGap);
      setCurrentDealIndex(currentIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop"
            alt="Services Hero"
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
              Services
            </h1>
          </motion.div>
          {/* Glass Banner - Floating Inside Hero */}
          <GlassBanner />
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 px-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <nav className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 sm:px-6 py-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 min-h-[44px] ${
                selectedCategory === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              style={selectedCategory === 'all' ? { backgroundColor: '#FF6B35' } : {}}
            >
              ALL SERVICES
            </button>
            <button
              onClick={() => setSelectedCategory('convenience')}
              className={`px-4 sm:px-6 py-3 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 min-h-[44px] ${
                selectedCategory === 'convenience'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              style={selectedCategory === 'convenience' ? { backgroundColor: '#FF6B35' } : {}}
            >
              <Building2 size={18} />
              Convenience & Logistics
            </button>
          </nav>
        </div>
      </section>

      {/* Services List */}
      <section className="py-12 md:py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-8 md:space-y-12">
            {filteredServices.map((service, index) => (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="grid md:grid-cols-2 gap-6 md:gap-8 items-center"
              >
                <div className={`relative w-full aspect-video rounded-xl overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
                    {service.name}
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  {service.note && (
                    <p className="text-sm text-gray-500">
                      {service.note}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No services found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="py-16 md:py-20 px-6" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              The star of <span className="italic">YOUR DEALS</span>
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
              We'll let you in on a little secret: You can save more with your convenience. Broaden your savings with some of our featured deals.
            </p>
            <Link
              href="/deals"
              className="inline-flex items-center gap-2 bg-white text-secondary px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
              style={{ color: '#1A1A1A' }}
            >
              Current Promos
            </Link>
          </motion.div>

          {/* Deals Carousel */}
          <div className="relative">
            <div
              ref={dealsCarouselRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6"
              style={{
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {featuredDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[calc(100vw-4rem)] md:w-[400px] lg:w-[450px] bg-white rounded-xl overflow-hidden shadow-lg"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6 deal-card-title">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-black text-secondary flex-1">
                        {deal.title}
                      </h3>
                      <div className="text-right ml-4">
                        {deal.savings && (
                          <p className="text-primary font-bold text-sm mb-1">
                            {deal.savings}
                          </p>
                        )}
                        {deal.expirationDate && (
                          <p className="text-gray-500 text-xs">
                            EXPIRES: {new Date(deal.expirationDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/deals/${deal.id}`}
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm transition-all hover:scale-105 w-full mt-4"
                      style={{ backgroundColor: '#FF6B35' }}
                    >
                      View Full Deal
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation Dots */}
            {featuredDeals.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {featuredDeals.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const scrollPosition = index * (450 + 24); // card width + gap
                      dealsCarouselRef.current?.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                      setCurrentDealIndex(index);
                    }}
                    className={`rounded-full transition-all ${
                      index === currentDealIndex
                        ? 'w-8 h-2.5 bg-white'
                        : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
