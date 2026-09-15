import { asc } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import { products as productsTable, type Product as ProductRow } from '@/lib/db/schema';
import { products as PRODUCT_SEED, type Product } from '@/lib/productData';

function toProductView(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    category: row.category,
    price: row.price ?? undefined,
    featured: row.featured,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  return publicRead(
    'getAllProducts',
    async () => {
      const rows = await getDb()
        .select()
        .from(productsTable)
        .orderBy(asc(productsTable.id));
      return rows.map(toProductView);
    },
    PRODUCT_SEED,
  );
}

export async function getProductsByCategory(
  category: Product['category'],
): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((product) => product.category === category);
}

export async function getFeaturedProduct(
  category: Product['category'],
): Promise<Product | undefined> {
  const inCategory = await getProductsByCategory(category);
  return inCategory.find((product) => product.featured);
}

/** Admin read: no seed fallback, so the list always reflects the database. */
export function adminListProducts() {
  return getDb().select().from(productsTable).orderBy(asc(productsTable.id));
}
