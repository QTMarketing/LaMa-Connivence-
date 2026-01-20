'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';

export default function Products() {
  const [activeTab, setActiveTab] = useState('hot-beverage');

  const tabs = [
    { id: 'hot-beverage', label: 'Hot Beverage' },
    { id: 'cold-drink', label: 'Cold Drink' },
    { id: 'fresh-food', label: 'Fresh Food' },
    { id: 'snacks-candy', label: 'Snacks & Candy' },
    { id: 'grocery-essential', label: 'Grocery Essential' },
    { id: 'lottery-service', label: 'Lottery & Service' },
  ];

  const tabContent = {
    'hot-beverage': {
      title: 'Start your day with premium coffee.',
      description: 'From our signature QuickBrew coffee to specialty lattes and cappuccinos, we serve quality beverages at unbeatable prices. Available in multiple sizes and roasts.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
      cta: 'Explore Coffee',
      href: '/products/hot-beverages',
    },
    'cold-drink': {
      title: 'Stay refreshed with our cold drinks.',
      description: 'From sodas and energy drinks to iced teas and smoothies, we have everything to quench your thirst.',
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
      cta: 'Explore Cold Drinks',
      href: '/products/cold-drinks',
    },
    'fresh-food': {
      title: 'Fresh food made daily.',
      description: 'Hot dogs, pizza, sandwiches, and more. All made fresh daily with quality ingredients.',
      image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
      cta: 'Explore Fresh Food',
      href: '/products/fresh-food',
    },
    'snacks-candy': {
      title: 'Your favorite snacks and candy.',
      description: 'From chips and pretzels to chocolate and gummies, we have all your favorite snacks.',
      image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=600&fit=crop',
      cta: 'Explore Snacks',
      href: '/products/snacks',
    },
    'grocery-essential': {
      title: 'Everyday essentials you need.',
      description: 'From milk and bread to household items, we stock all the essentials for your daily needs.',
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop',
      cta: 'Explore Grocery',
      href: '/products/grocery',
    },
    'lottery-service': {
      title: 'Lottery and convenient services.',
      description: 'Lottery tickets, money orders, bill payments, and more convenient services.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
      cta: 'Explore Services',
      href: '/products/services',
    },
  };

  const currentContent = tabContent[activeTab as keyof typeof tabContent];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        {/* Glass Banner - Floating Inside Hero */}
        <GlassBanner />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop"
            alt="Products Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-40 h-full flex items-start justify-center pt-4 px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Products
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center mb-12 border-b border-gray-200 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={activeTab === tab.id ? { backgroundColor: '#FF6B35' } : {}}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
                {currentContent.title}
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {currentContent.description}
              </p>
              <Link
                href={currentContent.href}
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
                style={{ backgroundColor: '#FF6B35' }}
              >
                {currentContent.cta}
              </Link>
            </div>
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src={currentContent.image}
                alt={currentContent.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Order Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
