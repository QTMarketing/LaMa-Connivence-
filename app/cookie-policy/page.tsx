'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Cookie Policy"
        subtitle="Learn how we use cookies on our website."
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
              <h2 className="typography-h2 text-secondary mb-6">What Are Cookies</h2>
              <p className="typography-body text-gray-600 mb-6">
                Cookies are small text files that are placed on your device when you visit our website.
              </p>
              <h2 className="typography-h2 text-secondary mb-6 mt-12">How We Use Cookies</h2>
              <p className="typography-body text-gray-600 mb-6">
                We use cookies to improve your experience, analyze site usage, and assist with our marketing efforts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
