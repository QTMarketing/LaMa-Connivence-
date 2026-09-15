import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  PRODUCT_CATEGORIES,
  getProductCategory,
} from '@/lib/products/categories';
import { getProductsByCategory } from '@/lib/products/queries';

import ProductCategoryClient from './ProductCategoryClient';

type Params = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return PRODUCT_CATEGORIES.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = getProductCategory((await params).category);
  if (!category) return { title: 'Not found' };

  return {
    title: `${category.name} | LaMa Convenience`,
    description: category.intro,
  };
}

export default async function ProductCategoryPage({ params }: Params) {
  const category = getProductCategory((await params).category);
  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return <ProductCategoryClient category={category} products={products} />;
}
