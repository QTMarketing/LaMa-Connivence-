'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';

export default function CaliforniaPrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="California Privacy Rights"
        subtitle="Your privacy rights under the California Consumer Privacy Act (CCPA)."
        imageAlt="LaMa food on orange"
      />
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
              <h2 className="typography-h2 text-secondary mb-6">Your Rights</h2>
              <p className="typography-body text-gray-600 mb-6">
                Under the California Consumer Privacy Act (CCPA), California residents have specific rights regarding their personal information.
              </p>
              <h2 className="typography-h2 text-secondary mb-6 mt-12">Contact Us</h2>
              <p className="typography-body text-gray-600 mb-6">
                For questions about your privacy rights, please contact us.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
