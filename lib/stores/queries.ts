import { asc, eq } from 'drizzle-orm';

import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import { stores as storesTable, type Store as StoreRow } from '@/lib/db/schema';
import { stores as STORE_SEED, type Store } from '@/lib/storeData';

function toStoreView(row: StoreRow): Store {
  return {
    id: row.id,
    name: row.name,
    address: row.address,
    lat: row.lat,
    lng: row.lng,
    phone: row.phone,
    hours: row.hours,
    city: row.city ?? undefined,
    state: row.state ?? undefined,
    zip: row.zip ?? undefined,
    category: row.category ?? undefined,
    hoursVerified: row.hoursVerified,
    phoneVerified: row.phoneVerified,
    addressComplete: row.addressComplete,
  };
}

export async function getAllStores(): Promise<Store[]> {
  return publicRead(
    'getAllStores',
    async () => {
      const rows = await getDb()
        .select()
        .from(storesTable)
        .orderBy(asc(storesTable.state), asc(storesTable.city), asc(storesTable.name));
      return rows.map(toStoreView);
    },
    STORE_SEED,
  );
}

export async function getStoreById(id: number): Promise<Store | undefined> {
  return publicRead(
    `getStoreById(${id})`,
    async () => {
      const [row] = await getDb()
        .select()
        .from(storesTable)
        .where(eq(storesTable.id, id))
        .limit(1);
      return row ? toStoreView(row) : undefined;
    },
    STORE_SEED.find((store) => store.id === id),
  );
}

// Data-quality queries. The store rows came from a 2023 Wayback snapshot, so
// these counts should trend to zero as fields get confirmed.

export async function getStoresNeedingHours(): Promise<Store[]> {
  return (await getAllStores()).filter((store) => !store.hoursVerified);
}

export async function getStoresNeedingAddress(): Promise<Store[]> {
  return (await getAllStores()).filter(
    (store) => store.addressComplete === false,
  );
}

export async function getStoresNeedingPhone(): Promise<Store[]> {
  return (await getAllStores()).filter((store) => !store.phoneVerified);
}
