'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Gift, Star } from 'lucide-react';

export default function RewardsDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Rewards Dashboard"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 container-standard px-4 md:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-4xl mx-auto text-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="typography-h1 text-white mb-4">Rewards Dashboard</h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                Track your points, view your rewards, and see your transaction history.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container-standard">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card p-6"
              >
                <Star className="w-8 h-8 text-primary mb-4" />
                <h3 className="typography-h3 text-secondary mb-2">Your Points</h3>
                <p className="typography-body text-gray-600">Track and manage your rewards points.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card p-6"
              >
                <Gift className="w-8 h-8 text-primary mb-4" />
                <h3 className="typography-h3 text-secondary mb-2">Available Rewards</h3>
                <p className="typography-body text-gray-600">Browse and redeem your rewards.</p>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/rewards/dashboard/transactions"
                className="card p-6 block group hover:shadow-lg transition-all"
              >
                <h3 className="typography-h3 text-secondary mb-2 group-hover:text-primary transition-colors">
                  Transaction History
                </h3>
                <p className="typography-body text-gray-600 mb-4">
                  View your past transactions and point earnings.
                </p>
                <div className="inline-flex items-center gap-2 text-primary font-semibold">
                  View Transactions
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
