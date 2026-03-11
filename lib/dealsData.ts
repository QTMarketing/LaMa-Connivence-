export interface Deal {
  id: number;
  title: string;
  description: string;
  image: string;
  category:
    | 'meal-deals'
    | 'daily-specials'
    | 'weekly-promotions'
    | 'grill-items'
    | 'mix-and-match'
    | 'best-value'
    | 'combo-offers';
  savings: string;
  expirationDate?: string;
  featured?: boolean;
  displayName?: string;
  homepageOrder?: number;
  price?: number;
  originalPrice?: number;
  stockLeft?: number;
}

export const deals: Deal[] = [
  // ── Grill Items – $2.00 each ──────────────────────────────────────────────
  {
    id: 1,
    title: 'Bahama Mama Smoked Sausage',
    description: 'Juicy smoked sausage, hot off the roller grill. A classic convenience store favourite.',
    image: '/photos/hotdog.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    featured: true,
    displayName: 'HOT GRILL DEALS',
    homepageOrder: 1,
    price: 2.00,
  },
  {
    id: 2,
    title: 'Bahama Mama Smoked Cheddar',
    description: 'Smoked sausage loaded with cheddar flavour — a fan favourite at every Lama store.',
    image: '/photos/hotdog.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    featured: true,
    displayName: 'HOT GRILL DEALS',
    homepageOrder: 2,
    price: 2.00,
  },
  {
    id: 3,
    title: 'Crispitos',
    description: 'Crispy seasoned taquitos, hot and ready. A quick snack that hits every time.',
    image: '/photos/food1.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    featured: true,
    displayName: 'HOT GRILL DEALS',
    homepageOrder: 3,
    price: 2.00,
  },
  {
    id: 4,
    title: 'Rollerbites Buffalo Chicken',
    description: 'Spicy buffalo chicken bites with bold flavour in every bite.',
    image: '/photos/food2.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    featured: true,
    displayName: 'HOT GRILL DEALS',
    homepageOrder: 4,
    price: 2.00,
  },
  {
    id: 5,
    title: 'Rollerbites Sausage, Egg & Cheese',
    description: 'A hearty breakfast bite with sausage, egg, and melted cheese — great any time of day.',
    image: '/photos/food3.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    price: 2.00,
  },
  {
    id: 6,
    title: 'Rollerbites Cheeseburger Bites',
    description: 'All the taste of a cheeseburger packed into a hot, handheld bite.',
    image: '/photos/food1.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    price: 2.00,
  },
  {
    id: 7,
    title: 'El Mont Tornado Chicken',
    description: 'Seasoned chicken wrapped in a crispy tornado shell. Hot, fast, and delicious.',
    image: '/photos/food2.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    price: 2.00,
  },
  {
    id: 8,
    title: 'El Mont Pepper Jack Tornado',
    description: 'Spicy pepper jack flavour in a crispy tornado shell — perfect for heat lovers.',
    image: '/photos/food3.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    price: 2.00,
  },
  {
    id: 9,
    title: 'El Mont Tornado Ranch Steak',
    description: 'Tender ranch-seasoned steak in a warm tornado wrap. A fan favourite.',
    image: '/photos/food1.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    price: 2.00,
  },
  {
    id: 10,
    title: 'El Mont Tornado Ranch Steak & Cheese',
    description: 'Ranch steak tornado loaded with melted cheese. A satisfying grab-and-go meal.',
    image: '/photos/food2.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    price: 2.00,
  },
  {
    id: 11,
    title: 'El Mont Tornado Cheese Pepper Jack',
    description: 'Double cheese and pepper jack heat packed into a crunchy tornado roll.',
    image: '/photos/food3.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    price: 2.00,
  },
  {
    id: 12,
    title: 'Eisenberg Beef Frank',
    description: 'A classic all-beef frank, roller grilled to perfection. Simple, satisfying, and only $2.',
    image: '/photos/hotdog.jpg',
    category: 'grill-items',
    savings: 'Just $2',
    price: 2.00,
  },

  // ── Mix & Match ───────────────────────────────────────────────────────────
  {
    id: 13,
    title: 'Grill Items Mix & Match',
    description: 'Pick any 2 grill items for just $3.99. Mix and match your favourites — sausages, tornados, rollerbites, and more.',
    image: '/photos/food2.jpg',
    category: 'mix-and-match',
    savings: '2 for $3.99',
    featured: false,
    price: 3.99,
  },
];

/**
 * Get all deals (for listing pages)
 * Reads from localStorage if available (admin-managed), otherwise uses static array
 */
export const getAllDeals = (): Deal[] => {
  if (typeof window !== 'undefined') {
    const savedDeals = localStorage.getItem('adminAllDeals');
    if (savedDeals) {
      try {
        return JSON.parse(savedDeals);
      } catch {
        return deals;
      }
    }
  }
  return deals;
};

/**
 * Get deals by category (reads from getAllDeals to get admin-managed deals)
 */
export const getDealsByCategory = (category: Deal['category']): Deal[] => {
  return getAllDeals().filter(deal => deal.category === category);
};

/**
 * Get featured deals (reads from getAllDeals to get admin-managed deals)
 */
export const getFeaturedDeals = (): Deal[] => {
  return getAllDeals().filter(deal => deal.featured);
};

/**
 * Get homepage promo cards - returns up to 4 deals in display order
 */
export const getHomepagePromos = (): Deal[] => {
  const allDeals = getAllDeals();
  const featured = allDeals.filter(deal => deal.featured || deal.homepageOrder);

  const sorted = featured.sort((a, b) => {
    const orderA = a.homepageOrder ?? 999;
    const orderB = b.homepageOrder ?? 999;
    return orderA - orderB;
  });

  return sorted.slice(0, 4).map(deal => ({
    ...deal,
    title: deal.displayName || deal.title,
  }));
};

/**
 * Get a single deal by ID (reads from getAllDeals to get admin-managed deals)
 */
export const getDealById = (id: number): Deal | undefined => {
  return getAllDeals().find(deal => deal.id === id);
};
