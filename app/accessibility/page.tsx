'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Accessibility"
        subtitle="We are committed to ensuring our website and stores are accessible to everyone."
        imageAlt="LaMa food on orange"
      />

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
