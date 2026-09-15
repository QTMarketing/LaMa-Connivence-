import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { adminListDeals, apiFailure } from '@/lib/content/adminQueries';
import { parseDeal } from '@/lib/content/validation';
import { getDb } from '@/lib/db/client';
import { deals } from '@/lib/db/schema';

export async function GET() {
  const guard = await requireSection('deals');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ deals: await adminListDeals() });
  } catch (error) {
    return apiFailure('admin-deals-list', error, 'Could not load deals.');
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('deals');
  if (guard instanceof NextResponse) return guard;

  const parsed = parseDeal(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [created] = await getDb()
      .insert(deals)
      .values(parsed.value)
      .returning({ id: deals.id });
    return NextResponse.json({ deal: created }, { status: 201 });
  } catch (error) {
    return apiFailure('admin-deals-create', error, 'Could not create the deal.');
  }
}
