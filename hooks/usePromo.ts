'use client';

import { useState, useEffect, useRef } from 'react';
import { getFeaturedDeals, type Deal } from '@/lib/dealsData';
import { getFeaturedDrinks, type Drink } from '@/lib/drinksData';

// Union type for both Deal and Drink
type PromoItem = Deal | Drink;

// Default fallback promo
const defaultPromo: PromoItem = {
  id: 0,
  title: 'Join LaMa Convenience Rewards',
  description: 'Unlock exclusive member-only deals and earn points on every purchase!',
  image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
  category: 'meal-deals',
  savings: '',
  featured: true,
} as Deal;

// IMPORTANT: For React/Next hydration to work, the initial state **must**
// be the same on the server and the client. We therefore always start with
// an empty list here and load the real promos in a client-side effect.
function getInitialFeaturedPromos(): PromoItem[] {
  return [];
}

export function usePromo(type: 'deals' | 'drinks' = 'deals') {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredDeals, setFeaturedDeals] = useState<PromoItem[]>(getInitialFeaturedPromos());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load featured deals or drinks based on type
    const loadFeaturedPromos = () => {
      if (type === 'drinks') {
        setFeaturedDeals(getFeaturedDrinks() as PromoItem[]);
      } else {
        setFeaturedDeals(getFeaturedDeals() as PromoItem[]);
      }
    };

    loadFeaturedPromos();

    // Listen for storage changes (when admin updates promos)
    const handleStorageChange = () => {
      loadFeaturedPromos();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom events for same-tab updates
    window.addEventListener('promosUpdated', handleStorageChange);
    window.addEventListener('allDealsUpdated', handleStorageChange);
    if (type === 'drinks') {
      window.addEventListener('allDrinksUpdated', handleStorageChange);
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('promosUpdated', handleStorageChange);
      window.removeEventListener('allDealsUpdated', handleStorageChange);
      if (type === 'drinks') {
        window.removeEventListener('allDrinksUpdated', handleStorageChange);
      }
    };
  }, [type]);

  useEffect(() => {
    if (featuredDeals.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredDeals.length);
      }, 5000); // Change every 5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [featuredDeals.length]);

  const goToPromo = (index: number) => {
    setCurrentIndex(index);
    // Reset the interval when user manually navigates
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredDeals.length);
    }, 5000);
  };

  const currentPromo = featuredDeals.length > 0 
    ? (featuredDeals[currentIndex] || featuredDeals[0])
    : defaultPromo;

  return {
    currentPromo,
    currentIndex: featuredDeals.length > 0 ? currentIndex : 0,
    totalPromos: featuredDeals.length > 0 ? featuredDeals.length : 1,
    goToPromo,
    featuredDeals: featuredDeals.length > 0 ? featuredDeals : [defaultPromo],
  };
}
