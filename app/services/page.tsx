import { getProductsByCategory } from '@/lib/products/queries';

import ServicesClient from './ServicesClient';

export default async function ServicesPage() {
  const services = await getProductsByCategory('services');

  return <ServicesClient services={services} />;
}
