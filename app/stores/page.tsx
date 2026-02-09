'use client';

import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { MapPin, Phone, Clock, ArrowRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllStores, type Store } from '@/lib/storeData';
import GlassBanner from '@/components/GlassBanner';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-200 rounded-xl flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

export default function StoresPage() {
  const [searchCity, setSearchCity] = useState('');
  const [selectedStore, setSelectedStore] = useState<number | null>(null);
  // Initialize with empty array during SSR, populate in useEffect
  const [allStores, setAllStores] = useState<Store[]>([]);

  // Initialize stores and listen for updates
  useEffect(() => {
    // Initialize stores on mount
    setAllStores(getAllStores());
    
    const handleStoreUpdate = () => {
      setAllStores(getAllStores());
    };
    window.addEventListener('storesUpdated', handleStoreUpdate);
    return () => window.removeEventListener('storesUpdated', handleStoreUpdate);
  }, []);

  // Extract city from address and filter stores
  const filteredStores = useMemo(() => {
    if (!searchCity.trim()) {
      return allStores;
    }
    
    const searchLower = searchCity.toLowerCase().trim();
    return allStores.filter(store => {
      // Extract city from address (format: "Address, City, State ZIP")
      const addressParts = store.address.split(',');
      if (addressParts.length >= 2) {
        const city = addressParts[1].trim().toLowerCase();
        return city.includes(searchLower);
      }
      return store.address.toLowerCase().includes(searchLower);
    });
  }, [searchCity, allStores]);

  // Calculate center of map based on filtered stores
  const mapCenter = useMemo(() => {
    if (filteredStores.length === 0) {
      return { lat: 32.7767, lng: -96.7970 }; // Default to Dallas
    }
    
    const avgLat = filteredStores.reduce((sum, store) => sum + store.lat, 0) / filteredStores.length;
    const avgLng = filteredStores.reduce((sum, store) => sum + store.lng, 0) / filteredStores.length;
    
    return { lat: avgLat, lng: avgLng };
  }, [filteredStores]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
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
        {/* Container for Title and Glass Banner */}
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mb-4 sm:mb-6 md:mb-8"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black">
              Find a Store
            </h1>
          </motion.div>
          {/* Glass Banner - Floating Inside Hero */}
          <GlassBanner />
        </div>
      </section>

      {/* Search and Map Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4 text-center">
              Find Stores Near You
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Search by city name to see all LaMa Convenience locations on the map
            </p>
            
            {/* City Search Input */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Enter city name (e.g., Dallas, Fort Worth)"
                  className="w-full pl-12 pr-12 py-3 sm:py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary text-base sm:text-lg min-h-[44px]"
                />
                {searchCity && (
                  <button
                    onClick={() => setSearchCity('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
              {searchCity && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Found <strong>{filteredStores.length}</strong> {filteredStores.length === 1 ? 'store' : 'stores'} in {searchCity}
                </p>
              )}
            </div>
          </motion.div>

          {/* Map Component */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mb-8">
            <MapComponent
              stores={filteredStores}
              center={mapCenter}
              selectedStore={selectedStore}
              onStoreSelect={setSelectedStore}
            />
          </div>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-secondary mb-8 text-center">
            {searchCity ? `Stores in ${searchCity}` : 'All Locations'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.length > 0 ? (
              filteredStores.map((store, index) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-white rounded-2xl overflow-hidden border-2 transition-all hover:shadow-lg cursor-pointer ${
                    selectedStore === store.id ? 'border-primary shadow-lg' : 'border-gray-100'
                  }`}
                  onClick={() => setSelectedStore(store.id)}
                >
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-secondary mb-4 hover:text-primary transition-colors">
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
                      className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group min-h-[44px]"
                    >
                      View Details
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">
                  No stores found in "{searchCity}". Try searching for a different city.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}




