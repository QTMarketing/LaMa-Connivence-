import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { del } from '@vercel/blob';

import { requireSection } from '@/lib/auth/server';
import { toApplicationView } from '@/lib/careers/queries';
import { parseApplicationUpdate } from '@/lib/careers/validation';
import { getDb } from '@/lib/db/client';
import { applications, stores } from '@/lib/db/schema';

type Params = { params: Promise<{ id: string }> };

async function applicationWithStore(id: string) {
  const [row] = await getDb()
    .select({
      application: applications,
      storeName: stores.name,
      storeRegionId: stores.regionId,
    })
    .from(applications)
    .leftJoin(stores, eq(applications.preferredStoreId, stores.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) return null;

  return toApplicationView(
    row.application,
    row.storeName
      ? { name: row.storeName, regionId: row.storeRegionId }
      : null,
  );
}

export async function GET(_request: Request, { params }: Params) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  try {
    const application = await applicationWithStore(id);
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('[admin-applications] Read failed:', error);
    return NextResponse.json(
      { error: 'Could not load the application.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: Params) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = parseApplicationUpdate(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [updated] = await getDb()
      .update(applications)
      .set({ ...parsed.value, updatedAt: new Date() })
      .where(eq(applications.id, id))
      .returning({ id: applications.id });

    if (!updated) {
      return NextResponse.json(
        { error: 'Application not found.' },
        { status: 404 },
      );
    }

    const application = await applicationWithStore(id);
    return NextResponse.json({ application });
  } catch (error) {
    console.error('[admin-applications] Update failed:', error);
    return NextResponse.json(
      { error: 'Could not update the application.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  try {
    const [deleted] = await getDb()
      .delete(applications)
      .where(eq(applications.id, id))
      .returning({ cvBlobUrl: applications.cvBlobUrl });

    if (!deleted) {
      return NextResponse.json(
        { error: 'Application not found.' },
        { status: 404 },
      );
    }

    // Deleting the row must not leave the CV readable in Blob storage.
    if (deleted.cvBlobUrl && process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await del(deleted.cvBlobUrl);
      } catch (error) {
        console.error(
          `[admin-applications] Row ${id} deleted but its CV remains in Blob:`,
          error,
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin-applications] Delete failed:', error);
    return NextResponse.json(
      { error: 'Could not delete the application.' },
      { status: 500 },
    );
  }
}
