'use client';

import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

export default function StoreLocator() {
  return (
    <section className="py-12 md:py-16 px-6" style={{ backgroundColor: '#FF6B35' }}>
      <div className="max-w-3xl mx-auto flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const searchQuery = formData.get('search') as string;
              // Navigate to stores page with search query
              window.location.href = `/stores?search=${encodeURIComponent(searchQuery)}`;
            }}
            className="flex items-center gap-4 w-full"
          >
            <div className="relative flex-1">
              <input
                type="text"
                name="search"
                placeholder="Find Your Nearest LaMa Convenience Store"
                required
                className="w-full pl-12 pr-4 py-4 border-b-2 border-white/50 bg-transparent focus:outline-none focus:border-white text-base text-white placeholder-white/80"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white" size={20} />
            </div>
            <button
              type="submit"
              className="text-white hover:text-white/80 transition-colors flex-shrink-0"
              aria-label="Find Store"
            >
              <ArrowRight size={24} />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
