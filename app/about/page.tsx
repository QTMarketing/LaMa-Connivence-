'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="About LaMa"
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
                About LaMa
              </h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                Your trusted neighborhood convenience store, serving communities with quality products and exceptional service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="section">
        <div className="container-standard">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="typography-h2 text-secondary mb-6">Our Story</h2>
              <p className="typography-body text-gray-600 mb-6">
                LaMa Convenience Store was founded with a simple mission: to provide our communities with a convenient, friendly, and reliable shopping experience. We understand that convenience means more than just location—it means having what you need when you need it, at fair prices, with a smile.
              </p>
              
              <h2 className="typography-h2 text-secondary mb-6 mt-12">Our Values</h2>
              <ul className="typography-body text-gray-600 space-y-4 mb-6">
                <li><strong>Community First:</strong> We're not just a store—we're part of your neighborhood, supporting local events and giving back to the communities we serve.</li>
                <li><strong>Quality Products:</strong> From fresh food to daily essentials, we carefully select products that meet our high standards for quality and value.</li>
                <li><strong>Exceptional Service:</strong> Our friendly team is here to help, whether you're grabbing a quick snack or planning a larger purchase.</li>
                <li><strong>Convenience:</strong> With extended hours, easy access, and a wide selection, we make your shopping experience as smooth as possible.</li>
              </ul>

              <h2 className="typography-h2 text-secondary mb-6 mt-12">What We Offer</h2>
              <p className="typography-body text-gray-600 mb-6">
                At LaMa, you'll find everything you need for your daily life:
              </p>
              <ul className="typography-body text-gray-600 space-y-4 mb-6">
                <li>Fresh food and hot meals prepared daily</li>
                <li>Cold beverages, including coffee, energy drinks, and soft drinks</li>
                <li>Snacks and groceries for your home</li>
                <li>Essential items like batteries, phone chargers, and personal care products</li>
                <li>Exclusive deals and promotions to help you save</li>
              </ul>

              <h2 className="typography-h2 text-secondary mb-6 mt-12">Visit Us</h2>
              <p className="typography-body text-gray-600 mb-6">
                We'd love to see you! Find a location near you and stop by. Our team is ready to welcome you and help with whatever you need.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
