export interface Deal {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'meal-deals' | 'daily-specials' | 'weekly-promotions' | 'combo-offers';
  savings: string;
  /**
   * Scheduled end date for this deal (used for timers / messaging)
   */
  expirationDate?: string;
  featured?: boolean;
  displayName?: string; // Custom display name for homepage promo cards (for admin editing)
  homepageOrder?: number; // Order position on homepage (1-4 for the 4 promo slots)
  /**
   * Optional pricing meta used on the Deals page
   */
  price?: number;          // Discounted price (e.g. 4.99)
  originalPrice?: number;  // Original / crossed‑out price
  stockLeft?: number;      // Remaining stock hint for urgency
}

export const deals: Deal[] = [
  // Meal Deals
  {
    id: 1,
    title: 'Coffee & Breakfast Combo',
    description: 'Any coffee plus breakfast sandwich for just $5.99. Perfect start to your day!',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    category: 'meal-deals',
    savings: 'Save $2.00',
    expirationDate: '2024-12-31',
    featured: true,
    displayName: 'MEAL DEALS', // Custom name for homepage card
    homepageOrder: 1, // Position 1 (left column)
    price: 5.99,
    originalPrice: 7.99,
    stockLeft: 18,
  },
  {
    id: 2,
    title: 'Lunch Special Combo',
    description: 'Hot dog or sandwich plus chips and drink for $6.99. Great value!',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop',
    category: 'meal-deals',
    savings: 'Save $1.50',
    featured: true,
    displayName: 'MEAL DEALS', // Custom name for homepage card
    homepageOrder: 2, // Position 2 (middle column - wider)
    price: 6.99,
    originalPrice: 8.49,
    stockLeft: 12,
  },
  {
    id: 3,
    title: 'Pizza Slice & Drink',
    description: 'Any pizza slice with any fountain drink for $4.99. Quick and satisfying!',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    category: 'meal-deals',
    savings: 'Save $1.00',
    featured: true,
    displayName: 'MEAL DEALS', // Custom name for homepage card
    homepageOrder: 3, // Position 3 (right column - top)
    price: 4.99,
    originalPrice: 5.99,
    stockLeft: 32,
  },
  
  // Daily Specials
  {
    id: 4,
    title: 'Monday Coffee Special',
    description: 'All coffee drinks 20% off every Monday. Start your week right!',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop',
    category: 'daily-specials',
    savings: '20% Off',
    featured: true,
    displayName: 'MEAL DEALS', // Custom name for homepage card
    homepageOrder: 4, // Position 4 (right column - bottom)
  },
  {
    id: 5,
    title: 'Tuesday Fresh Food Deal',
    description: 'Buy any fresh food item, get a drink for 50% off. Tuesdays only!',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    category: 'daily-specials',
    savings: '50% Off Drink',
    featured: false,
  },
  {
    id: 6,
    title: 'Wednesday Snack Attack',
    description: 'All snacks buy 2 get 1 free. Stock up for the week!',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    category: 'daily-specials',
    savings: 'Buy 2 Get 1',
    featured: false,
  },
  
  // Weekly Promotions
  {
    id: 7,
    title: 'Weekend Fuel Deal',
    description: 'Fill up your tank and get $5 off your in-store purchase. Valid weekends only.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    category: 'weekly-promotions',
    savings: '$5 Off',
    expirationDate: '2024-12-31',
    featured: false,
    price: 0,
    originalPrice: 0,
  },
  {
    id: 8,
    title: 'Family Pack Special',
    description: 'Large pizza, 4 drinks, and snacks for $24.99. Perfect for family outings!',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    category: 'weekly-promotions',
    savings: 'Save $8.00',
    featured: false,
  },
  
  // Combo Offers
  {
    id: 9,
    title: 'Snack Combo Pack',
    description: 'Any 3 snacks plus a drink for $7.99. Mix and match your favorites!',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop',
    category: 'combo-offers',
    savings: 'Save $2.50',
    featured: false,
  },
  {
    id: 10,
    title: 'Drink Duo Deal',
    description: 'Buy any 2 fountain drinks or coffees, get 50% off the second. Every day!',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop',
    category: 'combo-offers',
    savings: '50% Off 2nd',
    featured: false,
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
        return deals; // Fallback to static
      }
    }
  }
  return deals; // Default to static array
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
 * Get homepage promo cards - returns 4 deals in display order
 * This function is designed for admin editing - you can modify homepageOrder
 * and displayName in the deals array to control what shows on homepage
 */
export const getHomepagePromos = (): Deal[] => {
  const allDeals = getAllDeals();
  const featured = allDeals.filter(deal => deal.featured || deal.homepageOrder);
  
  // Sort by homepageOrder if available, otherwise use default order
  const sorted = featured.sort((a, b) => {
    const orderA = a.homepageOrder ?? 999;
    const orderB = b.homepageOrder ?? 999;
    return orderA - orderB;
  });
  
  // Return first 4 deals
  return sorted.slice(0, 4).map(deal => ({
    ...deal,
    // Use displayName if available, otherwise use title
    title: deal.displayName || deal.title,
  }));
};

/**
 * Get a single deal by ID (reads from getAllDeals to get admin-managed deals)
 */
export const getDealById = (id: number): Deal | undefined => {
  return getAllDeals().find(deal => deal.id === id);
};

