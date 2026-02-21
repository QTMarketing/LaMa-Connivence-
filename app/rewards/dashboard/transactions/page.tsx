'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Receipt } from 'lucide-react';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Transactions"
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
              <h1 className="typography-h1 text-white mb-4">Transaction History</h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                View your past purchases and point earnings.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
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
