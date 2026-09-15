'use client';

import { useEffect, useRef, useState } from 'react';

import type { Deal } from '@/lib/dealsData';
import type { Drink } from '@/lib/drinksData';

type PromoItem = Deal | Drink;

/** Shown only when a page has no featured items at all. */
const defaultPromo: PromoItem = {
  id: 0,
  title: 'Join LaMa Convenience Rewards',
  description:
    'Unlock exclusive member-only deals and earn points on every purchase!',
  image: '/campaign/ad-mixmatch-16x9.webp',
  category: 'meal-deals',
  savings: '',
  featured: true,
} as Deal;

const ROTATE_MS = 5000;

/**
 * Rotating promo carousel.
 *
 * Takes the featured items as an argument rather than fetching them: the data
 * now comes from Postgres through a server component. The old version read
 * localStorage and listened for 'allDealsUpdated' events, which is what let the
 * admin and the public site disagree about what was published.
 */
export function usePromo(featured: PromoItem[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = featured.length;

  // Keep the index valid if the list shrinks between renders.
  useEffect(() => {
    if (currentIndex >= total && total > 0) setCurrentIndex(0);
  }, [currentIndex, total]);

  useEffect(() => {
    if (total <= 1) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, ROTATE_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total]);

  const goToPromo = (index: number) => {
    setCurrentIndex(index);

    // Restart the timer so a manual jump gets a full interval before moving on.
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (total > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % total);
      }, ROTATE_MS);
    }
  };

  const currentPromo =
    total > 0 ? (featured[currentIndex] ?? featured[0]) : defaultPromo;

  return {
    currentPromo,
    currentIndex: total > 0 ? currentIndex : 0,
    totalPromos: total,
    goToPromo,
    featuredDeals: featured,
  };
}
