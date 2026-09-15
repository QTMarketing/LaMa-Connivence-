import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { apiFailure } from '@/lib/content/adminQueries';
import { parseStore } from '@/lib/content/validation';
import { getDb } from '@/lib/db/client';
import { stores } from '@/lib/db/schema';

type Params = { params: Promise<{ id: string }> };

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) ? id : null;
}

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireSection('stores');
  if (guard instanceof NextResponse) return guard;

  const id = parseId((await params).id);
  if (id === null) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  const parsed = parseStore(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [updated] = await getDb()
      .update(stores)
      .set({ ...parsed.value, updatedAt: new Date() })
      .where(eq(stores.id, id))
      .returning({ id: stores.id });

    if (!updated) {
      return NextResponse.json({ error: 'Store not found.' }, { status: 404 });
    }

    return NextResponse.json({ store: updated });
  } catch (error) {
    return apiFailure(
      'admin-stores-update',
      error,
      'Could not update the store.',
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireSection('stores');
  if (guard instanceof NextResponse) return guard;

  const id = parseId((await params).id);
  if (id === null) {
    return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  }

  try {
    const [deleted] = await getDb()
      .delete(stores)
      .where(eq(stores.id, id))
      .returning({ id: stores.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Store not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiFailure(
      'admin-stores-delete',
      error,
      'Could not delete the store.',
    );
  }
}
