'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Gift, TrendingUp } from 'lucide-react';
import CategoryBand from '@/components/CategoryBand';

/**
 * Three banner directions, each traced to a real reference measured on 2026-08-25.
 * Identical content in all three so the comparison is about design, not copy.
 *
 *   B — 7-Eleven  (/lp/rollergrill, /products/{candy,snacks,water,bakery,fresh-chilled})
 *   C — Little Caesars + RaceTrac + Del Taco
 *
 * Variant A is <CategoryBand>, the Wawa grammar.
 */

const PRODUCTS = [
  { src: '/campaign/cut-sausage.webp', alt: 'Bahama Mama smoked sausage in a bun' },
  { src: '/campaign/cut-crispitos.webp', alt: 'Crispitos rolled taquitos' },
  { src: '/campaign/cut-rollerbites.webp', alt: 'Rollerbites cheeseburger bites' },
];

/* ------------------------------------------------------------------ *
 * B — 7-ELEVEN
 * Product row on a saturated field, category name in a solid black label
 * box, then a light strip below carrying the copy and the CTA.
 * ------------------------------------------------------------------ */
export function BannerSevenEleven() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative bg-[#E85A28] px-4 py-8 md:px-6">
        {/* Repeating llama tissue-paper pattern — 7-Eleven props their flat-lays on
            branded tissue printed with their own arrow mark. */}
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.13]">
          <defs>
            {/* Food silhouettes, not abstract lines — the pattern should say "we sell
                food". Kept at 7% so it is texture, not decoration competing with product. */}
            <pattern id="lama-food" width="132" height="132" patternUnits="userSpaceOnUse">
              <g fill="#FFFFFF">
                {/* cup + lid */}
                <rect x="16" y="20" width="30" height="7" rx="3.5" />
                <path d="M19 30 h24 l-4 26 h-16 z" />
                {/* hot dog in a bun */}
                <rect x="74" y="30" width="44" height="14" rx="7" />
                <rect x="80" y="26" width="32" height="7" rx="3.5" opacity="0.55" />
                {/* taquito, angled */}
                <rect x="20" y="86" width="40" height="12" rx="6" transform="rotate(-18 40 92)" />
                {/* bite-size roll */}
                <rect x="84" y="84" width="20" height="16" rx="5" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#lama-food)" />
        </svg>

        <div className="container-standard relative">
          <div className="flex items-end justify-end -space-x-6 sm:-space-x-9 md:-space-x-12">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.src}
                className={`relative shrink-0 ${i === 1 ? 'z-20 h-32 w-32 sm:h-44 sm:w-44 md:h-56 md:w-56' : 'z-10 h-24 w-24 translate-y-2 sm:h-32 sm:w-32 md:h-44 md:w-44'}`}
              >
                <Image src={p.src} alt={p.alt} fill sizes="192px" className="object-contain drop-shadow-[0_14px_20px_rgba(26,26,26,0.28)]" />
              </div>
            ))}
          </div>

          {/* The label box — always solid, never type floating on the photo. */}
          <div className="absolute bottom-0 left-0 bg-[#1A1A1A] px-6 py-3 md:px-9 md:py-4">
            <h2 className="typography-h2 leading-none text-white">Grill Favorites</h2>
          </div>
        </div>
      </div>

      {/* Copy + CTA strip, exactly as 7-Eleven runs it under every category banner. */}
      <div className="bg-[#F1F1F1]">
        <div className="container-standard flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <p className="typography-body font-semibold text-[#1A1A1A]">
            Hot off the roller grill all day. $2 each, or mix any 3 for $3.99.
          </p>
          <Link
            href="/deals"
            className="inline-flex w-fit shrink-0 items-center rounded-full bg-[#1A1A1A] px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-black"
          >
            View Deals
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * C — LITTLE CAESARS / RACETRAC
 * Flat brand-orange field, oversized condensed headline, angled starburst
 * price tag, product cluster bleeding in from the right.
 * ------------------------------------------------------------------ */
export function BannerPriceLed() {
  return (
    <section className="relative overflow-hidden bg-[#FF6B35]">
      {/* Tonal llama shape behind, Del Taco's star move. */}
      <div aria-hidden className="pointer-events-none absolute -left-16 top-1/2 hidden h-[130%] w-[38%] -translate-y-1/2 opacity-[0.10] md:block">
        <Image src="/brand/llama-silhouette.png" alt="" fill className="object-contain object-left" sizes="38vw" />
      </div>

      <div className="container-standard relative px-4 py-10 md:px-6 md:py-12">
        <div className="grid items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/65">
              Roller grill · all day
            </p>
            {/* Ink on orange = 6.14:1. White on orange is 2.84:1 and fails AA. */}
            <h2 className="typography-h1 leading-[0.95] text-[#1A1A1A]">
              2 BUCKS.
              <br />
              ANY GRILL ITEM.
            </h2>
            <Link
              href="/deals"
              className="mt-6 inline-flex items-center rounded-full bg-[#1A1A1A] px-7 py-3.5 text-base font-bold text-white transition-colors hover:bg-black"
            >
              See All Deals
            </Link>
          </div>

          <div className="relative flex items-center justify-center gap-2 sm:gap-4">
            {PRODUCTS.map((p) => (
              <div key={p.src} className="relative h-32 w-32 shrink-0 sm:h-40 sm:w-40 md:h-52 md:w-52">
                <Image src={p.src} alt={p.alt} fill sizes="208px" className="object-contain drop-shadow-[0_20px_28px_rgba(26,26,26,0.3)]" />
              </div>
            ))}

            {/* Angled starburst — RaceTrac's "2 FOR $5" device. Shape is art, digits are DOM. */}
            <div className="absolute -bottom-3 -left-2 h-28 w-28 -rotate-12 md:-left-8 md:h-36 md:w-36">
              <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full drop-shadow-[0_8px_16px_rgba(26,26,26,0.32)]">
                <polygon
                  fill="#FFFFFF"
                  points={Array.from({ length: 20 })
                    .map((_, i) => {
                      const r = i % 2 === 0 ? 49 : 39;
                      const a = (i / 20) * Math.PI * 2 - Math.PI / 2;
                      return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`;
                    })
                    .join(' ')}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                <span className="font-[var(--font-rajdhani)] text-3xl font-black text-[#1A1A1A] md:text-4xl">
                  3 / $3.99
                </span>
                <span className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] text-[#1A1A1A]/70">
                  Mix &amp; Match
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * REWARDS — direction A applied to a section with no food.
 * The sign-in card content lives here as real structure instead of a
 * translucent floating panel that shipped with opacity:0.
 * ------------------------------------------------------------------ */
export function RewardsBand() {
  const perks = [
    { icon: Star, label: 'Earn points on every purchase' },
    { icon: Gift, label: 'Member-only deals' },
    { icon: TrendingUp, label: 'Redeem for free items' },
  ];

  return (
    <CategoryBand
      field="apricot"
      eyebrow="LaMa Rewards"
      title="Join LaMa Convenience Rewards"
      subtitle="Unlock exclusive member-only deals and earn points on every purchase."
      cta={{ label: 'Sign Up Free', href: '/rewards' }}
      visual={
        <div className="relative mx-auto flex w-full max-w-[268px] flex-col gap-2.5">
          {/* The mark stands in for the product a food band would carry. */}
          <div className="relative mx-auto mb-1 h-24 w-24">
            <Image src="/brand/lama-mascot.png" alt="" fill className="object-contain" sizes="96px" />
          </div>
          {perks.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-md border border-[#1A1A1A]/10 bg-[#FFF6EC] px-3.5 py-2.5 shadow-[0_4px_12px_rgba(26,26,26,0.08)]"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
                <Icon size={15} className="text-[#1A1A1A]" />
              </span>
              <span className="text-[0.8rem] font-semibold leading-snug text-[#1A1A1A]">{label}</span>
            </div>
          ))}
        </div>
      }
    />
  );
}
