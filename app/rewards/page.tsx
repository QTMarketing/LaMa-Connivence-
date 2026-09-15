import { getFaqs } from '@/lib/settings/queries';

import RewardsClient from './RewardsClient';

export const dynamic = 'force-dynamic';

export default async function RewardsPage() {
  const faqs = await getFaqs('rewards');

  return <RewardsClient faqs={faqs} />;
}
