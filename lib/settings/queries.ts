import { asc, eq } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import { faqs, heroSlides, siteSettings } from '@/lib/db/schema';
import { CAMPAIGN } from '@/lib/campaignImages';

import {
  EMPTY_SITE_SETTINGS,
  SITE_SETTING_KEYS,
  rowsToSettings,
  type SiteSettings,
} from './keys';

export interface FaqView {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface HeroSlideView {
  id: number;
  italicText: string;
  headline: string;
  bodyText: string;
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
  priceAmount: string | null;
  priceLabel: string | null;
  sortOrder: number;
  published: boolean;
}

/** Seeded FAQ copy — the same 11 Q&As that used to live inside the rewards page. */
export const FAQ_SEED: Array<{ question: string; answer: string }> = [
  {
    question: 'What is LaMa REWARDS?',
    answer:
      'LaMa REWARDS is our loyalty program inside the LaMa app. Members earn points on eligible purchases, unlock member-only offers, and redeem points for free or discounted items.',
  },
  {
    question: 'How does it work?',
    answer:
      'Create a rewards account, scan your in-app barcode before you pay, and points are added automatically after checkout. Once you have enough points, choose a reward in the app and apply it on your next purchase.',
  },
  {
    question: 'How many points do I earn with each purchase?',
    answer:
      'Most eligible purchases earn 1 point per $1 spent before tax. Some promotions and featured products can award bonus points, and those rates are shown in-app during active campaigns.',
  },
  {
    question: 'How do I redeem points for my member rewards?',
    answer:
      'Open the Rewards section in the app, choose an available reward, and tap redeem. The reward moves to your wallet, where you can apply it at checkout by scanning your member barcode.',
  },
  {
    question: 'Where can I view my available member rewards?',
    answer:
      'You can see current points, redeemed rewards, and expiration details in the app under Rewards and Wallet. Your balance updates shortly after qualifying transactions post.',
  },
  {
    question: 'If I select a reward by mistake, how can I get the points back?',
    answer:
      'If the reward has not been used yet, contact support from the app Help section with the reward name and account email. Our team can review and reverse eligible accidental redemptions.',
  },
  {
    question: 'Is it possible to merge multiple accounts?',
    answer:
      'Yes, in most cases. Reach out to support with both account emails or phone numbers, and we can help consolidate balances after ownership verification.',
  },
  {
    question: 'How long do my LaMa REWARDS points last?',
    answer:
      'Points are valid for 12 months from the date they are earned. Any account activity, such as earning or redeeming, helps keep your rewards status active.',
  },
  {
    question: 'Do I still earn points even if I have not registered my account yet?',
    answer:
      'A fully registered account is required to guarantee points. If you scanned as a guest, register with the same phone number as soon as possible so eligible recent activity can be matched.',
  },
  {
    question: 'How can I confirm my scanned card/barcode registered for my transaction?',
    answer:
      'After scanning, the checkout screen should show your member confirmation. Your receipt and in-app activity history will also display the points earned for that transaction once it processes.',
  },
  {
    question: 'Are there limitations with the use of LaMa REWARDS points?',
    answer:
      'Yes. Rewards generally cannot be exchanged for cash, may exclude restricted products, and usually cannot be combined with certain limited-time offers unless explicitly stated in the reward terms.',
  },
];

export const HERO_SLIDE_SEED: Omit<HeroSlideView, 'id' | 'published'>[] = [
  {
    italicText: 'Open 24/7 · 96 neighborhood locations',
    headline: 'Fuel Up Fast.',
    bodyText:
      'Fresh hot dogs, crispy taquitos, coffee, and cold drinks, ready when you are.',
    image: '/campaign/cluster-hero.webp',
    alt: 'Hot dog, taquitos, fountain drink and coffee from LaMa Convenience',
    ctaText: 'Find a Store',
    ctaLink: '/stores',
    priceAmount: '$3.99',
    priceLabel: 'Mix & Match',
    sortOrder: 0,
  },
  {
    italicText: 'Fresh & Fast',
    headline: 'Coffee Deals',
    bodyText:
      'Start your day right with our premium coffee selection. Freshly brewed daily — get 20% off any coffee drink every Monday.',
    image: CAMPAIGN.coffee,
    alt: 'Premium coffee selection',
    ctaText: 'View Coffee Deals',
    ctaLink: '/deals',
    priceAmount: '20% off',
    priceLabel: 'Mondays',
    sortOrder: 1,
  },
  {
    italicText: 'Hot & Ready',
    headline: 'Fast Food Deals',
    bodyText:
      'Hot dogs, pizza, sandwiches, and more — all made to order. Grab a lunch combo: hot dog or sandwich plus chips and drink.',
    image: CAMPAIGN.homeHero,
    alt: 'Fresh fast food options',
    ctaText: 'View Food Deals',
    ctaLink: '/deals',
    priceAmount: '$6.99',
    priceLabel: 'Lunch combo',
    sortOrder: 2,
  },
];

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<SiteSettings> {
  return publicRead(
    'getSiteSettings',
    async () => {
      const rows = await getDb().select().from(siteSettings);
      return rowsToSettings(rows);
    },
    EMPTY_SITE_SETTINGS,
  );
}

export async function getFaqs(section = 'rewards'): Promise<FaqView[]> {
  return publicRead(
    `getFaqs(${section})`,
    async () => {
      const rows = await getDb()
        .select({
          id: faqs.id,
          question: faqs.question,
          answer: faqs.answer,
          sortOrder: faqs.sortOrder,
        })
        .from(faqs)
        .where(eq(faqs.section, section))
        .orderBy(asc(faqs.sortOrder));
      return rows;
    },
    FAQ_SEED.map((item, index) => ({
      id: `seed-faq-${index}`,
      question: item.question,
      answer: item.answer,
      sortOrder: index,
    })),
  );
}

export async function getPublishedHeroSlides(): Promise<HeroSlideView[]> {
  return publicRead(
    'getPublishedHeroSlides',
    async () => {
      const rows = await getDb()
        .select()
        .from(heroSlides)
        .where(eq(heroSlides.published, true))
        .orderBy(asc(heroSlides.sortOrder));

      return rows.map((row) => ({
        id: row.id,
        italicText: row.italicText,
        headline: row.headline,
        bodyText: row.bodyText,
        image: row.image,
        alt: row.alt,
        ctaText: row.ctaText,
        ctaLink: row.ctaLink,
        priceAmount: row.priceAmount,
        priceLabel: row.priceLabel,
        sortOrder: row.sortOrder,
        published: row.published,
      }));
    },
    HERO_SLIDE_SEED.map((slide, index) => ({
      ...slide,
      id: index + 1,
      published: true,
    })),
  );
}

// ---------------------------------------------------------------------------
// Admin reads
// ---------------------------------------------------------------------------

export async function adminGetSiteSettings(): Promise<SiteSettings> {
  const rows = await getDb().select().from(siteSettings);
  // Ensure every known key exists so the form always has a row to edit.
  const existing = new Set(rows.map((row) => row.key));
  const missing = SITE_SETTING_KEYS.filter((key) => !existing.has(key));

  if (missing.length > 0) {
    await getDb()
      .insert(siteSettings)
      .values(missing.map((key) => ({ key, value: '' })))
      .onConflictDoNothing();
  }

  const fresh = await getDb().select().from(siteSettings);
  return rowsToSettings(fresh);
}

export async function adminListFaqs(section = 'rewards'): Promise<FaqView[]> {
  return getDb()
    .select({
      id: faqs.id,
      question: faqs.question,
      answer: faqs.answer,
      sortOrder: faqs.sortOrder,
    })
    .from(faqs)
    .where(eq(faqs.section, section))
    .orderBy(asc(faqs.sortOrder));
}

export async function adminListHeroSlides(): Promise<HeroSlideView[]> {
  const rows = await getDb()
    .select()
    .from(heroSlides)
    .orderBy(asc(heroSlides.sortOrder));

  return rows.map((row) => ({
    id: row.id,
    italicText: row.italicText,
    headline: row.headline,
    bodyText: row.bodyText,
    image: row.image,
    alt: row.alt,
    ctaText: row.ctaText,
    ctaLink: row.ctaLink,
    priceAmount: row.priceAmount,
    priceLabel: row.priceLabel,
    sortOrder: row.sortOrder,
    published: row.published,
  }));
}
