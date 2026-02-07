'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlassBanner() {
  return (
    <div className="relative z-30 w-full max-w-[calc(100vw-2rem)] sm:max-w-4xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 md:mb-4 px-2">
            Join LaMa Convenience Rewards
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-white font-normal mb-6 md:mb-8 leading-relaxed px-2">
            Unlock exclusive member-only deals and earn points on every purchase!
          </p>
          <Link
            href="/rewards"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-sm sm:text-base md:text-lg transition-all hover:scale-105 min-h-[44px]"
            style={{ backgroundColor: '#FF6B35' }}
          >
            Sign Up Free
            <ArrowRight size={18} className="sm:w-5 sm:h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
