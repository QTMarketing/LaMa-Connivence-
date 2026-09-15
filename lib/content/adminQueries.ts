import { asc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { getDb } from '@/lib/db/client';
import { deals, drinks, stores } from '@/lib/db/schema';

/**
 * Direct reads with no seed fallback. Admin lists must reflect the database
 * exactly: showing seed rows when Postgres is unreachable would let an editor
 * change records that do not exist.
 */

export function adminListDeals() {
  return getDb().select().from(deals).orderBy(asc(deals.id));
}

export function adminListDrinks() {
  return getDb().select().from(drinks).orderBy(asc(drinks.id));
}

export function adminListStores() {
  return getDb()
    .select()
    .from(stores)
    .orderBy(asc(stores.state), asc(stores.city), asc(stores.name));
}

/** Logs the real cause and returns a generic message to the client. */
export function apiFailure(label: string, error: unknown, message: string) {
  console.error(`[${label}]`, error);
  return NextResponse.json({ error: message }, { status: 500 });
}
