'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Coffee,
  IceCream,
  Package,
  ShoppingCart,
  UtensilsCrossed,
} from 'lucide-react';

import type {
  ProductCategory,
  ProductCategorySlug,
} from '@/lib/products/categories';
import type { Product } from '@/lib/productData';

// Icons are components, which cannot cross the server/client boundary as props,
// so the server sends the slug and the mapping lives here.
const CATEGORY_ICONS: Record<ProductCategorySlug, typeof Coffee> = {
  'cold-drinks': IceCream,
  'hot-beverages': Coffee,
  'fresh-food': UtensilsCrossed,
  snacks: Package,
  grocery: ShoppingCart,
};

interface Props {
  category: ProductCategory;
  products: Product[];
}

export default function ProductCategoryClient({ category, products }: Props) {
  const Icon = CATEGORY_ICONS[category.slug];
  const featured = products.find((product) => product.featured);
  const rest = products.filter((product) => product !== featured);

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-gray-50 to-white px-6 pb-12 pt-8 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-primary"
          >
            <ArrowLeft size={20} />
            <span>Back to Products</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Icon className="text-primary" size={32} />
            </div>
            <h1 className="mb-4 text-5xl font-black text-secondary md:text-7xl">
              {category.name}
            </h1>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              {category.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {featured && (
        <section className="px-6 pb-12">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
            >
              <div className="md:flex">
                <div className="relative h-64 md:h-auto md:w-1/2">
                  <Image
                    src={featured.image}
                    alt={featured.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-8 md:w-1/2 md:p-12">
                  <span className="mb-2 text-sm font-bold text-primary">
                    FEATURED
                  </span>
                  <h2 className="mb-4 text-4xl font-black text-secondary md:text-5xl">
                    {featured.name}
                  </h2>
                  <p className="mb-6 text-lg leading-relaxed text-gray-600">
                    {featured.description}
                  </p>
                  {featured.price && (
                    <div className="mb-6 text-3xl font-black text-primary">
                      {featured.price}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 text-3xl font-black text-secondary">
            All {category.name}
          </h2>

          {rest.length === 0 ? (
            <p className="text-gray-600">
              Nothing listed in this category right now. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    // Capped so a long category does not leave the last cards
                    // sitting invisible for several seconds.
                    delay: Math.min(index * 0.1, 0.6),
                  }}
                  className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-lg"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold text-secondary transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>
                    <p className="mb-4 text-sm leading-relaxed text-gray-600">
                      {product.description}
                    </p>
                    {product.price && (
                      <div className="text-xl font-black text-primary">
                        {product.price}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
