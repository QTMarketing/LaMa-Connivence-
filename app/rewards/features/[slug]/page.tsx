import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getRewardFeatureBySlug, rewardFeatures } from '@/lib/rewardFeatureData';

type RewardFeatureDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return rewardFeatures.map((feature) => ({ slug: feature.slug }));
}

export default async function RewardFeatureDetailPage({ params }: RewardFeatureDetailPageProps) {
  const resolvedParams = await params;
  const feature = getRewardFeatureBySlug(resolvedParams.slug);

  if (!feature) notFound();

  return (
    <div className="min-h-screen bg-white">
      <section className="relative w-full min-h-[340px] sm:h-[400px] md:h-[470px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image src={feature.heroImage} alt={feature.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/45" />
        </div>
        <div className="relative z-10 h-full container-standard px-4 md:px-7 lg:px-10 flex items-center">
          <div className="max-w-3xl text-white">
            <p className="uppercase tracking-[0.18em] text-xs md:text-sm font-semibold mb-3 text-white/90">LaMa Rewards Feature</p>
            <h1 className="typography-h1 text-white mb-3">{feature.title}</h1>
            <p className="typography-body-lg text-white/90 max-w-2xl">{feature.heroSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="section bg-[#F6F6F6]">
        <div className="container-standard px-4 md:px-7 lg:px-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <h2 className="typography-h2 text-secondary mb-4">Overview</h2>
              <p className="typography-body-lg text-gray-700 mb-5">{feature.shortDescription}</p>
              <div className="space-y-4">
                {feature.overview.map((paragraph) => (
                  <p key={paragraph} className="typography-body text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="relative w-full h-[280px] md:h-[360px] rounded-md overflow-hidden shadow-lg">
              <Image src={feature.cardImage} alt={`${feature.title} visual`} fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-standard px-4 md:px-7 lg:px-10">
          <h2 className="typography-h2 text-secondary mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {feature.steps.map((step, index) => (
              <article key={step} className="bg-[#FAFAFA] border border-gray-200 rounded-md p-5 md:p-6">
                <div className="w-10 h-10 rounded-full bg-[#FF6B35] text-white font-bold flex items-center justify-center mb-4">
                  {index + 1}
                </div>
                <p className="typography-body text-gray-700">{step}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#F6F6F6]">
        <div className="container-standard px-4 md:px-7 lg:px-10">
          <h2 className="typography-h2 text-secondary mb-8">Member Benefits</h2>
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {feature.benefits.map((benefit) => (
              <article key={benefit.title} className="bg-white border border-gray-200 rounded-md p-5 md:p-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <CheckCircle2 className="text-[#FF6B35]" size={18} />
                  <h3 className="typography-h4 text-secondary">{benefit.title}</h3>
                </div>
                <p className="typography-body text-gray-700 leading-relaxed">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-standard px-4 md:px-7 lg:px-10">
          <h2 className="typography-h2 text-secondary mb-8">Feature Gallery</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {feature.gallery.map((item) => (
              <div key={item.image} className="relative h-[240px] md:h-[300px] rounded-md overflow-hidden shadow-md">
                <Image src={item.image} alt={item.alt} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#FF6B35]">
        <div className="container-standard px-4 md:px-7 lg:px-10 text-center text-white">
          <h2 className="typography-h2 text-white mb-3">Ready to Use {feature.title}?</h2>
          <p className="typography-body-lg text-white/90 mb-6 max-w-2xl mx-auto">
            Open your rewards dashboard to manage your account, view active offers, and start using this feature today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/rewards/dashboard" className="btn-secondary border-white text-white hover:bg-white hover:text-[#1A1A1A]">
              Open Rewards Dashboard
            </Link>
            <Link href="/rewards" className="inline-flex items-center gap-2 text-white font-semibold hover:underline">
              Back to Rewards
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
