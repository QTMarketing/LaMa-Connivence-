import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { buildLocationLabel } from '@/lib/careers/location';
import {
  getJobById,
  getRegions,
  getStoreOptions,
  syncJobScopeJoins,
} from '@/lib/careers/queries';
import { parseJobPayload } from '@/lib/careers/validation';
import { getDb } from '@/lib/db/client';
import { jobs } from '@/lib/db/schema';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  try {
    const job = await getJobById(id);
    if (!job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }
    return NextResponse.json({ job });
  } catch (error) {
    console.error('[admin-jobs] Read failed:', error);
    return NextResponse.json(
      { error: 'Could not load the job.' },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const parsed = parseJobPayload(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const regionRows = await getRegions();
    const storeRows = await getStoreOptions();
    const regionNames = regionRows
      .filter((r) => parsed.value.regionIds.includes(r.id))
      .map((r) => r.name);
    const storeNames = storeRows
      .filter((s) => parsed.value.storeIds.includes(s.id))
      .map((s) => s.name);

    const location = buildLocationLabel({
      locationScope: parsed.value.locationScope,
      regionNames,
      storeNames,
    });

    const { regionIds, storeIds, ...jobFields } = parsed.value;

    const [updated] = await getDb()
      .update(jobs)
      .set({ ...jobFields, location, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning({ id: jobs.id, slug: jobs.slug });

    if (!updated) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }

    await syncJobScopeJoins(
      id,
      parsed.value.locationScope,
      regionIds,
      storeIds,
    );

    return NextResponse.json({ job: updated });
  } catch (error) {
    if (error instanceof Error && /unique/i.test(error.message)) {
      return NextResponse.json(
        { error: 'Another job already uses that URL. Change the slug.' },
        { status: 409 },
      );
    }
    console.error('[admin-jobs] Update failed:', error);
    return NextResponse.json(
      { error: 'Could not update the job.' },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;

  try {
    // Applications keep their job_title snapshot and survive this; the FK is
    // ON DELETE SET NULL. Join rows cascade away with the job.
    const [deleted] = await getDb()
      .delete(jobs)
      .where(eq(jobs.id, id))
      .returning({ id: jobs.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[admin-jobs] Delete failed:', error);
    return NextResponse.json(
      { error: 'Could not delete the job.' },
      { status: 500 },
    );
  }
}
