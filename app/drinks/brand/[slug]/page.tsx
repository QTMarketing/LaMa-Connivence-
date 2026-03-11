'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { drinkPromos } from '@/lib/drinkPromos';

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
      {/* Hero banner - consistent with other pages */}
      <section className="relative w-full min-h-[320px] sm:h-[380px] md:h-[440px] lg:h-[500px] overflow-hidden pt-24 md:pt-28">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1554866585-cd94860890b7?w=1920&h=1080&fit=crop"
            alt={`${brand} hero`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="relative z-10 h-full w-full flex flex-col items-center justify-center px-4 md:px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-20 h-34 sm:w-24 sm:h-40 md:w-28 md:h-44">
              <Image
                src="/foo/C4.png" // TODO: map each brand to its own image when assets are ready
                alt={brand}
                fill
                className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.4)]"
              />
            </div>
            <h1 className="typography-h1 text-white text-center">{brand}</h1>
            <p className="typography-body-sm text-white/80 text-center max-w-md">
              Current offers on {brand} drinks. Price may vary by store.
            </p>
          </div>
        </div>
      </section>

      {/* Brand promos grid */}
      <section className="section" style={{ backgroundColor: '#FAFAF5' }}>
        <div className="container-standard grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {promos.map((promo) => (
            <article
              key={promo.id}
              className="card relative overflow-hidden group flex flex-col"
            >
              <div className="relative w-full aspect-video overflow-hidden rounded-md">
                <Image
                  src="/foo/C4.png"
                  alt={promo.name}
                  fill
                  className="object-contain bg-[#F5F5F5] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-3 md:p-4 flex flex-col gap-2 flex-1">
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

                <div className="mt-3 flex items-center justify-center gap-2 border-t border-gray-100 pt-3">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center w-full px-4 py-2 rounded-md bg-primary text-white text-xs md:text-sm font-semibold hover:brightness-110 transition-all"
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

