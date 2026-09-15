'use client';

import { useState } from 'react';
import { ArrowRight, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import RewardsHero from '@/components/RewardsHero';
import { rewardFeatures } from '@/lib/rewardFeatureData';
import type { FaqView } from '@/lib/settings/queries';

const membershipCards = rewardFeatures.map((feature) => ({
  title: feature.title,
  description:
    feature.slug === 'digital-wallet'
      ? 'Leave the bulky wallet at home. Pay securely with the LaMa app and track your rewards progress in real time.'
      : feature.slug === 'savings'
        ? 'Save more on the things you love. New members save 15% on their first three visits after signing up.'
        : 'Shop our aisles at your own pace. Scan, pay, and go without ever standing in a traditional line.',
  image: feature.cardImage,
  href: `/rewards/features/${feature.slug}`,
}));

export default function RewardsClient({ faqs }: { faqs: FaqView[] }) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <main>
        <RewardsHero />

        <section className="bg-[#F1F1F1]">
          <div className="w-full max-w-[1380px] mx-auto px-3 md:px-5 lg:px-6 py-10 md:py-12">
            <h2 className="text-center text-[#1A1A1A] font-black text-xl md:text-3xl mb-8 md:mb-11">
              Membership is a Rewarding Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {membershipCards.map((card) => (
                <article
                  key={card.title}
                  className="card flex h-full flex-col p-6"
                >
                  <Link href={card.href} className="block group">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#FAFAF5] rounded-[6px]">
                      <Image src={card.image} alt={card.title} fill className="object-contain object-center" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  </Link>
                  <h3 className="text-center text-[#1A1A1A] text-lg md:text-xl font-black mt-5 mb-2">{card.title}</h3>
                  <p className="text-[#1A1A1A]/80 text-center text-sm md:text-base leading-relaxed min-h-[68px] flex-1">{card.description}</p>
                  <div className="mt-5 text-center">
                    <Link
                      href={card.href}
                      className="btn-primary !text-sm !px-5 !py-2.5"
                    >
                      Learn More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#1A1A1A]">
          <div className="container-standard px-4 text-center py-8 md:py-10">
            <h3 className="!text-white font-black text-2xl md:text-[42px] mb-2">Join LaMaREWARDS</h3>
            <p className="!text-white text-sm md:text-base mb-4">Sign up or log in to your existing LaMa account.</p>
            <Link
              href="/rewards/dashboard"
              className="btn-primary !text-sm !px-5 !py-2.5"
            >
              Learn More
            </Link>
          </div>
        </section>

        <section className="bg-[#F1F1F1]">
          <div className="container-standard px-4 md:px-7 lg:px-10 py-9 md:py-12">
            <h4 className="text-[#1A1A1A] text-xl md:text-3xl font-medium mb-5">Frequently Asked Questions</h4>
            <div className="h-px bg-[#D9D9D9] mb-6" />

            <h5 className="text-[#1A1A1A] text-2xl md:text-4xl font-black mb-5">LaMa REWARDS FAQ</h5>

            <ul className="space-y-3 md:space-y-4">
              {faqs.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `faq-panel-${index}`;
                const buttonId = `faq-button-${index}`;

                return (
                  <li key={item.id} className="border-b border-[#DCDCDC] pb-3 md:pb-4">
                    <button
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between gap-4 text-left"
                    >
                      <span className="text-[#1A1A1A] text-sm md:text-base">{item.question}</span>
                      <span className="w-5 h-5 min-w-5 rounded-full bg-[#FF6B35] text-[#1A1A1A] inline-flex items-center justify-center hover:bg-[#E55A2B] transition-colors">
                        <Plus size={12} className={isOpen ? 'rotate-45 transition-transform' : 'transition-transform'} />
                      </span>
                    </button>

                    {isOpen && (
                      <div id={panelId} role="region" aria-labelledby={buttonId} className="pt-3 pr-9">
                        <p className="text-[#1A1A1A]/80 text-sm md:text-base leading-relaxed">{item.answer}</p>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="bg-[#FF6B35] py-6 md:py-7">
          <div className="container-standard px-4">
            <Link
              href="/stores"
              className="flex items-center justify-between max-w-[560px] mx-auto text-[#1A1A1A] text-base md:text-lg border-b border-[#1A1A1A]/40 pb-1.5"
            >
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} />
                <span>Store Locator</span>
              </span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
