export interface Drink {
  id: number;
  title: string;
  description: string;
  image: string;
  category: 'buy-2-save' | 'discounted' | 'seasonal';
  savings: string;
  expirationDate?: string;
  featured?: boolean;
  price?: string;
}

export const drinks: Drink[] = [
  {
    id: 1,
    title: 'Coca-Cola 2-Pack Deal',
    description: 'Buy 2 Coca-Cola bottles and save $1.50. Refreshing and affordable!',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
    category: 'buy-2-save',
    savings: 'Save $1.50',
    featured: true,
    price: '$4.99',
  },
  {
    id: 2,
    title: 'Pepsi Max Bundle',
    description: 'Get 2 Pepsi Max bottles for just $5.99. Double the refreshment!',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
    category: 'buy-2-save',
    savings: 'Save $2.00',
    featured: true,
    price: '$5.99',
  },
  {
    id: 3,
    title: 'Energy Drink Combo',
    description: 'Buy 2 energy drinks, get 20% off. Power up your day!',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&h=600&fit=crop',
    category: 'buy-2-save',
    savings: '20% Off',
    featured: false,
    price: '$6.49',
  },
  {
    id: 4,
    title: 'Summer Lemonade Special',
    description: 'Fresh lemonade now 30% off. Limited time summer offer!',
    image: 'https://images.unsplash.com/photo-1523677011783-c91d1bbe2fdc?w=800&h=600&fit=crop',
    category: 'discounted',
    savings: '30% Off',
    featured: true,
    price: '$2.99',
  },
  {
    id: 5,
    title: 'Iced Tea Discount',
    description: 'All iced tea varieties 25% off. Cool down with savings!',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&h=600&fit=crop',
    category: 'discounted',
    savings: '25% Off',
    featured: false,
    price: '$3.49',
  },
  {
    id: 6,
    title: 'Water Bottle Sale',
    description: 'Premium water bottles 15% off. Stay hydrated!',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&h=600&fit=crop',
    category: 'discounted',
    savings: '15% Off',
    featured: false,
    price: '$1.49',
  },
  {
    id: 7,
    title: 'Holiday Eggnog',
    description: 'Seasonal eggnog available now. Limited edition holiday flavor!',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop',
    category: 'seasonal',
    savings: 'New Arrival',
    featured: true,
    expirationDate: '2024-12-31',
    price: '$3.99',
  },
  {
    id: 8,
    title: 'Pumpkin Spice Latte',
    description: 'Fall favorite is back! Get your pumpkin spice fix.',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800&h=600&fit=crop',
    category: 'seasonal',
    savings: 'Seasonal',
    featured: true,
    expirationDate: '2024-11-30',
    price: '$4.49',
  },
  {
    id: 9,
    title: 'Winter Hot Chocolate',
    description: 'Warm up with our special winter hot chocolate blend.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&h=600&fit=crop',
    category: 'seasonal',
    savings: 'Limited Time',
    featured: false,
    expirationDate: '2024-02-28',
    price: '$3.49',
  },
];

export const getAllDrinks = (): Drink[] => {
  if (typeof window !== 'undefined') {
    const savedDrinks = localStorage.getItem('adminAllDrinks');
    if (savedDrinks) {
      try {
        return JSON.parse(savedDrinks);
      } catch {
        return drinks;
      }
    }
  }
  return drinks;
};

export const getDrinksByCategory = (category: Drink['category']): Drink[] => {
  return getAllDrinks().filter(drink => drink.category === category);
};

export const getFeaturedDrinks = (): Drink[] => {
  return getAllDrinks().filter(drink => drink.featured);
};

export const getDrinkById = (id: number): Drink | undefined => {
  return getAllDrinks().find(drink => drink.id === id);
};
