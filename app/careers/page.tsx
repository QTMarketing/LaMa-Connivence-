'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Careers"
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
                Careers
              </h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                Join our team and help us serve our communities.
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
              <h2 className="typography-h2 text-secondary mb-6">Join Our Team</h2>
              <p className="typography-body text-gray-600 mb-6">
                At LaMa Convenience Store, we're always looking for friendly, dedicated individuals to join our team. We offer competitive wages, flexible schedules, and opportunities for growth.
              </p>
              
              <h2 className="typography-h2 text-secondary mb-6 mt-12">Why Work With Us</h2>
              <ul className="typography-body text-gray-600 space-y-4 mb-6">
                <li>Flexible scheduling to fit your life</li>
                <li>Competitive pay and benefits</li>
                <li>Friendly, supportive work environment</li>
                <li>Opportunities for advancement</li>
                <li>Employee discounts</li>
              </ul>

              <h2 className="typography-h2 text-secondary mb-6 mt-12">Open Positions</h2>
              <p className="typography-body text-gray-600 mb-6">
                We're currently hiring for various positions across our locations. Visit one of our stores or contact us to learn more about available opportunities.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
