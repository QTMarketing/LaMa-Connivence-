import type { Metadata } from 'next';

import { getAllDrinks, getFeaturedDrinks } from '@/lib/drinks/queries';

import DrinksClient from './DrinksClient';

export const metadata: Metadata = {
  title: 'Drinks | LaMa Convenience',
  description:
    'Fountain drinks, bottled soda and seasonal beverage offers at LaMa Convenience.',
};

export const dynamic = 'force-dynamic';

export default async function DrinksPage() {
  const [drinks, featured] = await Promise.all([
    getAllDrinks(),
    getFeaturedDrinks(),
  ]);

  return <DrinksClient drinks={drinks} featured={featured} />;
}
