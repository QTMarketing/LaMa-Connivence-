'use client';

import { motion } from 'framer-motion';
import InnerHero from '@/components/InnerHero';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
        <InnerHero
          title="Contact Us"
          subtitle="We'd love to hear from you. Get in touch with our team."
          imageAlt="LaMa food on orange"
        />

      {/* Contact Content */}
      <section className="section">
        <div className="container-standard">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="card p-6"
              >
                <Phone className="w-8 h-8 text-primary mb-4" />
                <h3 className="typography-h3 text-secondary mb-2">Phone</h3>
                <p className="typography-body text-gray-600">Contact us by phone during business hours.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="card p-6"
              >
                <Mail className="w-8 h-8 text-primary mb-4" />
                <h3 className="typography-h3 text-secondary mb-2">Email</h3>
                <p className="typography-body text-gray-600">Send us an email and we'll get back to you.</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="typography-h2 text-secondary mb-6">Visit Our Stores</h2>
              <p className="typography-body text-gray-600 mb-6">
                Find a location near you and stop by. Our friendly team is ready to help with whatever you need.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
