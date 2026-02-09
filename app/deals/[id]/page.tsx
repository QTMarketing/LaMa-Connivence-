'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getDealById, getAllDeals } from '@/lib/dealsData';

interface DealDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DealDetailPage({ params }: DealDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const dealId = parseInt(id);
  const deal = getDealById(dealId);

  useEffect(() => {
    if (!deal) {
      router.push('/deals');
    }
  }, [deal, router]);

  if (!deal) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary mb-4">Deal not found</h1>
          <Link href="/deals" className="text-primary hover:underline">
            Back to Deals
          </Link>
        </div>
      </div>
    );
  }

  // Get all other deals (excluding current deal)
  const relatedDeals = getAllDeals()
    .filter(d => d.id !== deal.id)
    .slice(0, 6);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pb-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <Link 
            href="/deals" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Back to Deals</span>
          </Link>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wide">
                <Tag size={16} />
                {deal.category.replace('-', ' ')}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-secondary mb-4">
              {deal.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mb-6">
              {deal.description}
            </p>

            {/* Deal Info */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-primary" style={{ color: '#FF6B35' }}>
                  {deal.savings}
                </span>
              </div>
              {deal.expirationDate && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} />
                  <span>Expires: {formatDate(deal.expirationDate)}</span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/stores"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-base uppercase transition-all duration-300 hover:scale-105 min-h-[44px]"
                style={{ backgroundColor: '#FF6B35' }}
              >
                <MapPin size={20} />
                Find a Store
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 border-2 border-gray-300 hover:border-primary text-gray-900 hover:text-primary px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105"
              >
                View All Deals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Deal Image */}
      <section className="px-6 mb-12 md:mb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src={deal.image}
              alt={deal.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Deal Details Section */}
      <section className="px-4 sm:px-6 mb-12 md:mb-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gray-50 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-secondary mb-6">
              Deal Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-secondary mb-2">What's Included</h3>
                <p className="text-gray-600 leading-relaxed">
                  {deal.description}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-secondary mb-2">Savings</h3>
                <p className="text-2xl font-black text-primary" style={{ color: '#FF6B35' }}>
                  {deal.savings}
                </p>
              </div>

              {deal.expirationDate && (
                <div>
                  <h3 className="text-xl font-bold text-secondary mb-2">Valid Until</h3>
                  <p className="text-gray-600">
                    {formatDate(deal.expirationDate)}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-secondary mb-2">How to Redeem</h3>
                <p className="text-gray-600 leading-relaxed">
                  Visit any LaMa location and mention this deal at checkout. This offer cannot be combined with other promotions unless otherwise stated.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Deals Section */}
      {relatedDeals.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-secondary mb-4">
                More Deals
              </h2>
              <p className="text-lg text-gray-600">
                Check out these other great deals and promotions.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {relatedDeals.map((relatedDeal, index) => (
                <motion.div
                  key={relatedDeal.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    href={`/deals/${relatedDeal.id}`}
                    className="block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300 group"
                  >
                    <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                      <Image
                        src={relatedDeal.image}
                        alt={relatedDeal.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="text-xl font-black text-secondary mb-2 group-hover:text-primary transition-colors duration-300">
                        {relatedDeal.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {relatedDeal.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <span className="text-base font-bold text-primary" style={{ color: '#FF6B35' }}>
                          {relatedDeal.savings}
                        </span>
                        {relatedDeal.expirationDate && (
                          <span className="text-xs text-gray-500">
                            Expires: {new Date(relatedDeal.expirationDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

