import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';

import ApplicationForm from '@/components/careers/ApplicationForm';
import { getPublicJobBySlug } from '@/lib/careers/queries';

interface JobPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getPublicJobBySlug(slug);

  if (!job) {
    return { title: 'Job not found | LaMa Convenience' };
  }

  return {
    title: `${job.title} | Careers at LaMa Convenience`,
    description: job.summary,
  };
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getPublicJobBySlug(slug);

  if (!job) notFound();

  const meta = [
    job.department,
    job.location,
    job.employmentType,
    job.payRange,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-[#E2E8F0] bg-[#FFF6EC] px-4 py-10 md:px-6 md:py-14">
        <div className="container-standard">
          <Link
            href="/careers"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#4A5568] transition-colors hover:text-[#FF6B35]"
          >
            <ArrowLeft size={16} />
            All open roles
          </Link>

          <h1 className="typography-h1 mb-4 max-w-3xl text-[#1A1A1A]">
            {job.title}
          </h1>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            {meta.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#4A5568]"
              >
                {item}
              </span>
            ))}
          </div>

          <p className="typography-body-lg max-w-3xl text-[#444444]">
            {job.summary}
          </p>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="container-standard">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            <div className="space-y-10">
              {job.responsibilities.length > 0 && (
                <div>
                  <h2 className="typography-h3 mb-5 text-[#1A1A1A]">
                    What you will do
                  </h2>
                  <ul className="space-y-3">
                    {job.responsibilities.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
                          <Check size={12} className="text-[#1A1A1A]" />
                        </span>
                        <span className="typography-body text-[#444444]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.requirements.length > 0 && (
                <div>
                  <h2 className="typography-h3 mb-5 text-[#1A1A1A]">
                    What you need
                  </h2>
                  <ul className="space-y-3">
                    {job.requirements.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
                          <Check size={12} className="text-[#1A1A1A]" />
                        </span>
                        <span className="typography-body text-[#444444]">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {!job.payRange && (
                <p className="typography-body rounded-md border border-[#E2E8F0] bg-[#F7F7F7] p-5 text-[#444444]">
                  Pay and exact hours are confirmed with the store manager
                  during the interview.
                </p>
              )}
            </div>

            <div id="apply" className="scroll-mt-24">
              <h2 className="typography-h3 mb-5 text-[#1A1A1A]">
                Apply for this role
              </h2>
              <ApplicationForm jobId={job.id} jobTitle={job.title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
