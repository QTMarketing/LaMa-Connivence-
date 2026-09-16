import { NextResponse } from 'next/server';
import { eq, inArray } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { getRegions } from '@/lib/careers/queries';
import { parseRegionPayload } from '@/lib/careers/validation';
import { getDb } from '@/lib/db/client';
import { regions, stores } from '@/lib/db/schema';

export async function GET() {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ regions: await getRegions() });
  } catch (error) {
    console.error('[admin-regions] List failed:', error);
    return NextResponse.json(
      { error: 'Could not load regions.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const parsed = parseRegionPayload(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [created] = await getDb()
      .insert(regions)
      .values(parsed.value)
      .returning({
        id: regions.id,
        name: regions.name,
        slug: regions.slug,
      });

    return NextResponse.json(
      { region: { ...created, storeCount: 0 } },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && /unique/i.test(error.message)) {
      return NextResponse.json(
        { error: 'A region with that URL already exists.' },
        { status: 409 },
      );
    }
    console.error('[admin-regions] Create failed:', error);
    return NextResponse.json(
      { error: 'Could not create the region.' },
      { status: 500 },
    );
  }
}

/** Bulk-assign stores to a region: { regionId, storeIds } */
export async function PATCH(request: Request) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const body = (await request.json().catch(() => null)) as {
    regionId?: string | null;
    storeIds?: number[];
  } | null;

  if (!body || !Array.isArray(body.storeIds) || body.storeIds.length === 0) {
    return NextResponse.json(
      { error: 'Provide storeIds to assign.' },
      { status: 400 },
    );
  }

  const storeIds = [
    ...new Set(
      body.storeIds.filter((id) => Number.isInteger(id) && id > 0),
    ),
  ];
  if (storeIds.length === 0) {
    return NextResponse.json(
      { error: 'Provide valid storeIds.' },
      { status: 400 },
    );
  }

  const regionId =
    typeof body.regionId === 'string' && body.regionId.trim()
      ? body.regionId.trim()
      : null;

  try {
    if (regionId) {
      const [region] = await getDb()
        .select({ id: regions.id })
        .from(regions)
        .where(eq(regions.id, regionId))
        .limit(1);
      if (!region) {
        return NextResponse.json(
          { error: 'Region not found.' },
          { status: 404 },
        );
      }
    }

    await getDb()
      .update(stores)
      .set({ regionId, updatedAt: new Date() })
      .where(inArray(stores.id, storeIds));

    return NextResponse.json({ success: true, assigned: storeIds.length });
  } catch (error) {
    console.error('[admin-regions] Assign failed:', error);
    return NextResponse.json(
      { error: 'Could not assign stores.' },
      { status: 500 },
    );
  }
}
