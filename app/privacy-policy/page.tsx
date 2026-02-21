'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative w-full min-h-[360px] sm:h-[420px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
            alt="Privacy Policy"
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
              <h1 className="typography-h1 text-white mb-4">Privacy Policy</h1>
              <p className="typography-body-lg text-white opacity-85 max-w-2xl mx-auto">
                How we collect, use, and protect your personal information.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
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
