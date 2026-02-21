import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStoreById } from '@/lib/storeData';
import { MapPin, Phone, Clock, ArrowLeft } from 'lucide-react';

type StoreDetailPageProps = {
  params: { id: string };
};

export default async function StoreDetailPage({ params }: StoreDetailPageProps) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return notFound();
  }

  const store = getStoreById(id);

  if (!store) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-12 md:py-16 lg:py-20 bg-[#FAFAF5]">
        <div className="container-standard px-4 md:px-6">
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 typography-body-sm font-semibold text-gray-600 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to All Stores
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start bg-white rounded-md shadow-lg overflow-hidden">
            {/* Store Image/Map Placeholder */}
            <div className="relative w-full aspect-video lg:aspect-[4/3] overflow-hidden rounded-md bg-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1556740758-90de374c12ad?w=1920&h=1080&fit=crop"
                alt={store.name}
                fill
                className="object-cover"
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

                  <div className="flex items-start gap-3">
                    <Phone className="text-primary flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className="typography-body font-semibold text-gray-900 mb-1">Phone</p>
                      <p className="typography-body text-gray-700">{store.phone}</p>
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
