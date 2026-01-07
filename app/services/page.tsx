'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CreditCard, Car, Droplets, FileText, DollarSign, Ticket, Wifi, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/productData';

const services = [
  {
    id: 1,
    name: 'ATM Services',
    description: 'Convenient ATM access with no surcharge fees. Available 24/7 at all locations.',
    icon: CreditCard,
    image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop',
    category: 'Financial',
    featured: true,
  },
  {
    id: 2,
    name: 'Fuel Services',
    description: 'Premium gasoline and diesel fuel. Rewards program members save on every fill-up.',
    icon: Car,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'Automotive',
    featured: true,
  },
  {
    id: 3,
    name: 'Car Wash',
    description: 'Automated and hand car wash services. Various packages available to suit your needs.',
    icon: Droplets,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    category: 'Automotive',
    featured: true,
  },
  {
    id: 4,
    name: 'Money Orders',
    description: 'Fast and secure money order services for sending payments. Quick and reliable.',
    icon: FileText,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    category: 'Financial',
    featured: false,
  },
  {
    id: 5,
    name: 'Bill Payment',
    description: 'Pay utility bills, phone bills, and more. Quick and convenient service at every location.',
    icon: DollarSign,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    category: 'Financial',
    featured: false,
  },
  {
    id: 6,
    name: 'Lottery Tickets',
    description: 'State lottery tickets and scratch-off games available at all locations.',
    icon: Ticket,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop',
    category: 'Entertainment',
    featured: false,
  },
  {
    id: 7,
    name: 'Public Restrooms',
    description: 'Clean, well-maintained restroom facilities available to all customers.',
    icon: RefreshCw,
    image: 'https://images.unsplash.com/photo-1631889993952-9b67bfb19067?w=800&h=600&fit=crop',
    category: 'Amenities',
    featured: false,
  },
  {
    id: 8,
    name: 'Wi-Fi Access',
    description: 'Free high-speed Wi-Fi available to customers at all locations. Stay connected on the go.',
    icon: Wifi,
    image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=600&fit=crop',
    category: 'Amenities',
    featured: false,
  },
];

export default function ServicesPage() {
  const featuredServices = services.filter(s => s.featured);

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28">
      {/* Hero Section */}
      <section className="relative bg-secondary py-16 md:py-24 px-6" style={{ backgroundColor: '#1A1A1A' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Beyond convenience, we offer a wide range of services to make your life easier. From fuel to financial services, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-4">
              Popular Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              These are some of our most popular services. All available at your local LaMa convenience store.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {featuredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary transition-all group"
              >
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <div className="bg-white/90 backdrop-blur-md rounded-lg p-2">
                      <service.icon className="w-6 h-6 text-primary" style={{ color: '#FF6B35' }} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide mb-2 block">
                    {service.category}
                  </span>
                  <h3 className="text-xl md:text-2xl font-black text-secondary mb-3 group-hover:text-primary transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Services Grid */}
      <section className="py-12 md:py-16 lg:py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary mb-4">
              All Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Browse all the services we offer to help make your day easier and more convenient.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-primary transition-all group text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
                  <service.icon className="w-8 h-8 text-primary" style={{ color: '#FF6B35' }} />
                </div>
                <h3 className="text-lg font-black text-secondary mb-2 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-secondary mb-4">
              Visit Your Local LaMa
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              All services are available at all LaMa locations. Find a store near you to get started.
            </p>
            <Link
              href="/stores"
              className="inline-flex items-center gap-2 bg-secondary border-2 border-primary text-white px-8 py-4 rounded-lg font-bold uppercase transition-all hover:border-primary-dark"
              style={{ backgroundColor: '#1A1A1A', borderColor: '#FF6B35' }}
            >
              Find a Store
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
