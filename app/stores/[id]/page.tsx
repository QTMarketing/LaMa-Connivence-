import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStoreById } from '@/lib/storeData';
import { MapPin, Phone, Clock, ArrowLeft } from 'lucide-react';

type StoreDetailPageProps = {
  // Next 16: params is a Promise. Accepting both shapes matches the pattern
  // already working in app/deals/[id]/page.tsx.
  params: Promise<{ id: string }> | { id: string };
};

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  // Without awaiting, params.id is undefined on the Promise, Number(undefined)
  // is NaN, and EVERY store detail page 404s. That was the bug.
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = Number(resolvedParams.id);
  if (Number.isNaN(id)) {
    return notFound();
  }

  const store = getStoreById(id);

  if (!store) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20 bg-[#FAFAF5]">
        <div className="container-standard px-4 md:px-6">
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 typography-body-sm font-semibold text-gray-600 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to All Stores
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start bg-white rounded-md shadow-lg overflow-hidden">
            {/* A real LaMa storefront. Was a stock Unsplash photo of a clothing
                boutique — mirrors, racks, a salon counter — on a convenience
                store page. Nothing breaks the "real company" read faster than
                imagery that is visibly not your business. */}
            <div className="relative w-full aspect-video lg:aspect-[4/3] overflow-hidden rounded-md bg-gray-200">
              <Image
                src="/photos/lama.jpg"
                alt={`${store.name} storefront`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Store Content */}
            <div className="p-6 md:p-8 flex flex-col justify-between h-full">
              <div>
                <h1 className="typography-h2 text-secondary mb-6">
                  {store.name}
                </h1>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="typography-body font-semibold text-gray-900 mb-1">Address</p>
                      <p className="typography-body text-gray-700">{store.address}</p>
                    </div>
                  </div>

                  {/* Only 8 of 96 phones were recovered (see PLACEHOLDERS.md).
                      A labelled row with nothing after it reads as broken, so
                      say plainly that we do not have it. */}
                  <div className="flex items-start gap-3">
                    <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="typography-body font-semibold text-gray-900 mb-1">Phone</p>
                      {store.phone ? (
                        <p className="typography-body text-gray-700">{store.phone}</p>
                      ) : (
                        <p className="typography-body text-gray-500">Not listed</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-primary flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="typography-body font-semibold text-gray-900 mb-1">Hours</p>
                      <p className="typography-body text-gray-700">{store.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {/* Without the guard this rendered href="tel:" on 88 of 96
                    stores — a dead button on 92% of pages. If we have no
                    number, do not offer the call. */}
                {store.phone && (
                  <a
                    href={`tel:${store.phone.replace(/[^\d+]/g, '')}`}
                    className="btn-secondary flex-1 justify-center"
                  >
                    <Phone size={18} />
                    Call Store
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex-1 justify-center"
                >
                  <MapPin size={18} />
                  Get Directions
                </a>
                <Link
                  href="/stores"
                  className="btn-secondary flex-1 justify-center"
                >
                  Back to Stores
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
