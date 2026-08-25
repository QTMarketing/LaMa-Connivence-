'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Category band — the Wawa grammar, measured from wawa.com/menu/{coffee,beverages,
 * lunch-dinner,snacks} on 2026-08-25.
 *
 * The key move: Wawa's category fields are pink / teal / mint / white — never Wawa red.
 * Brand red is reserved for the CTA and the logo, so red only ever means "act here" and
 * reads STRONGER for being rare. We do the same with orange: the field is a muted
 * complementary tone per category, and #FF6B35 appears only on the pill and the price.
 * That satisfies "other colours allowed, orange not diluted".
 *
 * No hand-drawn script font here on purpose — Wawa uses one, but adding a third family
 * to Rajdhani + Inter is a risk DESIGN.md already calls out. The doodles carry that feel.
 */

/**
 * Warm fields in orange's own family — the first pass used pale sage/sky, which read as
 * near-white next to the brand and made the band look like the existing rewards section.
 * These are saturated enough to be a colour, light enough that ink clears AA easily.
 */
const FIELDS = {
  // Warm — orange's own family. Safe everywhere, never fights the brand.
  peach: '#FFD9C0',
  sand: '#F5E2C6',
  apricot: '#FFE0B8',
  honey: '#F7E3B5',
  clay: '#F0CFBC',
  blush: '#F6D5CC',
  rose: '#F2CFC6',
  linen: '#F3E8DC',
  ember: '#E8BFA6',
  // Cool — muted true complements of orange (blue/teal sit opposite it on the wheel).
  // Kept desaturated so orange still leads; these are for variety across many bands,
  // not for competing with the CTA.
  sage: '#DDE4D0',
  olive: '#E3E0C4',
  teal: '#CFDED8',
  mist: '#D6E0E6',
  lilac: '#E2DBE6',
} as const;

type Props = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  /** Page heroes use display type; in-page sections stay h2. */
  heading?: 'h1' | 'h2';
  cta?: { label: string; href: string };
  /** Short line beside the CTA. Keep it tight — it shares one line with the button. */
  ctaNote?: string;
  /** Product photo. Omit and pass `visual` for sections that have no food. */
  imageSrc?: string;
  imageAlt?: string;
  /** Replaces the product photo — for Rewards, Careers, About and other food-free bands. */
  visual?: ReactNode;
  field?: keyof typeof FIELDS;
  price?: { amount: string; label?: string };
  className?: string;
  /** Bump the cutout a step without changing other category bands. */
  largeImage?: boolean;
};

export default function CategoryBand({
  eyebrow,
  title,
  subtitle,
  heading = 'h2',
  cta,
  ctaNote,
  imageSrc,
  imageAlt,
  visual,
  field = 'peach',
  price,
  className = '',
  largeImage = false,
}: Props) {
  return (
    <section
      className={`category-band relative overflow-hidden ${className}`}
      style={{ backgroundColor: FIELDS[field] }}
    >
      <div className="container-standard relative px-4 md:px-6">
        <div className="grid items-center gap-6 py-8 pb-20 md:gap-8 md:py-10 md:pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-12">
          {/* Copy — ink on a light field is 14:1+, so no scrim is needed anywhere. */}
          <div>
            {eyebrow && (
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/60">
                {eyebrow}
              </p>
            )}
            {heading === 'h1' ? (
              <h1 className="typography-display max-w-xl text-[#1A1A1A]">{title}</h1>
            ) : (
              <h2 className="typography-h2 max-w-md text-[#1A1A1A]">{title}</h2>
            )}
            {subtitle && (
              <p className="typography-body-lg mt-4 max-w-md text-[#1A1A1A]/75">
                {subtitle}
              </p>
            )}
            {cta && (
              /* CTA + note share ONE line and are capped to the same max-w-md as the
                 subtitle, so this block never spreads wider than the copy above it. */
              <div className="mt-7 flex max-w-md flex-nowrap items-center gap-3">
                {/* Orange pill with INK label. White on #FF6B35 is 2.84:1 and fails AA;
                    ink on orange is 6.14:1. */}
                {ctaNote && (
                  <span className="min-w-0 text-[0.72rem] font-semibold leading-tight text-[#1A1A1A]/65">
                    {ctaNote}
                  </span>
                )}
                <Link
                  href={cta.href}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#FF6B35] px-6 py-3 text-[0.95rem] font-bold text-[#1A1A1A] shadow-[0_6px_18px_rgba(255,107,53,0.35)] transition-colors hover:bg-[#E55A2B]"
                >
                  {cta.label}
                </Link>
              </div>
            )}
          </div>

          {/* Product sits on the field. Not a plate. */}
          <div
            className={`relative lg:ml-auto lg:w-full lg:pl-0 ${largeImage ? 'lg:max-w-[520px]' : 'lg:max-w-[430px]'}`}
          >
            <div
              className={`band-product relative mx-auto w-full ${
                visual
                  ? 'max-w-[340px] py-2'
                  : largeImage
                    ? 'aspect-square max-w-[460px]'
                    : 'aspect-square max-w-[380px]'
              }`}
            >
              {visual ? (
                <div className="flex h-full w-full items-center justify-center">{visual}</div>
              ) : imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt ?? ''}
                  fill
                  sizes={
                    largeImage
                      ? '(max-width: 1024px) 80vw, 460px'
                      : '(max-width: 1024px) 70vw, 380px'
                  }
                  className="object-contain drop-shadow-[0_18px_26px_rgba(26,26,26,0.22)]"
                />
              ) : null}
            </div>

            {/* Price sits on the product side, orange on ink — the one dark element. */}
            {price && (
              <div className="absolute bottom-0 left-0 rounded-full bg-[#1A1A1A] px-5 py-3 text-center leading-none shadow-[0_8px_18px_rgba(26,26,26,0.28)] md:left-4">
                <span className="font-[var(--font-rajdhani)] text-2xl font-black text-[#FF6B35] md:text-3xl">
                  {price.amount}
                </span>
                {price.label && (
                  <span className="ml-2 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/80">
                    {price.label}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
