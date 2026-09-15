import type { Deal } from '@/lib/dealsData';
import type { Drink } from '@/lib/drinksData';
import type { Product } from '@/lib/productData';
import type { Store } from '@/lib/storeData';

export const DEAL_CATEGORIES: Deal['category'][] = [
  'meal-deals',
  'daily-specials',
  'weekly-promotions',
  'grill-items',
  'mix-and-match',
  'best-value',
  'combo-offers',
];

export const DRINK_CATEGORIES: Drink['category'][] = [
  'buy-2-save',
  'discounted',
  'seasonal',
];

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function optionalText(value: unknown, max: number): string | null {
  const cleaned = text(value, max);
  return cleaned || null;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

/** Accepts a number or a numeric string; null for blank. */
function optionalNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function optionalDate(value: unknown): ValidationResult<string | null> {
  const cleaned = text(value, 10);
  if (!cleaned) return { ok: true, value: null };
  if (!DATE_PATTERN.test(cleaned)) {
    return { ok: false, error: 'Dates must be YYYY-MM-DD.' };
  }
  return { ok: true, value: cleaned };
}

function asObject(body: unknown): Record<string, unknown> | null {
  return typeof body === 'object' && body !== null
    ? (body as Record<string, unknown>)
    : null;
}

// ---------------------------------------------------------------------------

export interface DealInput {
  title: string;
  description: string;
  image: string;
  category: Deal['category'];
  savings: string;
  expirationDate: string | null;
  featured: boolean;
  displayName: string | null;
  homepageOrder: number | null;
  price: string | null;
  originalPrice: string | null;
  stockLeft: number | null;
}

export function parseDeal(body: unknown): ValidationResult<DealInput> {
  const input = asObject(body);
  if (!input) return { ok: false, error: 'Expected a JSON object.' };

  const title = text(input.title, 160);
  if (!title) return { ok: false, error: 'A title is required.' };

  const description = text(input.description, 1000);
  if (!description) return { ok: false, error: 'A description is required.' };

  const image = text(input.image, 500);
  if (!image) return { ok: false, error: 'An image path is required.' };

  const category = text(input.category, 40) as Deal['category'];
  if (!DEAL_CATEGORIES.includes(category)) {
    return {
      ok: false,
      error: `Category must be one of: ${DEAL_CATEGORIES.join(', ')}.`,
    };
  }

  const savings = text(input.savings, 80);
  if (!savings) return { ok: false, error: 'A savings label is required.' };

  const expiration = optionalDate(input.expirationDate);
  if (!expiration.ok) return expiration;

  const price = optionalNumber(input.price);
  const originalPrice = optionalNumber(input.originalPrice);

  if (price !== null && price < 0) {
    return { ok: false, error: 'Price cannot be negative.' };
  }
  if (originalPrice !== null && price !== null && originalPrice < price) {
    return {
      ok: false,
      error: 'The original price must be higher than the sale price.',
    };
  }

  return {
    ok: true,
    value: {
      title,
      description,
      image,
      category,
      savings,
      expirationDate: expiration.value,
      featured: bool(input.featured),
      displayName: optionalText(input.displayName, 120),
      homepageOrder: optionalNumber(input.homepageOrder),
      // numeric columns take strings.
      price: price !== null ? price.toFixed(2) : null,
      originalPrice: originalPrice !== null ? originalPrice.toFixed(2) : null,
      stockLeft: optionalNumber(input.stockLeft),
    },
  };
}

// ---------------------------------------------------------------------------

export interface DrinkInput {
  title: string;
  description: string;
  image: string;
  category: Drink['category'];
  savings: string;
  expirationDate: string | null;
  featured: boolean;
  price: string | null;
}

export function parseDrink(body: unknown): ValidationResult<DrinkInput> {
  const input = asObject(body);
  if (!input) return { ok: false, error: 'Expected a JSON object.' };

  const title = text(input.title, 160);
  if (!title) return { ok: false, error: 'A title is required.' };

  const description = text(input.description, 1000);
  if (!description) return { ok: false, error: 'A description is required.' };

  const image = text(input.image, 500);
  if (!image) return { ok: false, error: 'An image path is required.' };

  const category = text(input.category, 40) as Drink['category'];
  if (!DRINK_CATEGORIES.includes(category)) {
    return {
      ok: false,
      error: `Category must be one of: ${DRINK_CATEGORIES.join(', ')}.`,
    };
  }

  const savings = text(input.savings, 80);
  if (!savings) return { ok: false, error: 'A savings label is required.' };

  const expiration = optionalDate(input.expirationDate);
  if (!expiration.ok) return expiration;

  return {
    ok: true,
    value: {
      title,
      description,
      image,
      category,
      savings,
      expirationDate: expiration.value,
      featured: bool(input.featured),
      price: optionalText(input.price, 40),
    },
  };
}

// ---------------------------------------------------------------------------

export interface StoreInput {
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  hours: string;
  city: string | null;
  state: string | null;
  zip: string | null;
  category: string | null;
  hoursVerified: boolean;
  phoneVerified: boolean;
  addressComplete: boolean;
}

export function parseStore(body: unknown): ValidationResult<StoreInput> {
  const input = asObject(body);
  if (!input) return { ok: false, error: 'Expected a JSON object.' };

  const name = text(input.name, 200);
  if (!name) return { ok: false, error: 'A store name is required.' };

  const address = text(input.address, 300);
  if (!address) return { ok: false, error: 'An address is required.' };

  const lat = optionalNumber(input.lat);
  const lng = optionalNumber(input.lng);

  // A store with no coordinates would silently vanish from the map.
  if (lat === null || lng === null) {
    return { ok: false, error: 'Latitude and longitude are both required.' };
  }
  if (lat < -90 || lat > 90) {
    return { ok: false, error: 'Latitude must be between -90 and 90.' };
  }
  if (lng < -180 || lng > 180) {
    return { ok: false, error: 'Longitude must be between -180 and 180.' };
  }

  return {
    ok: true,
    value: {
      name,
      address,
      lat,
      lng,
      phone: text(input.phone, 40),
      hours: text(input.hours, 200) || 'Call to confirm',
      city: optionalText(input.city, 120),
      state: optionalText(input.state, 40),
      zip: optionalText(input.zip, 20),
      category: optionalText(input.category, 80),
      hoursVerified: bool(input.hoursVerified),
      phoneVerified: bool(input.phoneVerified),
      addressComplete: bool(input.addressComplete, true),
    },
  };
}

// ---------------------------------------------------------------------------

export const PRODUCT_CATEGORIES: Product['category'][] = [
  'hot-beverages',
  'fresh-food',
  'cold-drinks',
  'snacks',
  'grocery',
  'services',
];

export interface ProductInput {
  name: string;
  description: string;
  image: string;
  category: Product['category'];
  price: string | null;
  featured: boolean;
}

export function parseProduct(body: unknown): ValidationResult<ProductInput> {
  const input = asObject(body);
  if (!input) return { ok: false, error: 'Expected a JSON object.' };

  const name = text(input.name, 160);
  if (!name) return { ok: false, error: 'A name is required.' };

  const description = text(input.description, 1000);
  if (!description) return { ok: false, error: 'A description is required.' };

  const image = text(input.image, 500);
  if (!image) return { ok: false, error: 'An image is required.' };

  const category = text(input.category, 40) as Product['category'];
  if (!PRODUCT_CATEGORIES.includes(category)) {
    return {
      ok: false,
      error: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}.`,
    };
  }

  return {
    ok: true,
    value: {
      name,
      description,
      image,
      category,
      price: optionalText(input.price, 40),
      featured: bool(input.featured),
    },
  };
}

export type { Deal, Drink, Product, Store };
