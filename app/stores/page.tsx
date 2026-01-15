'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { stores } from '@/lib/storeData';
import GlassBanner from '@/components/GlassBanner';

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        {/* Glass Banner - Floating Inside Hero */}
        <GlassBanner />
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop"
            alt="Find a Store Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-40 h-full flex items-start justify-center pt-4 px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-8">
              Find a Store
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group"
              >
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-secondary mb-4 group-hover:text-primary transition-colors">
                    {store.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                      <p className="text-gray-600 text-sm">{store.address}</p>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
                      <a href={`tel:${store.phone}`} className="text-gray-600 text-sm hover:text-primary transition-colors">
                        {store.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="text-primary flex-shrink-0 mt-1" size={20} />
                      <p className="text-gray-600 text-sm">{store.hours}</p>
                    </div>
                  </div>
                  
                  <Link
                    href={`/stores/${store.id}`}
                    className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
                  >
                    View Details
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}




