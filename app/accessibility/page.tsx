'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Accessibility"
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
                Accessibility
              </h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                We are committed to ensuring our website and stores are accessible to everyone.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
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
              <h2 className="typography-h2 text-secondary mb-6">Our Commitment</h2>
              <p className="typography-body text-gray-600 mb-6">
                LaMa Convenience Store is committed to providing a website that is accessible to the widest possible audience, regardless of technology or ability. We aim to conform to level AA of the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines 2.1.
              </p>
              
              <h2 className="typography-h2 text-secondary mb-6 mt-12">Accessibility Features</h2>
              <ul className="typography-body text-gray-600 space-y-4 mb-6">
                <li>Keyboard navigation support throughout the site</li>
                <li>Alt text for images and descriptive link text</li>
                <li>Clear heading structure and page organization</li>
                <li>High contrast text for better readability</li>
                <li>Responsive design that works on all devices</li>
              </ul>

              <h2 className="typography-h2 text-secondary mb-6 mt-12">Physical Store Accessibility</h2>
              <p className="typography-body text-gray-600 mb-6">
                Our physical locations are designed to be accessible to all customers. If you have specific accessibility needs or concerns, please contact us and we'll be happy to assist.
              </p>

              <h2 className="typography-h2 text-secondary mb-6 mt-12">Feedback</h2>
              <p className="typography-body text-gray-600 mb-6">
                If you encounter any accessibility barriers on our website or have suggestions for improvement, please contact us. We value your feedback and are committed to making our digital presence accessible to everyone.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
