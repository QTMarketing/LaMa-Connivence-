'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import type { SiteSettings } from '@/lib/settings/keys';

export default function ContactClient({ settings }: { settings: SiteSettings }) {
  return (
    <section className="section">
      <div className="container-standard">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card p-6"
            >
              <Phone className="mb-4 h-8 w-8 text-primary" />
              <h3 className="typography-h3 mb-2 text-secondary">Phone</h3>
              {settings.contactPhone ? (
                <a
                  href={`tel:${settings.contactPhone.replace(/[^\d+]/g, '')}`}
                  className="typography-body font-semibold text-primary hover:underline"
                >
                  {settings.contactPhone}
                </a>
              ) : (
                <p className="typography-body text-gray-600">
                  Phone number coming soon. Visit a store or use email in the
                  meantime.
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card p-6"
            >
              <Mail className="mb-4 h-8 w-8 text-primary" />
              <h3 className="typography-h3 mb-2 text-secondary">Email</h3>
              {settings.contactEmail ? (
                <a
                  href={`mailto:${settings.contactEmail}`}
                  className="typography-body font-semibold text-primary hover:underline"
                >
                  {settings.contactEmail}
                </a>
              ) : (
                <p className="typography-body text-gray-600">
                  Email address coming soon. Stop by any LaMa store and ask for
                  a manager.
                </p>
              )}
            </motion.div>

            {settings.contactHours && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="card p-6 md:col-span-2"
              >
                <Clock className="mb-4 h-8 w-8 text-primary" />
                <h3 className="typography-h3 mb-2 text-secondary">Hours</h3>
                <p className="typography-body text-gray-600">
                  {settings.contactHours}
                </p>
              </motion.div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="typography-h2 mb-6 text-secondary">
              Visit Our Stores
            </h2>
            <p className="typography-body mb-6 text-gray-600">
              Find a location near you and stop by. Our friendly team is ready
              to help with whatever you need.
            </p>
            <Link
              href="/stores"
              className="btn-primary inline-flex items-center gap-2"
            >
              <MapPin size={18} />
              Find a Store
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
