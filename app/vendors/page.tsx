'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-white">
      <InnerHero
        title="Vendor Information"
        subtitle="Partner with us to bring your products to our customers."
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
              <h2 className="typography-h2 text-secondary mb-6">Become a Vendor</h2>
              <p className="typography-body text-gray-600 mb-6">
                LaMa Convenience Store is always looking for quality products to offer our customers. If you're a vendor or supplier interested in partnering with us, we'd love to hear from you.
              </p>
              
              <h2 className="typography-h2 text-secondary mb-6 mt-12">What We're Looking For</h2>
              <ul className="typography-body text-gray-600 space-y-4 mb-6">
                <li>Quality products that meet our standards</li>
                <li>Reliable suppliers with consistent delivery</li>
                <li>Competitive pricing</li>
                <li>Products that align with our brand values</li>
              </ul>

              <h2 className="typography-h2 text-secondary mb-6 mt-12">Contact Us</h2>
              <p className="typography-body text-gray-600 mb-6">
                If you're interested in becoming a vendor, please contact us with information about your products and company. We review all vendor applications and will get back to you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
