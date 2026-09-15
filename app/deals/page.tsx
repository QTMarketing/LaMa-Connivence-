import type { Metadata } from 'next';

import { getAllDeals, getFeaturedDeals } from '@/lib/deals/queries';

import DealsClient from './DealsClient';

export const metadata: Metadata = {
  title: 'Deals | LaMa Convenience',
  description:
    'Current grill deals, mix and match offers and promotions at LaMa Convenience.',
};

// Deals change whenever the admin edits them.
export const dynamic = 'force-dynamic';

export default async function DealsPage() {
  const [deals, featured] = await Promise.all([
    getAllDeals(),
    getFeaturedDeals(),
  ]);

  return <DealsClient deals={deals} featured={featured} />;
}
