'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { CAMPAIGN } from '@/lib/campaignImages';

type Props = {
  title: ReactNode;
  subtitle?: ReactNode;
  imageSrc?: string;
  imageAlt: string;
  children?: ReactNode;
  lead?: ReactNode;
  /**
   * Quiet complementary field. When set, the photo sits in a 6px card on the
   * other column — type never sits on the image (ART_DIRECTION split).
   */
  field?: string;
};

export default function InnerHero({
  title,
  subtitle,
  imageSrc = CAMPAIGN.innerBand,
  imageAlt,
  children,
  lead,
  field,
}: Props) {
  const split = Boolean(field);

  if (split) {
    return (
      <section className="relative overflow-hidden" style={{ backgroundColor: field }}>
        <div className="container-standard relative px-4 md:px-6">
          <div className="grid items-center gap-6 py-8 pb-20 md:gap-8 md:py-10 md:pb-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {lead}
                <h1 className="typography-display max-w-xl text-[#1A1A1A]">{title}</h1>
                {subtitle ? (
                  <p className="typography-body-lg mt-4 max-w-md text-[#1A1A1A]/75">
                    {subtitle}
                  </p>
                ) : null}
                {children ? <div className="mt-6 max-w-md">{children}</div> : null}
              </motion.div>
            </div>

            <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-[6px] border border-[#1A1A1A]/10 shadow-[0_12px_28px_rgba(26,26,26,0.12)] lg:ml-auto">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 520px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-photo-band bg-[#FF6B35]">
      <div className="relative z-10 mx-auto grid h-full w-full max-w-7xl grid-cols-[minmax(0,1fr)_minmax(0,42%)] items-stretch gap-3 px-4 md:gap-6 md:px-6">
        <div className="flex min-w-0 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {lead}
            <h1 className="typography-h1 text-[#1A1A1A]">{title}</h1>
            {subtitle ? (
              <p className="typography-body-lg mt-3 max-w-md text-[#1A1A1A]">{subtitle}</p>
            ) : null}
            {children ? <div className="mt-4 max-w-sm">{children}</div> : null}
          </motion.div>
        </div>

        <div className="relative h-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 768px) 42vw, 42vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
