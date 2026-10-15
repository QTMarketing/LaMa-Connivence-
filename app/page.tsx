import { getPublishedBlogs } from '@/lib/blog/queries';
import { getHomepagePromos } from '@/lib/deals/queries';
import { getPublishedHeroSlides } from '@/lib/settings/queries';
import { getOpenJobsResult } from '@/lib/careers/queries';

import HomeClient from './HomeClient';

// Promo cards, posts and hero slides are admin-editable.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [promoSlides, blogCards, heroSlides, hiring] = await Promise.all([
    getHomepagePromos(),
    getPublishedBlogs(4),
    getPublishedHeroSlides(),
    getOpenJobsResult(),
  ]);

  return (
    <HomeClient
      promoSlides={promoSlides}
      blogCards={blogCards}
      heroSlides={heroSlides}
      hiring={hiring}
      hiringQaReadOnly={process.env.NODE_ENV === 'development' && process.env.HIRING_QA_READ_ONLY === '1'}
    />
  );
}
