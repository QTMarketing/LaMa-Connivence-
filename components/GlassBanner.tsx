'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlassBanner() {
  return (
    <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-4xl px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl p-6 md:p-8 shadow-xl border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-4 whitespace-nowrap">
            Join LaMa Convenience Rewards
          </h2>
          <p className="text-base md:text-lg text-white font-normal mb-8 leading-relaxed">
            Unlock exclusive member-only deals and earn points on every
          </p>
          <Link
            href="/rewards"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold text-base md:text-lg transition-all hover:scale-105"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Sign Up Free
            <ArrowRight size={20} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
