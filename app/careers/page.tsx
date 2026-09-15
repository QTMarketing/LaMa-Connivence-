import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin, CalendarClock, TrendingUp } from 'lucide-react';

import CategoryBand from '@/components/CategoryBand';
import { getOpenJobs } from '@/lib/careers/queries';

import CareersBody from './CareersBody';

export const metadata: Metadata = {
  title: 'Careers | LaMa Convenience',
  description:
    'Full-time and part-time jobs at LaMa Convenience across Texas, Louisiana, Oklahoma, Arkansas, Mississippi and New Mexico.',
};

// Postings change when Suzeze edits them, so never serve a stale static page.
export const dynamic = 'force-dynamic';

const HIRING_FACTS = [
  { icon: MapPin, label: '96 stores across six states' },
  { icon: CalendarClock, label: 'Full-time and part-time shifts' },
  { icon: TrendingUp, label: 'Shift lead and manager tracks' },
];

export default async function CareersPage() {
  const jobs = await getOpenJobs();

  return (
    <div className="min-h-screen bg-white">
      <CategoryBand
        heading="h1"
        field="sand"
        eyebrow="Now hiring"
        title="Work close to home"
        subtitle="LaMa is a neighborhood chain, which means the store you work at is probably the one you already shop at. Find a shift that fits your week."
        cta={{ label: 'See open roles', href: '#openings' }}
        ctaNote="Full-time and part-time"
        visual={
          <div className="relative mx-auto flex w-full max-w-[268px] flex-col gap-2.5">
            <div className="relative mx-auto mb-1 h-24 w-24">
              <Image
                src="/brand/lama-mascot.png"
                alt=""
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
            {HIRING_FACTS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-md border border-[#1A1A1A]/10 bg-[#FFF6EC] px-3.5 py-2.5 shadow-[0_4px_12px_rgba(26,26,26,0.08)]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
                  <Icon size={15} className="text-[#1A1A1A]" />
                </span>
                <span className="text-[0.8rem] font-semibold leading-snug text-[#1A1A1A]">
                  {label}
                </span>
              </div>
            ))}
          </div>
        }
      />

      <CareersBody jobs={jobs} />
    </div>
  );
}
