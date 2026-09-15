import { asc, eq } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import { drinks as drinksTable, type Drink as DrinkRow } from '@/lib/db/schema';
import { drinks as DRINK_SEED, type Drink } from '@/lib/drinksData';

function toDrinkView(row: DrinkRow): Drink {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    category: row.category,
    savings: row.savings,
    expirationDate: row.expirationDate ?? undefined,
    featured: row.featured,
    price: row.price ?? undefined,
  };
}

export async function getAllDrinks(): Promise<Drink[]> {
  return publicRead(
    'getAllDrinks',
    async () => {
      const rows = await getDb()
        .select()
        .from(drinksTable)
        .orderBy(asc(drinksTable.id));
      return rows.map(toDrinkView);
    },
    DRINK_SEED,
  );
}

export async function getDrinksByCategory(
  category: Drink['category'],
): Promise<Drink[]> {
  const all = await getAllDrinks();
  return all.filter((drink) => drink.category === category);
}

export async function getFeaturedDrinks(): Promise<Drink[]> {
  const all = await getAllDrinks();
  return all.filter((drink) => drink.featured);
}

export async function getDrinkById(id: number): Promise<Drink | undefined> {
  return publicRead(
    `getDrinkById(${id})`,
    async () => {
      const [row] = await getDb()
        .select()
        .from(drinksTable)
        .where(eq(drinksTable.id, id))
        .limit(1);
      return row ? toDrinkView(row) : undefined;
    },
    DRINK_SEED.find((drink) => drink.id === id),
  );
}
