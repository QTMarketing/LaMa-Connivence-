'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Gift, Star, TrendingUp, Zap, Smartphone, Download, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import GlassBanner from '@/components/GlassBanner';

export default function RewardsPage() {
  const benefits = [
    {
      icon: Star,
      title: "Earn Points",
      description: "Get points on every purchase. 1 point for every dollar spent."
    },
    {
      icon: Gift,
      title: "Exclusive Deals",
      description: "Access member-only promotions and special offers."
    },
    {
      icon: TrendingUp,
      title: "Redeem Rewards",
      description: "Use your points for discounts, free items, and more."
    },
    {
      icon: Zap,
      title: "Fast Checkout",
      description: "Skip the line with quick mobile checkout options."
    }
  ];

  const steps = [
    {
      number: "1",
      title: "Download the App",
      description: "Get the LaMa mobile app from the App Store or Google Play. It's free and easy to set up."
    },
    {
      number: "2",
      title: "Sign Up & Join",
      description: "Create your free account in seconds. Just enter your email and you're ready to start earning."
    },
    {
      number: "3",
      title: "Shop & Earn",
      description: "Every time you shop at LaMa, scan your app or enter your phone number to earn points automatically."
    },
    {
      number: "4",
      title: "Redeem & Save",
      description: "Use your points for discounts, free items, or save them up for bigger rewards. Your choice!"
    }
  ];

  const features = [
    "Track your points balance in real-time",
    "Get personalized deals and offers",
    "Order ahead and skip the line",
    "Find stores near you with GPS",
    "View your purchase history",
    "Get notified about new deals and promotions"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        {/* Glass Banner - Floating Inside Hero */}
        <GlassBanner />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop"
            alt="Rewards Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-40 h-full flex items-start justify-center pt-4 px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Rewards
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 hover:shadow-lg hover:border-primary transition-all text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
                  <benefit.icon className="text-primary" size={32} style={{ color: '#FF6B35' }} />
                </div>
                <h3 className="text-xl font-black mb-3 text-secondary">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile App Showcase */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-2 md:order-1"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-6">
                Download the LaMa App
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Get the LaMa Rewards app on your phone and take your rewards experience everywhere you go. Track points, find deals, order ahead, and more - all from your mobile device.
              </p>
              
              {/* App Features */}
              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" style={{ color: '#FF6B35' }} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-secondary border-2 border-primary text-white px-6 py-3 rounded-lg font-bold transition-all hover:border-primary-dark"
                  style={{ backgroundColor: '#1A1A1A', borderColor: '#FF6B35' }}
                >
                  <Download size={20} />
                  App Store
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 bg-secondary border-2 border-primary text-white px-6 py-3 rounded-lg font-bold transition-all hover:border-primary-dark"
                  style={{ backgroundColor: '#1A1A1A', borderColor: '#FF6B35' }}
                >
                  <Download size={20} />
                  Google Play
                </a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2 relative h-64 md:h-96 rounded-xl overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&h=800&fit=crop"
                alt="LaMa Rewards Mobile App"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-secondary" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Getting started with LaMa Rewards is simple. Follow these easy steps to start earning and saving today.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-black text-xl" style={{ backgroundColor: '#FF6B35' }}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-black text-white">
                    {step.title}
                  </h3>
                </div>
                <p className="text-white/80 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link
              href="/rewards/dashboard"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg text-lg font-bold transition-colors"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Sign Up Now
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Rewards Tiers */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-4">
              Rewards Tiers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The more you shop, the more you save. Unlock higher tiers and exclusive benefits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Member",
                points: "0-499",
                benefits: ["Earn 1 point per dollar", "Basic member deals", "Birthday rewards"]
              },
              {
                name: "VIP",
                points: "500-1499",
                benefits: ["Earn 1.5 points per dollar", "VIP exclusive deals", "Birthday rewards", "Priority customer support"]
              },
              {
                name: "Elite",
                points: "1500+",
                benefits: ["Earn 2 points per dollar", "Elite exclusive deals", "Birthday rewards", "Priority support", "Early access to sales"]
              }
            ].map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-2xl p-6 md:p-8 border-2 ${
                  index === 2 
                    ? 'border-primary bg-primary/5' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                <h3 className="text-2xl font-black text-secondary mb-2">{tier.name}</h3>
                <p className="text-primary font-bold mb-6">{tier.points} Points</p>
                <ul className="space-y-3">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" style={{ color: '#FF6B35' }} />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
