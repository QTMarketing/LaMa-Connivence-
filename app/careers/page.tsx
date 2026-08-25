'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, DollarSign } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';
import InnerHero from '@/components/InnerHero';
import { CAMPAIGN } from '@/lib/campaignImages';

export default function CareersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Competitive Pay',
      description: 'We offer competitive wages and opportunities for advancement.',
    },
    {
      icon: Clock,
      title: 'Flexible Schedules',
      description: 'Work-life balance with flexible scheduling options.',
    },
    {
      icon: MapPin,
      title: 'Multiple Locations',
      description: 'Work at a location convenient for you.',
    },
  ];

  const positions = [
    {
      title: 'Store Associate',
      department: 'Retail',
      location: 'Multiple Locations',
      type: 'Full-time / Part-time',
    },
    {
      title: 'Shift Manager',
      department: 'Management',
      location: 'Multiple Locations',
      type: 'Full-time',
    },
    {
      title: 'Assistant Manager',
      department: 'Management',
      location: 'Multiple Locations',
      type: 'Full-time',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
        <InnerHero title="Careers" imageSrc={CAMPAIGN.innerCoffee} imageAlt="LaMa coffee on orange">
          <GlassBanner />
        </InnerHero>

      {/* Benefits Section */}
      <section className="py-12 md:py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
              Why Work at LaMa?
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                    <Icon className="text-primary" size={32} />
                  </div>
                  <h3 className="text-xl font-black text-secondary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-12 md:py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-gray-600">
              Check out our current job openings and find the perfect opportunity for you.
            </p>
          </motion.div>
          <div className="space-y-4">
            {positions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-black text-secondary mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                    </div>
                  </div>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 whitespace-nowrap"
                    style={{ backgroundColor: '#FF6B35' }}
                  >
                    Apply Now
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
              Don't See a Position That Fits?
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We're always accepting applications. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
              style={{ backgroundColor: '#FF6B35' }}
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
