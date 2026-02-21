'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Gift, Star, TrendingUp, Zap, Smartphone, CheckCircle2, Clock, Users, Award, DollarSign, Coffee, ShoppingBag, Download, QrCode, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RewardsPage() {
  const benefits = [
    {
      icon: Star,
      title: "Earn Points on Every Purchase",
      description: "Get 1 point for every dollar spent. Points add up fast with bonus offers and special promotions.",
      color: "text-yellow-500"
    },
    {
      icon: Gift,
      title: "Redeem for Free Items",
      description: "Use your points to get free food, drinks, snacks, and more from our rewards menu.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Exclusive Member Deals",
      description: "Access special discounts, bonus points offers, and member-only promotions.",
      color: "text-green-500"
    },
    {
      icon: Zap,
      title: "Fast & Easy Checkout",
      description: "Scan your app at checkout to earn points instantly. No cards needed.",
      color: "text-blue-500"
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Sign Up Free",
      description: "Download the app or sign up online. It takes less than a minute to get started.",
      icon: Download
    },
    {
      step: 2,
      title: "Shop & Earn",
      description: "Make purchases at any Lama location. Scan your app at checkout to earn points automatically.",
      icon: QrCode
    },
    {
      step: 3,
      title: "Redeem Rewards",
      description: "Browse our rewards menu and redeem your points for free items whenever you're ready.",
      icon: Gift
    },
    {
      step: 4,
      title: "Enjoy Benefits",
      description: "Get exclusive deals, bonus points, and special offers sent directly to your app.",
      icon: Sparkles
    }
  ];

  const rewardsMenu = [
    { name: "Free Coffee", points: 50, icon: Coffee },
    { name: "Free Slurpee", points: 75, icon: Coffee },
    { name: "Free Snack", points: 100, icon: ShoppingBag },
    { name: "Free Meal", points: 200, icon: Gift },
    { name: "$5 Off Purchase", points: 500, icon: DollarSign },
    { name: "$10 Off Purchase", points: 1000, icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop"
            alt="Lama Rewards Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-primary rounded-md mb-6"
            >
              <Gift className="text-white" size={48} />
            </motion.div>
            <h1 className="typography-h1 mb-4 text-white">
              Lama Rewards
            </h1>
            <p className="typography-body-lg mb-8 opacity-85 max-w-2xl mx-auto text-white">
              Join millions of members earning points on every purchase. Get free food, exclusive deals, and special rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/rewards/dashboard"
                className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Join Now - It's Free
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/stores"
                className="btn-secondary bg-white/10 border-white/20 text-white hover:bg-white/20 inline-flex items-center gap-2 text-lg px-8 py-4"
              >
                Find a Store
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm md:text-base text-white">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-white" />
                <span className="text-white">2M+ Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} className="text-white" />
                <span className="text-white">Free to Join</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-white" />
                <span className="text-white">Instant Rewards</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-white">
        <div className="container-standard">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="typography-h2 text-secondary mb-4">
              Why Join Lama Rewards?
            </h2>
            <p className="typography-body-lg text-gray-600 max-w-2xl mx-auto">
              Get more value from every visit with our comprehensive rewards program designed for your convenience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 rounded-md p-6 md:p-8 text-center border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-md mb-4`}>
                    <Icon className={benefit.color} size={32} />
                  </div>
                  <h3 className="typography-h4 text-secondary mb-3">
                    {benefit.title}
                  </h3>
                  <p className="typography-body text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-gray-50">
        <div className="container-standard">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="typography-h2 text-secondary mb-4">
              How It Works
            </h2>
            <p className="typography-body-lg text-gray-600 max-w-2xl mx-auto">
              Getting started is easy. Follow these simple steps to start earning rewards today.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {howItWorks.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-md p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-all duration-300 h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-md flex items-center justify-center text-white font-bold typography-h3">
                        {step.step}
                      </div>
                      <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
                        <StepIcon className="text-primary" size={24} />
                      </div>
                    </div>
                    <h3 className="typography-h4 text-secondary mb-3">
                      {step.title}
                    </h3>
                    <p className="typography-body text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-300 transform -translate-y-1/2">
                      <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 text-gray-400" size={16} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Points System Section */}
      <section className="section bg-white">
        <div className="container-standard">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="typography-h2 text-secondary mb-4">
                Earn Points, Get Rewards
              </h2>
              <p className="typography-body-lg text-gray-600 mb-6">
                Our simple points system makes it easy to earn and redeem rewards. The more you shop, the more you save.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="typography-h4 text-secondary mb-1">1 Point = $1 Spent</h4>
                    <p className="typography-body text-gray-600">Earn points on every purchase at any Lama location.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="typography-h4 text-secondary mb-1">Bonus Points Offers</h4>
                    <p className="typography-body text-gray-600">Get extra points on select items and special promotions.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h4 className="typography-h4 text-secondary mb-1">Points Never Expire</h4>
                    <p className="typography-body text-gray-600">Your points are yours to keep. Use them whenever you want.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-64 md:h-80 rounded-md overflow-hidden"
            >
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                alt="Points System"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Combined Beautiful Section */}
      <section className="section bg-gray-50">
        <div className="container-standard">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-md mb-6">
              <Smartphone className="text-primary" size={32} />
            </div>
            <h2 className="typography-h2 text-secondary mb-4">
              Get Started with Lama Rewards
            </h2>
            <p className="typography-body-lg text-gray-600 mb-8">
              Join Lama Rewards today and start earning points on every purchase. Download our app to manage your rewards, track your points, and access exclusive deals right from your phone. It's free to join and takes less than a minute.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-secondary text-white px-8 py-4 rounded-md font-bold hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <Download size={20} />
                App Store
              </button>
              <button className="bg-secondary text-white px-8 py-4 rounded-md font-bold hover:bg-gray-800 transition-colors inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                <Download size={20} />
                Google Play
              </button>
              <Link
                href="/rewards/dashboard"
                className="btn-primary inline-flex items-center gap-2 px-8 py-4"
              >
                Sign Up Now - It's Free
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
