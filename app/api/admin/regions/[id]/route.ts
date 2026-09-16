import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { parseRegionPayload } from '@/lib/careers/validation';
import { getDb } from '@/lib/db/client';
import { regions, stores } from '@/lib/db/schema';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = parseRegionPayload(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [updated] = await getDb()
      .update(regions)
      .set({ ...parsed.value, updatedAt: new Date() })
      .where(eq(regions.id, id))
      .returning({
        id: regions.id,
        name: regions.name,
        slug: regions.slug,
      });

    if (!updated) {
      return NextResponse.json({ error: 'Region not found.' }, { status: 404 });
    }

    return NextResponse.json({ region: updated });
  } catch (error) {
    if (error instanceof Error && /unique/i.test(error.message)) {
      return NextResponse.json(
        { error: 'Another region already uses that URL.' },
        { status: 409 },
      );
    }
    console.error('[admin-regions] Update failed:', error);
    return NextResponse.json(
      { error: 'Could not update the region.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  try {
    // Stores keep their rows; region_id is set null by FK.
    await getDb()
      .update(stores)
      .set({ regionId: null, updatedAt: new Date() })
      .where(eq(stores.regionId, id));

    const [deleted] = await getDb()
      .delete(regions)
      .where(eq(regions.id, id))
      .returning({ id: regions.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Region not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin-regions] Delete failed:', error);
    return NextResponse.json(
      { error: 'Could not delete the region.' },
      { status: 500 },
    );
  }
}
