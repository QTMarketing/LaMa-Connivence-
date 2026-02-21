import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDealById, getAllDeals } from '@/lib/dealsData';
import { ArrowLeft, ShoppingBag, Truck } from 'lucide-react';
import { DealCountdownBadge } from '@/components/DealCountdownBadge';

type DealDetailPageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  // Handle both Promise and direct params (for Next.js compatibility)
  const resolvedParams = params instanceof Promise ? await params : params;
  const id = Number(resolvedParams.id);
  if (Number.isNaN(id)) {
    return notFound();
  }

  const deal = getDealById(id);

  if (!deal) {
    return notFound();
  }

  // Get related deals (same category, excluding current)
  const relatedDeals = getAllDeals()
    .filter(d => d.category === deal.category && d.id !== deal.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <section className="bg-gray-50 border-b border-gray-200 pt-24 pb-4">
        <div className="container-standard px-4 md:px-6">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 typography-body-sm text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Deals
          </Link>
        </div>
      </section>

      {/* Main Product Section */}
      <section className="py-8 md:py-12">
        <div className="container-standard px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Image Gallery - Left Side */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={deal.image}
                  alt={deal.title}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Badge Overlay */}
                {deal.savings && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-md bg-orange-500 text-white typography-body-sm font-bold shadow-lg">
                      {deal.savings}
                    </span>
                  </div>
                )}
                {deal.expirationDate && (
                  <div className="absolute top-4 right-4">
                    <DealCountdownBadge target={deal.expirationDate} />
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative w-full aspect-square rounded-md overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer"
                  >
                    <Image
                      src={deal.image}
                      alt={`${deal.title} view ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div className="flex flex-col">
              {/* Title */}
              <h1 className="typography-h1 text-secondary mb-4">
                {deal.title}
              </h1>

              {/* Description */}
              <p className="typography-body-lg text-gray-700 mb-6 leading-relaxed">
                {deal.description}
              </p>

              {/* Price Section */}
              {(deal.price || deal.originalPrice) && (
                <div className="mb-6 p-6 bg-gray-50 rounded-md">
                  <div className="flex items-baseline gap-4">
                    {typeof deal.price === 'number' && (
                      <span className="text-4xl md:text-5xl font-black text-primary">
                        ${deal.price.toFixed(2)}
                      </span>
                    )}
                    {typeof deal.originalPrice === 'number' && (
                      <div className="flex flex-col">
                        <span className="text-lg text-gray-400 line-through">
                          ${deal.originalPrice.toFixed(2)}
                        </span>
                        <span className="text-sm text-green-600 font-bold mt-1">
                          Save ${(deal.originalPrice - deal.price).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Expiration Date */}
              {deal.expirationDate && (
                <div className="mb-6">
                  <p className="typography-body-sm text-gray-600">
                    Valid until:{' '}
                    <span className="font-semibold text-gray-900">
                      {new Date(deal.expirationDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              )}

              {/* Order Now Button - Primary CTA */}
              <Link
                href="/delivery"
                className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg font-bold mb-4 shadow-lg hover:shadow-xl transition-all"
              >
                <Truck size={24} />
                Order Now
              </Link>

              {/* Secondary Actions */}
              <div className="flex gap-3">
                <Link
                  href="/stores"
                  className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3"
                >
                  <ShoppingBag size={20} />
                  Find a Store
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You May Also Like Section */}
      {relatedDeals.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-standard px-4 md:px-6">
            <h2 className="typography-h2 text-secondary mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedDeals.map((relatedDeal) => (
                <Link
                  key={relatedDeal.id}
                  href={`/deals/${relatedDeal.id}`}
                  className="group"
                >
                  <div className="card overflow-hidden hover:shadow-xl transition-all">
                    <div className="relative w-full aspect-square overflow-hidden rounded-md">
                      <Image
                        src={relatedDeal.image}
                        alt={relatedDeal.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="typography-h4 text-secondary line-clamp-2 mb-2">
                        {relatedDeal.title}
                      </h3>
                      {relatedDeal.price && (
                        <p className="text-xl font-black text-primary">
                          ${relatedDeal.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}


