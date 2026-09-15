import { asc, eq } from 'drizzle-orm';

import { deals as DEAL_SEED, type Deal } from '@/lib/dealsData';
import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import { deals as dealsTable, type Deal as DealRow } from '@/lib/db/schema';

/** numeric columns come back as strings; the Deal view wants numbers. */
function toNumber(value: string | null): number | undefined {
  if (value === null) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function toDealView(row: DealRow): Deal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    category: row.category,
    savings: row.savings,
    expirationDate: row.expirationDate ?? undefined,
    featured: row.featured,
    displayName: row.displayName ?? undefined,
    homepageOrder: row.homepageOrder ?? undefined,
    price: toNumber(row.price),
    originalPrice: toNumber(row.originalPrice),
    stockLeft: row.stockLeft ?? undefined,
  };
}

export async function getAllDeals(): Promise<Deal[]> {
  return publicRead(
    'getAllDeals',
    async () => {
      const rows = await getDb()
        .select()
        .from(dealsTable)
        .orderBy(asc(dealsTable.id));
      return rows.map(toDealView);
    },
    DEAL_SEED,
  );
}

export async function getDealsByCategory(
  category: Deal['category'],
): Promise<Deal[]> {
  const all = await getAllDeals();
  return all.filter((deal) => deal.category === category);
}

export async function getFeaturedDeals(): Promise<Deal[]> {
  const all = await getAllDeals();
  return all.filter((deal) => deal.featured);
}

/**
 * Up to four promo cards for the homepage, in display order, with displayName
 * substituted for the title where one is set.
 */
export async function getHomepagePromos(): Promise<Deal[]> {
  const all = await getAllDeals();

  return all
    .filter((deal) => deal.featured || deal.homepageOrder)
    .sort((a, b) => (a.homepageOrder ?? 999) - (b.homepageOrder ?? 999))
    .slice(0, 4)
    .map((deal) => ({ ...deal, title: deal.displayName || deal.title }));
}

export async function getDealById(id: number): Promise<Deal | undefined> {
  return publicRead(
    `getDealById(${id})`,
    async () => {
      const [row] = await getDb()
        .select()
        .from(dealsTable)
        .where(eq(dealsTable.id, id))
        .limit(1);
      return row ? toDealView(row) : undefined;
    },
    DEAL_SEED.find((deal) => deal.id === id),
  );
}
