'use client';

import { motion } from 'framer-motion';
import { MapPin, Users, Package, Award } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { number: '25+', label: 'Locations', icon: MapPin },
    { number: '10+', label: 'Years Serving', icon: Award },
    { number: '150+', label: 'Team Members', icon: Users },
    { number: '2,000+', label: 'Products', icon: Package },
  ];

  const values = [
    {
      title: 'Community First',
      description: 'We believe in supporting the neighborhoods we serve. Every store is a local hub where people come together.',
    },
    {
      title: 'Quality Always',
      description: 'From our fresh food to our coffee, we source the best ingredients and prepare everything with care.',
    },
    {
      title: 'Convenience Redefined',
      description: 'Open when you need us, stocked with what you want, and always ready to help.',
    },
    {
      title: 'Value You Can Trust',
      description: 'Fair prices, quality products, and rewards that actually matter. Your satisfaction is our priority.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-black text-secondary mb-6"
          >
            About Lama
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Lama started with a simple idea: convenience should be quick, easy, and friendly. 
            We opened our first store with a mission to serve our community better than anyone else.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="text-primary" size={32} />
                </div>
                <div className="text-4xl md:text-5xl font-black text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg mx-auto"
          >
            <h2 className="text-4xl font-black text-secondary mb-6 text-center">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                We believe a convenience store should be a neighborhood hub where people feel welcomed, 
                valued, and taken care of. That's why we do things differently.
              </p>
              <p>
                Every Lama location is designed to be more than just a place to grab a snack or fill up your tank. 
                We're part of the community, and we're here to make your day a little bit better.
              </p>
              <p>
                From our baristas who remember your coffee order to our team members who greet you with a smile, 
                we're building something special—one customer, one store, one neighborhood at a time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-secondary mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-bold text-secondary mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
