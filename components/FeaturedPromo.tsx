'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { savingsChipClass } from '@/lib/semantic';

type Promo = {
  id: number | string;
  title: string;
  description: string;
  image: string;
  savings?: string;
};

type Props = {
  current: Promo;
  currentIndex: number;
  items: Promo[];
  onGoTo: (index: number) => void;
  resolveImage?: (src: string) => string;
};

/** Same featured offer card on Deals and Drinks — gray field, photo + copy, orange CTA. */
export default function FeaturedPromo({
  current,
  currentIndex,
  items,
  onGoTo,
  resolveImage,
}: Props) {
  const src = resolveImage ? resolveImage(current.image) : current.image;

  return (
    <section className="bg-white px-4 py-section-xs md:px-6 md:py-section-sm">
      <div className="container-standard">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-lg bg-gray-50 p-6 md:p-8"
        >
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="grid items-center gap-6 md:grid-cols-2 md:gap-8"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md md:aspect-[3/2]">
                  <Image
                    src={src}
                    alt={current.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div>
                  {current.savings && (
                    <span className={`${savingsChipClass(current.savings)} mb-4 w-fit`}>
                      {current.savings}
                    </span>
                  )}
                  <h2 className="typography-h2 mb-4 text-secondary">{current.title}</h2>
                  <p className="typography-body-lg mb-6 text-gray-600">{current.description}</p>
                  <div className="mb-6">
                    <Link href="/stores" className="btn-primary">
                      Find a Store
                    </Link>
                  </div>
                  <p className="typography-caption text-gray-500">
                    *Valid at participating locations through Sunday. While supplies last.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {items.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onGoTo(index)}
                    className="p-1 focus:outline-none"
                    aria-label={`Go to promo ${index + 1}`}
                    aria-current={index === currentIndex ? 'true' : undefined}
                  >
                    <motion.div
                      className={`rounded-full transition-all ${
                        index === currentIndex
                          ? 'h-2.5 w-8 bg-primary'
                          : 'h-2.5 w-2.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                      whileHover={{ scale: 1.3 }}
                      whileTap={{ scale: 0.9 }}
                      animate={{ opacity: index === currentIndex ? 1 : 0.5 }}
                      style={index === currentIndex ? { backgroundColor: '#FF6B35' } : {}}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
