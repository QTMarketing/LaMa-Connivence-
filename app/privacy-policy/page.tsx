'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information."
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
              <h2 className="typography-h2 text-secondary mb-6">Information We Collect</h2>
              <p className="typography-body text-gray-600 mb-6">
                We collect information that you provide directly to us, as well as information automatically collected when you use our services.
              </p>
              <h2 className="typography-h2 text-secondary mb-6 mt-12">How We Use Your Information</h2>
              <p className="typography-body text-gray-600 mb-6">
                We use the information we collect to provide, maintain, and improve our services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
