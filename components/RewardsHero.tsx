'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CAMPAIGN } from '@/lib/campaignImages';

/** Same box as CategoryBand on Deals / Drinks / Services. Orange field + white type is the Rewards exception. */
export default function RewardsHero() {
  return (
    <section className="relative overflow-hidden bg-[#FF6B35]">
      <div className="container-standard relative px-4 md:px-6">
        <div className="grid items-center gap-6 py-8 pb-20 md:gap-8 md:py-10 md:pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-12">
          <div>
            <h1 className="typography-display max-w-xl text-white">Join LaMa Rewards</h1>
            <p className="typography-body-lg mt-4 max-w-md text-white/90">
              Free to join. Earn points on every visit and redeem them for the food and drinks you
              already buy.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-white/80 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white">
                Free to join
              </span>
              <span className="rounded-full border border-white/80 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white">
                Earn every visit
              </span>
            </div>
            <div className="mt-7 flex max-w-md flex-nowrap items-center gap-3">
              <Link
                href="/rewards/dashboard"
                className="inline-flex shrink-0 items-center rounded-full bg-[#1A1A1A] px-6 py-3 text-[0.95rem] font-bold text-white transition-colors hover:bg-black"
              >
                Get The App
              </Link>
            </div>
          </div>

          <div className="relative lg:ml-auto lg:w-full lg:max-w-[430px] lg:pl-0">
            <div className="band-product relative mx-auto aspect-square w-full max-w-[380px]">
              <Image
                src={CAMPAIGN.rewards}
                alt="Smartphone bursting from a gift box with LaMa Rewards points on the screen"
                fill
                priority
                sizes="(max-width: 1024px) 70vw, 380px"
                className="object-contain drop-shadow-[0_18px_26px_rgba(26,26,26,0.22)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
