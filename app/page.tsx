import { getPublishedBlogs } from '@/lib/blog/queries';
import { getHomepagePromos } from '@/lib/deals/queries';
import { getPublishedHeroSlides } from '@/lib/settings/queries';

import HomeClient from './HomeClient';

// Promo cards, posts and hero slides are admin-editable.
export const dynamic = 'force-dynamic';

export default async function Home() {
  const [promoSlides, blogCards, heroSlides] = await Promise.all([
    getHomepagePromos(),
    getPublishedBlogs(4),
    getPublishedHeroSlides(),
  ]);

  return (
    <HomeClient
      promoSlides={promoSlides}
      blogCards={blogCards}
      heroSlides={heroSlides}
    />
  );
}
