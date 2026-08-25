'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import GlassBanner from '@/components/GlassBanner';
import InnerHero from '@/components/InnerHero';
import { CAMPAIGN } from '@/lib/campaignImages';
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
              src={CAMPAIGN.combo}
              alt="LaMa mix-and-match food"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.coffee}
              alt="LaMa coffee"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.pizza}
              alt="LaMa pizza"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.taquito}
              alt="LaMa taquitos"
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
              src={CAMPAIGN.sausage}
              alt="LaMa sausage"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.pizza}
              alt="LaMa pizza"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.coffee}
              alt="LaMa coffee"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.innerBand}
              alt="LaMa campaign food"
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
              src={CAMPAIGN.storefront}
              alt="LaMa storefront"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.combo}
              alt="LaMa food"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.coffee}
              alt="LaMa coffee"
              width={500}
              height={500}
              className="rounded-lg object-cover h-32 md:h-44 lg:h-60 w-full shadow-lg"
            />
            <Image
              src={CAMPAIGN.pizza}
              alt="LaMa pizza"
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
        <InnerHero
          title="About Us"
          subtitle="Your trusted neighborhood stop — fresh food, daily essentials, and the people who know your order."
          imageSrc={CAMPAIGN.about}
          imageAlt="Inside a neighborhood convenience store"
          field="#F3E8DC"
        >
          <GlassBanner />
        </InnerHero>

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
