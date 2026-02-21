'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function FranchisePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Franchise"
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
                Franchise Opportunities
              </h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                Own your own LaMa Convenience Store and join a growing brand.
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
              <h2 className="typography-h2 text-secondary mb-6">Franchise With LaMa</h2>
              <p className="typography-body text-gray-600 mb-6">
                Interested in owning your own convenience store? LaMa offers franchise opportunities for qualified individuals who want to be part of a successful brand.
              </p>
              
              <h2 className="typography-h2 text-secondary mb-6 mt-12">Why Franchise With Us</h2>
              <ul className="typography-body text-gray-600 space-y-4 mb-6">
                <li>Proven business model and brand recognition</li>
                <li>Comprehensive training and ongoing support</li>
                <li>Marketing and advertising support</li>
                <li>Established supplier relationships</li>
                <li>Flexible franchise terms</li>
              </ul>

              <h2 className="typography-h2 text-secondary mb-6 mt-12">Get Started</h2>
              <p className="typography-body text-gray-600 mb-6">
                Contact us to learn more about franchise opportunities and how you can become part of the LaMa family.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
