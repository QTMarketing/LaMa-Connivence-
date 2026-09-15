import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { adminListDrinks, apiFailure } from '@/lib/content/adminQueries';
import { parseDrink } from '@/lib/content/validation';
import { getDb } from '@/lib/db/client';
import { drinks } from '@/lib/db/schema';

export async function GET() {
  const guard = await requireSection('drinks');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ drinks: await adminListDrinks() });
  } catch (error) {
    return apiFailure('admin-drinks-list', error, 'Could not load drinks.');
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('drinks');
  if (guard instanceof NextResponse) return guard;

  const parsed = parseDrink(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [created] = await getDb()
      .insert(drinks)
      .values(parsed.value)
      .returning({ id: drinks.id });
    return NextResponse.json({ drink: created }, { status: 201 });
  } catch (error) {
    return apiFailure(
      'admin-drinks-create',
      error,
      'Could not create the drink.',
    );
  }
}
