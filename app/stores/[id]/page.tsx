'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Clock, Navigation } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { stores } from '@/lib/storeData';

interface StoreDetailPageProps {
  params: {
    id: string;
  };
}

export default function StoreDetailPage({ params }: StoreDetailPageProps) {
  const store = stores.find(s => s.id === parseInt(params.id));

  if (!store) {
    notFound();
  }

  const mapUrl = `https://www.google.com/maps?q=${store.lat},${store.lng}`;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/stores" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Stores</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <MapPin className="text-primary" size={32} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-secondary mb-4">
              {store.name}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Store Details */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Store Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-3xl font-black text-secondary mb-6">
                  Store Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary mb-1">Address</h3>
                      <p className="text-gray-600">{store.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary mb-1">Phone</h3>
                      <a href={`tel:${store.phone}`} className="text-gray-600 hover:text-primary transition-colors">
                        {store.phone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary mb-1">Hours</h3>
                      <p className="text-gray-600">{store.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-2xl font-bold text-secondary mb-4">
                  Available Services
                </h2>
                <ul className="space-y-2 text-gray-600">
                  <li>• Fresh food and beverages</li>
                  <li>• ATM services</li>
                  <li>• Fuel (if applicable)</li>
                  <li>• Lottery tickets</li>
                  <li>• Money orders</li>
                  <li>• Free Wi-Fi</li>
                </ul>
              </div>

              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold transition-colors w-full justify-center"
              >
                <Navigation size={20} />
                Get Directions
              </a>
            </motion.div>

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 h-[500px] relative"
            >
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${store.lat},${store.lng}&output=embed&zoom=15`}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
