'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Gift, Star } from 'lucide-react';
import InnerHero from '@/components/InnerHero';
import { CAMPAIGN } from '@/lib/campaignImages';

export default function RewardsDashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Rewards Dashboard"
        subtitle="Track your points, view your rewards, and see your transaction history."
        imageSrc={CAMPAIGN.innerCoffee}
        imageAlt="LaMa coffee on orange"
      />
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
