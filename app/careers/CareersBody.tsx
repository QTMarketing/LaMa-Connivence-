'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin, CalendarClock, TrendingUp } from 'lucide-react';

import type { JobView, RegionView } from '@/lib/careers/types';

const BENEFITS = [
  {
    icon: MapPin,
    title: 'Work near home',
    description:
      'We run stores across Texas, Louisiana, Oklahoma, Arkansas, Mississippi and New Mexico, so there is usually one a short drive away.',
  },
  {
    icon: CalendarClock,
    title: 'Shifts that fit',
    description:
      'Mornings, nights and weekends are all open. Tell us the hours you can work and we build around them.',
  },
  {
    icon: TrendingUp,
    title: 'Room to move up',
    description:
      'Shift Manager and Assistant Manager roles open regularly across the chain, and we look at our own crew first.',
  },
];

export default function CareersBody({
  jobs,
  regions = [],
}: {
  jobs: JobView[];
  regions?: RegionView[];
}) {
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const filteredJobs = useMemo(() => {
    if (regionFilter === 'all') return jobs;
    return jobs.filter((job) => {
      if (job.locationScope === 'chain') return true;
      if (job.locationScope === 'region') {
        return job.regionIds.includes(regionFilter);
      }
      return job.stores.some((s) => s.regionId === regionFilter);
    });
  }, [jobs, regionFilter]);

  return (
    <>
      <section className="bg-[#F7F7F7] px-4 py-12 md:px-6 md:py-16">
        <div className="container-standard">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="typography-h2 mb-10 max-w-2xl text-[#1A1A1A]"
          >
            Why work at LaMa
          </motion.h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {BENEFITS.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-md border border-[#E2E8F0] bg-white p-6"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B35]">
                    <Icon size={20} className="text-[#1A1A1A]" />
                  </span>
                  <h3 className="typography-h4 mb-2 text-[#1A1A1A]">
                    {benefit.title}
                  </h3>
                  <p className="typography-body text-[#444444]">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="openings"
        className="scroll-mt-24 bg-white px-4 py-12 md:px-6 md:py-16"
      >
        <div className="container-standard">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 max-w-2xl"
          >
            <h2 className="typography-h2 mb-3 text-[#1A1A1A]">
              Open positions
            </h2>
            <p className="typography-body-lg text-[#444444]">
              {jobs.length === 0
                ? 'No roles are posted right now. Send us your details below and we will contact you when a shift opens near you.'
                : `${jobs.length} ${jobs.length === 1 ? 'role is' : 'roles are'} open right now. Pay and exact hours are confirmed with the store manager during the interview.`}
            </p>
          </motion.div>

          {regions.length > 0 && jobs.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRegionFilter('all')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  regionFilter === 'all'
                    ? 'bg-[#FF6B35] text-[#1A1A1A]'
                    : 'bg-[#F1F1F1] text-[#4A5568] hover:bg-[#E2E8F0]'
                }`}
              >
                All regions
              </button>
              {regions.map((region) => (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => setRegionFilter(region.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    regionFilter === region.id
                      ? 'bg-[#FF6B35] text-[#1A1A1A]'
                      : 'bg-[#F1F1F1] text-[#4A5568] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.article
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-md border border-[#E2E8F0] bg-white p-6 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-2xl">
                    <h3 className="typography-h4 mb-2 text-[#1A1A1A]">
                      <Link
                        href={`/careers/${job.slug}`}
                        className="hover:text-[#FF6B35] transition-colors"
                      >
                        {job.title}
                      </Link>
                    </h3>
                    <p className="typography-body mb-3 text-[#444444]">
                      {job.summary}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        job.department,
                        job.location,
                        job.employmentType,
                        job.payRange,
                      ]
                        .filter(Boolean)
                        .map((meta) => (
                          <span
                            key={meta}
                            className="rounded-full bg-[#F1F1F1] px-3 py-1 text-xs font-semibold text-[#4A5568]"
                          >
                            {meta}
                          </span>
                        ))}
                    </div>
                  </div>

                  <Link
                    href={`/careers/${job.slug}`}
                    className="btn-primary shrink-0 gap-2 whitespace-nowrap"
                  >
                    View &amp; apply
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}

            {filteredJobs.length === 0 && jobs.length > 0 && (
              <p className="rounded-md border border-[#E2E8F0] bg-[#F7F7F7] p-6 text-[#444444]">
                No openings in that region right now. Try another region or
                send your details below.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7F7] px-4 py-12 md:px-6 md:py-16">
        <div className="container-standard">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="typography-h2 mb-3 text-[#1A1A1A]">
              Nothing open near you?
            </h2>
            <p className="typography-body-lg mb-6 text-[#444444]">
              Send us your details anyway. Stores post new shifts through the
              year, and we contact people already on file first.
            </p>
            <Link href="/careers/apply" className="btn-primary gap-2">
              Send your details
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
