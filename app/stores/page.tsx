import type { Metadata } from 'next';

import { getAllStores } from '@/lib/stores/queries';

import StoresClient from './StoresClient';

export const metadata: Metadata = {
  title: 'Store Locator | LaMa Convenience',
  description:
    'Find LaMa Convenience stores across Texas, Louisiana, Oklahoma, Arkansas, Mississippi and New Mexico.',
};

export const dynamic = 'force-dynamic';

export default async function StoresPage() {
  const stores = await getAllStores();

  return <StoresClient stores={stores} />;
}
