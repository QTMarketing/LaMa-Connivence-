'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlassBanner() {
  return (
    <div className="relative z-30 w-full max-w-[calc(100vw-2rem)] sm:max-w-xl md:max-w-3xl lg:max-w-4xl px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded p-2.5 sm:p-3 md:p-4 shadow-xl border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="text-center glass-banner">
          <h2 
            className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 md:mb-1.5 px-2 whitespace-nowrap"
            style={{ 
              fontFamily: 'var(--font-inter), sans-serif !important',
              fontSize: 'clamp(0.8125rem, calc(3vw - 0.3125rem), 1.4375rem) !important',
              lineHeight: '1.2'
            }}
          >
            Join LaMa Convenience Rewards
          </h2>
          <p 
            className="text-xs sm:text-sm md:text-base text-white font-normal mb-2.5 md:mb-3 leading-relaxed px-2"
            style={{ 
              color: '#FFFFFF',
              fontFamily: 'var(--font-inter), sans-serif !important'
            }}
          >
            Unlock exclusive member-only deals and earn points on every purchase!
          </p>
          <Link
            href="/rewards"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 md:px-8 py-2 md:py-2.5 rounded font-bold text-sm sm:text-base md:text-lg transition-all hover:scale-105 min-h-[34px]"
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
