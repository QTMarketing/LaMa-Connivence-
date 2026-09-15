import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import ApplicationForm from '@/components/careers/ApplicationForm';

export const metadata: Metadata = {
  title: 'Send your details | Careers at LaMa Convenience',
  description:
    'Not seeing the right role? Send LaMa Convenience your details and we will contact you when a shift opens near you.',
};

export default function GeneralApplicationPage() {
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
            Send your details
          </h1>
          <p className="typography-body-lg max-w-3xl text-[#444444]">
            Nothing open near you right now? Leave your details and we will
            reach out when a shift opens at a store close by. We contact people
            already on file first.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 md:px-6 md:py-16">
        <div className="container-standard max-w-2xl">
          <ApplicationForm jobTitle="General application" />
        </div>
      </section>
    </div>
  );
}
