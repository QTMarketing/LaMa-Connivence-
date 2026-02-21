'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';
import { Timeline } from '@/components/ui/timeline';


export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const timelineData = [
    {
      title: 'Our Mission',
      content: (
        <div>
          <p className="text-white/90 text-sm md:text-base font-normal mb-6 leading-relaxed">
            To be your trusted neighborhood stop, providing fresh food, quality products, and exceptional service that makes every visit convenient and enjoyable. We are committed to serving our communities with integrity, offering the best selection of products while maintaining the highest standards of quality and customer care.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop"
              alt="Mission"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&h=500&fit=crop"
              alt="Mission"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=500&fit=crop"
              alt="Mission"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500&h=500&fit=crop"
              alt="Mission"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Our Vision',
      content: (
        <div>
          <p className="text-white/90 text-sm md:text-base font-normal mb-6 leading-relaxed">
            To become the most beloved convenience store chain in every community we serve, known for our commitment to quality, community, and customer satisfaction. We envision a future where LaMa Convenience is the first choice for fresh food, daily essentials, and exceptional service in every neighborhood.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&h=500&fit=crop"
              alt="Vision"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500&h=500&fit=crop"
              alt="Vision"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&h=500&fit=crop"
              alt="Vision"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop"
              alt="Vision"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
    {
      title: 'Our History',
      content: (
        <div>
          <p className="text-white/90 text-sm md:text-base font-normal mb-6 leading-relaxed">
            LaMa Convenience was founded in 2015 with a simple goal: to be your trusted neighborhood stop. What started as a single location has grown into a beloved chain serving communities across the region. Over the years, we've stayed true to our founding principles of quality, community, and convenience, while continuously evolving to meet the changing needs of our customers.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=500&h=500&fit=crop"
              alt="History"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&h=500&fit=crop"
              alt="History"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=500&fit=crop"
              alt="History"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&h=500&fit=crop"
              alt="History"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white" ref={containerRef}>
      {/* Hero Section - Full Width Image with Text Overlay */}
      <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&h=1080&fit=crop"
            alt="About Us Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        {/* Container for Title and Glass Banner */}
        <div className="relative z-40 h-full w-full flex flex-col items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mb-6 sm:mb-6 md:mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black">
              About Us
            </h1>
          </motion.div>
          {/* Glass Banner - Floating Inside Hero */}
          <GlassBanner />
        </div>
      </section>

      {/* Timeline Section - Mission, Vision, History */}
      <Timeline data={timelineData} />





      {/* CTA Section */}
      <section className="py-12 md:py-16 px-6" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-4">
              Ready to Experience the LaMa Difference?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
              Visit one of our convenient locations to discover fresh food, quality products, and exceptional service. Join our rewards program to unlock exclusive deals and earn points on every purchase.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/stores"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition-all hover:scale-105 min-h-[44px]"
                style={{ backgroundColor: '#FF6B35' }}
              >
                Find a Store Near You
              </Link>
              <Link
                href="/rewards"
                className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold transition-all hover:scale-105"
                style={{ borderColor: '#FF6B35', color: '#FF6B35' }}
              >
                Join LaMa Rewards
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
