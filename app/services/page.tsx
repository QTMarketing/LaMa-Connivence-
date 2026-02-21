'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { getProductsByCategory } from '@/lib/productData';
import { 
  MapPin, 
  ArrowRight, 
  CreditCard, 
  Wifi, 
  Car, 
  DollarSign,
  Clock,
  CheckCircle2,
  Building2,
  Zap
} from 'lucide-react';

export default function ServicesPage() {
  const services = getProductsByCategory('services');

  // Organize services into categories (matching navbar structure)
  const serviceCategories = [
    {
      title: 'Financial Services',
      icon: DollarSign,
      description: 'Secure and convenient financial solutions for all your payment needs.',
      items: services.filter(s => 
        s.name.includes('ATM') || 
        s.name.includes('Money') || 
        s.name.includes('Bill') || 
        s.name.includes('Lottery')
      ),
    },
    {
      title: 'Convenience Services',
      icon: Building2,
      description: 'Essential amenities and services to enhance your visit.',
      items: services.filter(s => 
        s.name.includes('Restroom') || 
        s.name.includes('Wi-Fi') || 
        s.name.includes('Prepaid') || 
        s.name.includes('Gift')
      ),
    },
    {
      title: 'Vehicle Services',
      icon: Car,
      description: 'Complete vehicle care and fuel services for your convenience.',
      items: services.filter(s => 
        s.name.includes('Fuel') || 
        s.name.includes('Car Wash')
      ),
    },
    {
      title: 'Additional Services',
      icon: Zap,
      description: 'More ways we serve you better every day.',
      items: services.filter(s => {
        const name = s.name.toLowerCase();
        return !name.includes('atm') && 
               !name.includes('money') && 
               !name.includes('bill') && 
               !name.includes('lottery') && 
               !name.includes('prepaid') && 
               !name.includes('gift') && 
               !name.includes('restroom') && 
               !name.includes('wi-fi') && 
               !name.includes('fuel') && 
               !name.includes('car wash');
      }),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Services Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl"
          >
            <h1 className="typography-h1 text-white">
              Our Services
            </h1>
            <p className="typography-body-lg mt-4 opacity-85 max-w-2xl mx-auto text-white">
              Everything you need, right when you need it. From financial services to vehicle care, we're here to make your life more convenient.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services by Category */}
      <section className="section bg-white">
        <div className="container-standard">
          {serviceCategories.map((category, categoryIndex) => {
            if (category.items.length === 0) return null;
            
            const CategoryIcon = category.icon;
            
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="mb-16 md:mb-20 last:mb-0"
              >
                {/* Category Header */}
                <div className="flex items-start gap-4 mb-8 pb-6 border-b-2 border-gray-200">
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-md bg-primary/10 flex items-center justify-center">
                    <CategoryIcon className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="typography-h2 text-secondary mb-2">
                      {category.title}
                    </h2>
                    <p className="typography-body-lg text-gray-600">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Services List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                  {category.items.map((service, serviceIndex) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: serviceIndex * 0.1 }}
                      className="bg-gray-50 rounded-md p-6 md:p-8 hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex gap-6">
                        {/* Service Image */}
                        <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Service Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="typography-h3 text-secondary">
                              {service.name}
                            </h3>
                            {service.featured && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary text-white typography-caption font-semibold whitespace-nowrap">
                                Featured
                              </span>
                            )}
                          </div>
                          
                          <p className="typography-body text-gray-700 mb-4">
                            {service.description}
                          </p>

                          {/* Service Features */}
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-gray-600">
                              <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                              <span className="typography-body-sm">Available at all locations</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock size={16} className="text-primary flex-shrink-0" />
                              <span className="typography-body-sm">24/7 access where applicable</span>
                            </div>
                          </div>

                          {/* CTA */}
                          <Link
                            href="/stores"
                            className="btn-primary inline-flex items-center gap-2"
                          >
                            <MapPin size={18} />
                            Find a Store
                            <ArrowRight size={18} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section bg-gray-50">
        <div className="container-standard">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="typography-h2 text-secondary mb-4">
              Need Help Finding a Service?
            </h2>
            <p className="typography-body-lg text-gray-600 mb-8">
              Visit any of our locations to access these services. Our friendly staff is always ready to assist you.
            </p>
            <Link
              href="/stores"
              className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
            >
              <MapPin size={20} />
              Find Your Nearest Store
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
