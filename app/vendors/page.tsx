'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, FileText, CheckCircle, Mail } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';

export default function VendorsPage() {
  const requirements = [
    {
      icon: FileText,
      title: 'Product Information',
      description: 'Provide detailed product information, pricing, and availability.',
    },
    {
      icon: CheckCircle,
      title: 'Quality Standards',
      description: 'Meet our quality standards and safety requirements.',
    },
    {
      icon: Mail,
      title: 'Contact Information',
      description: 'Submit your business contact information and references.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop"
            alt="Vendors Hero"
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
              Vendors
            </h1>
          </motion.div>
          {/* Glass Banner - Floating Inside Hero */}
          <GlassBanner />
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
              Vendor Requirements
            </h2>
            <p className="text-lg text-gray-600">
              To become a LaMa vendor, please ensure you meet the following requirements.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {requirements.map((req, index) => {
              const Icon = req.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-black text-secondary mb-2">
                    {req.title}
                  </h3>
                  <p className="text-gray-600">
                    {req.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 p-8 rounded-xl"
          >
            <h2 className="text-2xl font-black text-secondary mb-4">
              Vendor Information
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                We work with vendors who share our commitment to quality, value, and customer satisfaction. If you're interested in becoming a LaMa vendor, please contact us with the following information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Company name and contact information</li>
                <li>Product or service description</li>
                <li>Pricing and terms</li>
                <li>Delivery capabilities</li>
                <li>References and certifications</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
              Ready to Partner with Us?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Contact our vendor relations team to learn more about becoming a LaMa vendor.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Contact Vendor Relations
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
