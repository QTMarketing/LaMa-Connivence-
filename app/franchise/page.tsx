'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';

export default function FranchisePage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Franchise Opportunities"
        subtitle="Own your own LaMa Convenience Store and join a growing brand."
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
