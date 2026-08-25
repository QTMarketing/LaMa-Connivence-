'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Receipt } from 'lucide-react';
import InnerHero from '@/components/InnerHero';
import { CAMPAIGN } from '@/lib/campaignImages';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Transaction History"
        subtitle="View your past purchases and point earnings."
        imageSrc={CAMPAIGN.innerCoffee}
        imageAlt="LaMa coffee on orange"
      />
      <section className="section">
        <div className="container-standard">
          <div className="max-w-4xl mx-auto">
            <Link
              href="/rewards/dashboard"
              className="inline-flex items-center gap-2 text-primary mb-6 hover:underline"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card p-6"
            >
              <Receipt className="w-8 h-8 text-primary mb-4" />
              <h3 className="typography-h3 text-secondary mb-4">Your Transactions</h3>
              <p className="typography-body text-gray-600">
                Your transaction history will appear here once you start making purchases and earning points.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
