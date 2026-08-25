'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Terms of Service"
        subtitle="The terms that govern your use of LaMa Convenience websites and stores."
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
              <h2 className="typography-h2 text-secondary mb-6">Acceptance of Terms</h2>
              <p className="typography-body text-gray-600 mb-6">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
              <h2 className="typography-h2 text-secondary mb-6 mt-12">Use License</h2>
              <p className="typography-body text-gray-600 mb-6">
                Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
