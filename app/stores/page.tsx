'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, Search, ArrowRight } from 'lucide-react';
import { getAllStores, type Store } from '@/lib/storeData';
import { getStoreStatusBadge } from '@/lib/storeUtils';

export default function StoresPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    // Get search query from URL params
    const params = new URLSearchParams(window.location.search);
    const query = params.get('search') || '';
    setSearchQuery(query);

    // Load stores
    const allStores = getAllStores();
    setStores(allStores);
    
    // Set first store as selected by default for map
    if (allStores.length > 0) {
      setSelectedStore(allStores[0]);
    }
  }, []);

  // Filter stores based on search query
  const filteredStores = stores.filter((store) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      store.name.toLowerCase().includes(query) ||
      store.address.toLowerCase().includes(query) ||
      store.phone.includes(query)
    );
  });

  // Update selected store when search results change
  useEffect(() => {
    if (filteredStores.length > 0) {
      // If current selected store is not in filtered results, select first filtered store
      const currentSelectedExists = selectedStore && filteredStores.find(s => s.id === selectedStore.id);
      if (!currentSelectedExists) {
        setSelectedStore(filteredStores[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredStores]);

  // Generate Google Maps embed URL using coordinates
  // This uses the basic Google Maps embed (no API key required for basic embeds)
  const getMapUrl = () => {
    if (selectedStore) {
      // Embed using coordinates - works without API key
      return `https://www.google.com/maps?q=${selectedStore.lat},${selectedStore.lng}&hl=en&z=15&output=embed`;
    }
    if (stores.length > 0) {
      // Show center of all stores if no store selected
      const centerLat = stores.reduce((sum, s) => sum + s.lat, 0) / stores.length;
      const centerLng = stores.reduce((sum, s) => sum + s.lng, 0) / stores.length;
      return `https://www.google.com/maps?q=${centerLat},${centerLng}&hl=en&z=12&output=embed`;
    }
    return null;
  };

  // Fallback: Use Google Maps search URL if API key not available
  const getMapSearchUrl = () => {
    if (selectedStore) {
      return `https://www.google.com/maps/search/?api=1&query=${selectedStore.lat},${selectedStore.lng}`;
    }
    if (stores.length > 0) {
      const firstStore = stores[0];
      return `https://www.google.com/maps/search/?api=1&query=${firstStore.lat},${firstStore.lng}`;
    }
    return '#';
  };

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Find a Store"
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
              <h1 className="typography-h1 text-white mb-4">
                Find Your Nearest Store
              </h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                Visit one of our convenient locations to shop, grab a quick bite, or access our services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Section - Two Column Layout */}
      <section className="section bg-white">
        <div className="container-standard">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Left Column - Title, Description, Search */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="typography-h2 text-secondary mb-4">
                  Our Store Locations
                </h2>
                <p className="typography-body-lg text-gray-700 mb-6 leading-relaxed">
                  Find the nearest LaMa convenience store to you. Search by store name, address, or city to quickly locate what you're looking for.
                </p>
              </motion.div>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by store name, address, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-md bg-white border-2 border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 placeholder-gray-500 typography-body font-medium transition-all duration-300"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </motion.div>

              {/* Store Count */}
              {filteredStores.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="pt-2"
                >
                  <p className="typography-body text-gray-600">
                    <span className="font-semibold text-secondary">{filteredStores.length}</span>{' '}
                    {filteredStores.length === 1 ? 'store' : 'stores'} found
                  </p>
                </motion.div>
              )}

              {/* Store List */}
              {filteredStores.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <p className="typography-body-lg text-gray-600 mb-4">
                    No stores found matching your search.
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="btn-secondary"
                  >
                    Clear Search
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide overflow-x-visible">
                  {filteredStores.map((store, index) => {
                    const status = getStoreStatusBadge(store);
                    return (
                      <motion.div
                        key={store.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => setSelectedStore(store)}
                        className={`card p-5 cursor-pointer transition-all duration-300 relative ${
                          selectedStore?.id === store.id
                            ? 'border-2 border-primary shadow-lg'
                            : 'border border-gray-200 hover:border-primary/50 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="typography-h3 text-secondary">
                            {store.name}
                          </h3>
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full typography-caption font-semibold flex-shrink-0 ml-2"
                            style={{
                              color: status.color,
                              backgroundColor: status.bgColor,
                            }}
                          >
                            {status.text}
                          </span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="text-primary flex-shrink-0 mt-1" size={16} />
                            <p className="typography-body-sm text-gray-700">{store.address}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Phone className="text-primary flex-shrink-0 mt-1" size={16} />
                            <p className="typography-body-sm text-gray-700">{store.phone}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="text-primary flex-shrink-0 mt-1" size={16} />
                            <p className="typography-body-sm text-gray-700">{store.hours}</p>
                          </div>
                        </div>

                        <div 
                          className="relative z-20 mt-4 pt-2 border-t border-gray-100" 
                          onClick={(e) => e.stopPropagation()}
                          onMouseEnter={(e) => e.stopPropagation()}
                          onMouseLeave={(e) => e.stopPropagation()}
                        >
                          <Link
                            href={`/stores/${store.id}`}
                            className="inline-flex items-center gap-2 typography-body-sm font-semibold text-primary hover:text-primary-dark hover:underline transition-all duration-200"
                            style={{ 
                              pointerEvents: 'auto',
                              position: 'relative',
                              zIndex: 20
                            }}
                          >
                            View Details
                            <ArrowRight size={14} className="transition-transform duration-200 hover:translate-x-1" />
                          </Link>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column - Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="sticky top-24"
            >
              <div className="card overflow-hidden p-0 h-[600px] md:h-[700px] lg:h-[800px] relative bg-gray-100">
                {/* Google Maps Embed */}
                {getMapUrl() ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={getMapUrl()}
                    key={selectedStore?.id} // Force re-render when store changes
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 p-6">
                    <MapPin size={48} className="text-gray-400 mb-4" />
                    <p className="typography-body text-gray-600 mb-4 text-center">
                      {selectedStore 
                        ? `View ${selectedStore.name} on Google Maps`
                        : 'Select a store to view on map'}
                    </p>
                    <a
                      href={getMapSearchUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <MapPin size={18} />
                      Open in Google Maps
                    </a>
                    <p className="typography-caption text-gray-500 mt-4 text-center max-w-xs">
                      Add your Google Maps API key to enable embedded maps
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
