'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GlassBanner() {
  return (
    <div className="relative z-30 w-full max-w-[calc(100vw-1rem)] sm:max-w-xl md:max-w-3xl lg:max-w-4xl px-2 sm:px-4 md:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-md p-3 sm:p-4 md:p-6 shadow-xl border border-white/10"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          boxShadow: '0 4px 16px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="text-center glass-banner">
          <h2 
            className="text-white mb-1.5 sm:mb-2 px-1 sm:px-2 break-words sm:whitespace-nowrap"
            style={{ 
              fontFamily: 'var(--font-inter), sans-serif !important',
              fontSize: 'clamp(0.875rem, 3vw, 1.125rem)', // Smaller on mobile
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            Join LaMa Convenience Rewards
          </h2>
          <p 
            className="text-white mb-3 sm:mb-4 px-1 sm:px-2"
            style={{ 
              color: '#FFFFFF',
              fontFamily: 'var(--font-inter), sans-serif !important',
              fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)', // Smaller on mobile
              lineHeight: 1.4,
            }}
          >
            Unlock exclusive member-only deals and earn points on every purchase!
          </p>
          <Link
            href="/rewards"
            className="btn-primary inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5"
          >
            Sign Up Free
            <ArrowRight size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
