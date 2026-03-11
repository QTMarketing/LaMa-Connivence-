'use client';

import { useState } from 'react';
import { ArrowRight, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { rewardFeatures } from '@/lib/rewardFeatureData';

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

const faqItems = [
  {
    question: 'What is LaMa REWARDS?',
    answer:
      'LaMa REWARDS is our loyalty program inside the LaMa app. Members earn points on eligible purchases, unlock member-only offers, and redeem points for free or discounted items.',
  },
  {
    question: 'How does it work?',
    answer:
      'Create a rewards account, scan your in-app barcode before you pay, and points are added automatically after checkout. Once you have enough points, choose a reward in the app and apply it on your next purchase.',
  },
  {
    question: 'How many points do I earn with each purchase?',
    answer:
      'Most eligible purchases earn 1 point per $1 spent before tax. Some promotions and featured products can award bonus points, and those rates are shown in-app during active campaigns.',
  },
  {
    question: 'How do I redeem points for my member rewards?',
    answer:
      'Open the Rewards section in the app, choose an available reward, and tap redeem. The reward moves to your wallet, where you can apply it at checkout by scanning your member barcode.',
  },
  {
    question: 'Where can I view my available member rewards?',
    answer:
      'You can see current points, redeemed rewards, and expiration details in the app under Rewards and Wallet. Your balance updates shortly after qualifying transactions post.',
  },
  {
    question: 'If I select a reward by mistake, how can I get the points back?',
    answer:
      'If the reward has not been used yet, contact support from the app Help section with the reward name and account email. Our team can review and reverse eligible accidental redemptions.',
  },
  {
    question: 'Is it possible to merge multiple accounts?',
    answer:
      'Yes, in most cases. Reach out to support with both account emails or phone numbers, and we can help consolidate balances after ownership verification.',
  },
  {
    question: 'How long do my LaMa REWARDS points last?',
    answer:
      'Points are valid for 12 months from the date they are earned. Any account activity, such as earning or redeeming, helps keep your rewards status active.',
  },
  {
    question: 'Do I still earn points even if I have not registered my account yet?',
    answer:
      'A fully registered account is required to guarantee points. If you scanned as a guest, register with the same phone number as soon as possible so eligible recent activity can be matched.',
  },
  {
    question: 'How can I confirm my scanned card/barcode registered for my transaction?',
    answer:
      'After scanning, the checkout screen should show your member confirmation. Your receipt and in-app activity history will also display the points earned for that transaction once it processes.',
  },
  {
    question: 'Are there limitations with the use of LaMa REWARDS points?',
    answer:
      'Yes. Rewards generally cannot be exchanged for cash, may exclude restricted products, and usually cannot be combined with certain limited-time offers unless explicitly stated in the reward terms.',
  },
];

export default function RewardsPage() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <div className="min-h-screen bg-[#F1F1F1]">
      <main>
        <section className="bg-[#FF6B35] pt-24 md:pt-28">
          <div className="container-standard px-4 md:px-7 lg:px-10 pt-8 md:pt-10 pb-0">
            <div className="grid grid-cols-1 md:grid-cols-2 items-end gap-8 md:gap-10">
              <div className="max-w-[560px] pb-8 md:pb-10">
                <h1
                  className="-mt-6 md:-mt-10 text-white font-black leading-[1.1] text-3xl md:text-[54px] tracking-[-0.01em] mb-4"
                  style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.22)' }}
                >
                  Elevate Your Every Day
                  <br />
                  with LaMa Rewards.
                </h1>
                <p className="!text-white text-sm md:text-base leading-relaxed max-w-[510px] mb-4">
                  Turn your routine into rewards. From instant discounts to birthday surprises and partner privileges, your
                  hometown LaMa app is your ticket to the best we have to offer.
                </p>
                <p className="!text-white font-semibold text-sm md:text-base mb-4">
                  You&apos;re with LaMa. Get Rewarded for it.
                </p>
                <Link
                  href="/rewards/dashboard"
                  className="btn-secondary !bg-white !border-white !text-[#1A1A1A] hover:!bg-[#F5F5F5] hover:!text-[#1A1A1A] !text-sm !px-5 !py-2.5"
                >
                  Get The App
                </Link>
              </div>

              <div className="relative h-[250px] md:h-[340px] lg:h-[390px]">
                <div className="absolute right-0 bottom-0 w-[96%] h-[90%] bg-[#F1F1F1] rounded-t-[999px]" />
                <Image
                  src="/lady.png"
                  alt="LaMa Rewards App User"
                  fill
                  priority
                  className="object-contain object-bottom-right scale-[1.08] md:scale-[1.12] lg:scale-[1.15] origin-bottom-right relative z-10"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#F1F1F1]">
          <div className="w-full max-w-[1380px] mx-auto px-3 md:px-5 lg:px-6 py-14 md:py-16 lg:py-20">
            <h2 className="text-center text-[#1A1A1A] font-black text-xl md:text-3xl mb-8 md:mb-11">
              Membership is a Rewarding Experience
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
              {membershipCards.map((card) => (
                <article key={card.title}>
                  <Link href={card.href} className="block group">
                    <div className="relative w-full h-[220px] md:h-[265px] overflow-hidden bg-gray-200 rounded-sm">
                      <Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                    </div>
                  </Link>
                  <h3 className="text-center text-[#1A1A1A] text-lg md:text-2xl font-black mt-4 mb-2">{card.title}</h3>
                  <p className="text-[#1A1A1A]/80 text-center text-sm md:text-base leading-relaxed min-h-[68px]">{card.description}</p>
                  <div className="mt-4 text-center">
                    <Link
                      href={card.href}
                      className="btn-primary !text-sm !px-4 !py-2"
                    >
                      Learn More
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#FF6B35]">
          <div className="container-standard px-4 text-center py-8 md:py-10">
            <h3 className="!text-white font-black text-2xl md:text-[42px] mb-2">Join LaMaREWARDS</h3>
            <p className="!text-white text-sm md:text-base mb-4">Sign up or log in to your existing LaMa account.</p>
            <Link
              href="/rewards/dashboard"
              className="btn-secondary !bg-white !border-white !text-[#1A1A1A] hover:!bg-[#F5F5F5] hover:!text-[#1A1A1A] !text-sm !px-5 !py-2.5"
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
              {faqItems.map((item, index) => {
                const isOpen = openIndex === index;
                const panelId = `faq-panel-${index}`;
                const buttonId = `faq-button-${index}`;

                return (
                  <li key={item.question} className="border-b border-[#DCDCDC] pb-3 md:pb-4">
                    <button
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between gap-4 text-left"
                    >
                      <span className="text-[#1A1A1A] text-sm md:text-base">{item.question}</span>
                      <span className="w-5 h-5 min-w-5 rounded-full bg-[#FF6B35] text-white inline-flex items-center justify-center hover:bg-[#E55A2B] transition-colors">
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

        <section className="bg-[#FF6B35] !text-white py-6 md:py-7">
          <div className="container-standard px-4">
            <Link
              href="/stores"
              className="flex items-center justify-between max-w-[560px] mx-auto !text-white text-base md:text-lg border-b border-white/50 pb-1.5"
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
