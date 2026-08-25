/**
 * Named campaign slots. Orange product-ad lock — see ART_DIRECTION.md.
 * Price and type live in CSS — never baked into these files.
 */
export const CAMPAIGN = {
  homeHero: '/campaign/ad-mixmatch-16x9.webp',
  innerBand: '/campaign/inner-grill-21x9.webp',
  innerCoffee: '/campaign/inner-coffee-21x9.webp',
  innerDrinks: '/campaign/inner-drinks-21x9.webp',
  storefront: '/campaign/inner-storefront-21x9.webp',
  services: '/campaign/cut-services-brand.png',
  about: '/campaign/unsplash-about.jpg',
  carwash: '/campaign/unsplash-carwash.jpg',
  rewards: '/campaign/rewards-gift-burst.png',
  rewardsIllustration: '/campaign/rewards-unbox.png',
  sausage: '/campaign/unsplash-sausage.jpg',
  cheddar: '/campaign/unsplash-cheddar.jpg',
  taquito: '/campaign/cut-crispitos.webp',
  tornado: '/campaign/ad-tornado-16x9.webp',
  frank: '/campaign/unsplash-sausage.jpg',
  bites: '/campaign/cut-rollerbites.webp',
  pizza: '/campaign/promo-pizza-solo.png',
  coffee: '/campaign/promo-coffee-brand.png',
  drinks: '/campaign/promo-drinks-solo.png',
  combo: '/campaign/promo-combo-solo.png',
  promoComboHz: '/campaign/promo-combo-hz.webp',
  promoBlobCoffee: '/campaign/promo-blob-coffee.webp',
  promoBlobDrinks: '/campaign/promo-blob-drinks.webp',
  snacks: '/campaign/card-taquito-16x9.webp',
  community: '/campaign/ad-community-16x9.webp',
  // Transparent product cutouts for CategoryBand (Wawa grammar). These are the three
  // products that had NO correct artwork: Crispitos, Rollerbites and the Bahama Mama
  // smoked sausage were all showing a tornado or a hot dog instead.
  cutCrispitos: '/campaign/cut-crispitos.webp',
  cutRollerbites: '/campaign/cut-rollerbites.webp',
  cutSausage: '/campaign/cut-sausage.webp',
  // Category cutouts — the image must follow the page title. The drinks band was
  // showing rollerbites, which is the same mismatch the deal cards had.
  cutDrinks: '/campaign/cut-drinks.webp',
  cutCoffee: '/campaign/cut-coffee.webp',
  cutSnacks: '/campaign/cut-snacks.webp',
  cutGrocery: '/campaign/cut-grocery.webp',
} as const;

/** Admin localStorage still points some sausage cards at the old 16:9 ads, which fill the frame. */
const DEAL_IMAGE_REMAP: Record<string, string> = {
  '/campaign/ad-frank-16x9.webp': '/campaign/unsplash-sausage.jpg',
  '/campaign/ad-sausage-16x9.webp': '/campaign/unsplash-sausage.jpg',
  '/campaign/card-sausage-16x9.webp': '/campaign/unsplash-sausage.jpg',
  '/campaign/grill-frank-16x9.jpg': '/campaign/unsplash-sausage.jpg',
  '/campaign/grill-sausage-16x9.jpg': '/campaign/unsplash-sausage.jpg',
  '/campaign/cut-sausage.webp': '/campaign/unsplash-sausage.jpg',
};

export function resolveDealImage(src: string) {
  return DEAL_IMAGE_REMAP[src] ?? src;
}
