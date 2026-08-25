'use client';

import InnerHero from '@/components/InnerHero';
import { useParams, useRouter } from 'next/navigation';
import { drinkPromos } from '@/lib/drinkPromos';
import BrandPackImage from '@/components/BrandPackImage';
import { CAMPAIGN } from '@/lib/campaignImages';

function slugToBrand(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export default function BrandDrinksPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;
  const brand = slugToBrand(slug);

  const promos = drinkPromos.filter(
    (promo) => promo.brand.toLowerCase() === brand.toLowerCase(),
  );

  if (!promos.length) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">
          No promos found for <span className="font-semibold">{brand}</span>.
        </p>
        <button
          type="button"
          onClick={() => router.push('/drinks')}
          className="btn-primary"
        >
          Back to Drinks
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
        <InnerHero
          title={brand}
          subtitle={`Current offers on ${brand} drinks. Price may vary by store.`}
          imageSrc={CAMPAIGN.innerDrinks}
          imageAlt={`${brand} drinks`}
          lead={
            <div className="relative mb-3 h-24 w-14 sm:h-28 sm:w-16">
              <BrandPackImage
                brand={brand}
                alt={brand}
                className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.4)]"
              />
            </div>
          }
        />

      {/* Brand promos grid */}
      <section className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {promos.map((promo) => (
            <article
              key={promo.id}
              className="card relative overflow-hidden group flex flex-col"
            >
              <div className="relative w-full aspect-video overflow-hidden rounded-md bg-white min-h-[11rem]">
                <BrandPackImage brand={promo.brand} alt={promo.name} />
              </div>

              <div className="card-body flex flex-col gap-2 flex-1">
                <p className="typography-caption text-gray-500 uppercase tracking-[0.18em]">
                  {brand}
                </p>
                <h2 className="text-sm md:text-base font-semibold text-secondary leading-snug line-clamp-2">
                  {promo.name}
                </h2>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm md:text-base font-black text-primary">
                    {promo.rate.display}
                  </span>
                  <span className="typography-caption text-gray-500">
                    Price may vary by store.
                  </span>
                </div>
                {promo.remarks && (
                  <p className="typography-caption text-gray-500 line-clamp-2">
                    {promo.remarks}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-center pt-1">
                  <button
                    type="button"
                    className="btn-primary w-full !text-sm"
                  >
                    Redeem Now
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

