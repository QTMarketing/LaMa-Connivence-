import type { Product } from '@/lib/productData';

/** 'services' has its own /services page, so it is not a /products category. */
export type ProductCategorySlug = Exclude<Product['category'], 'services'>;

export interface ProductCategory {
  slug: ProductCategorySlug;
  name: string;
  /** Shown on the /products index card. */
  blurb: string;
  /** Shown under the heading on the category page. */
  intro: string;
}

/**
 * Single source of truth for the category chrome. The five category pages used
 * to hardcode their own copy, so the index and the page could disagree.
 */
export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    slug: 'cold-drinks',
    name: 'Cold Drinks',
    blurb: 'Refreshing beverages',
    intro:
      'Stay refreshed with our selection of sodas, energy drinks, juices, and more.',
  },
  {
    slug: 'hot-beverages',
    name: 'Hot Beverages',
    blurb: 'Coffee and tea',
    intro:
      'Start your day right with our freshly brewed coffee, specialty drinks, and warm beverages.',
  },
  {
    slug: 'fresh-food',
    name: 'Fresh Food',
    blurb: 'Daily prepared meals',
    intro:
      'Made fresh daily. Hot dogs, pizza, sandwiches, and more prepared with quality ingredients.',
  },
  {
    slug: 'snacks',
    name: 'Snacks',
    blurb: 'Chips, candy, and more',
    intro:
      'From chips to candy, we have all your favorite snacks to satisfy any craving.',
  },
  {
    slug: 'grocery',
    name: 'Grocery',
    blurb: 'Essential items',
    intro: 'Everyday essentials and household items for your convenience needs.',
  },
];

export function getProductCategory(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((category) => category.slug === slug);
}
