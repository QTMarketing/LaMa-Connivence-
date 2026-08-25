'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';

/**
 * Campaign band — the composition pattern from ART_DIRECTION.md.
 *
 * Layer order, back to front:
 *   1. flat brand-orange field          (Little Caesars / Del Taco / ampm)
 *   2. radiating rays behind the product (classic c-store "deal" cue)
 *   3. halftone dot texture              (Rutter's)
 *   4. bright cut-out product cluster    (13 of 20 reference sites)
 *   5. baked-shape starburst + DOM price (RaceTrac)
 *   6. HTML copy and CTAs
 *
 * Everything except the product photograph is SVG/CSS, so the price, headline and
 * graphic layer stay editable — no regeneration when a deal changes. See
 * ART_DIRECTION.md "Graphic devices" for why text is not baked into the image.
 */

const BURST_POINTS =
  '50.00,2.00 59.84,13.29 74.00,8.43 76.87,23.13 91.57,26.00 86.71,40.16 98.00,50.00 86.71,59.84 91.57,74.00 76.87,76.87 74.00,91.57 59.84,86.71 50.00,98.00 40.16,86.71 26.00,91.57 23.13,76.87 8.43,74.00 13.29,59.84 2.00,50.00 13.29,40.16 8.43,26.00 23.13,23.13 26.00,8.43 40.16,13.29';

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  imageSrc?: string;
  imageAlt?: string;
  price?: { amount: string; label?: string };
  className?: string;
};

export default function HeroCampaignBand({
  eyebrow,
  title,
  subtitle,
  children,
  imageSrc = '/campaign/cluster-hero.webp',
  imageAlt = 'Hot dog, taquitos, fountain drink and coffee from LaMa Convenience',
  price,
  className = '',
}: Props) {
  return (
    <section
      className={`hero-campaign relative overflow-hidden bg-[#FF6B35] ${className}`}
    >
      {/* Halftone — dot texture over the field, denser toward the lower left. */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern id="lama-halftone" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.6" fill="#FFFFFF" />
          </pattern>
          <linearGradient id="lama-halftone-fade" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0.13" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="lama-halftone-mask">
            <rect width="100%" height="100%" fill="url(#lama-halftone-fade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#lama-halftone)"
          mask="url(#lama-halftone-mask)"
          opacity="0.55"
        />
      </svg>

      <div className="container-standard relative z-10 px-4 md:px-6">
        <div className="grid items-center gap-8 py-14 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:py-20">
          {/* Copy — real HTML, so it is selectable, translatable and indexable. */}
          <div className="hero-campaign-copy">
            {eyebrow && (
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#1A1A1A]/65">
                {eyebrow}
              </p>
            )}
            {/* Ink on orange, never white on orange — 2.84:1 fails AA (DESIGN.md). */}
            <h1 className="typography-display text-[#1A1A1A]">{title}</h1>
            {subtitle && (
              <p className="typography-body-lg mt-5 max-w-xl text-[#1A1A1A]/85">
                {subtitle}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>

          {/* Product cluster. Sunburst lives inside this box so the food is the hub. */}
          <div className="relative">
            <div className="hero-cluster relative mx-auto aspect-[784/657] w-full max-w-[620px]">
              <div
                aria-hidden
                className="hero-sunburst pointer-events-none absolute inset-[-52%] origin-center animate-spin motion-reduce:animate-none [animation-duration:60s] [animation-timing-function:linear]"
              >
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <g transform="translate(50 50)">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <polygon
                        key={i}
                        points="0,0 70,-5.5 70,5.5"
                        fill="#ffffff"
                        opacity={i % 2 === 0 ? 0.08 : 0.03}
                        transform={`rotate(${i * 15})`}
                      />
                    ))}
                  </g>
                </svg>
              </div>
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 620px"
                className="object-contain drop-shadow-[0_26px_38px_rgba(26,26,26,0.30)]"
              />
            </div>

            {/* Starburst is a baked SHAPE; the digits are DOM text on top of it. */}
            {price && (
              <div className="hero-burst absolute bottom-2 -left-6 h-32 w-32 sm:h-40 sm:w-40 md:bottom-6 md:-left-32 md:h-48 md:w-48">
                <svg
                  aria-hidden
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full drop-shadow-[0_8px_16px_rgba(26,26,26,0.32)]"
                >
                  {/* The band's single dark element. White on ink is 17.4:1. */}
                  <polygon fill="#1A1A1A" points={BURST_POINTS} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                  <span className="font-[var(--font-rajdhani)] text-[1.7rem] font-black leading-none text-white md:text-[2.2rem]">
                    {price.amount}
                  </span>
                  {price.label && (
                    <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-white/80 md:text-[0.78rem]">
                      {price.label}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
