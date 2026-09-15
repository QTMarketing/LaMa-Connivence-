import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { adminListStores, apiFailure } from '@/lib/content/adminQueries';
import { parseStore } from '@/lib/content/validation';
import { getDb } from '@/lib/db/client';
import { stores } from '@/lib/db/schema';

export async function GET() {
  const guard = await requireSection('stores');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ stores: await adminListStores() });
  } catch (error) {
    return apiFailure('admin-stores-list', error, 'Could not load stores.');
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('stores');
  if (guard instanceof NextResponse) return guard;

  const parsed = parseStore(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [created] = await getDb()
      .insert(stores)
      .values(parsed.value)
      .returning({ id: stores.id });
    return NextResponse.json({ store: created }, { status: 201 });
  } catch (error) {
    return apiFailure(
      'admin-stores-create',
      error,
      'Could not create the store.',
    );
  }
}
