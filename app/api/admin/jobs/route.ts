import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { buildLocationLabel } from '@/lib/careers/location';
import {
  getAllJobs,
  getRegions,
  getStoreOptions,
  syncJobScopeJoins,
} from '@/lib/careers/queries';
import { parseJobPayload } from '@/lib/careers/validation';
import { getDb } from '@/lib/db/client';
import { jobs } from '@/lib/db/schema';

export async function GET() {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ jobs: await getAllJobs() });
  } catch (error) {
    console.error('[admin-jobs] List failed:', error);
    return NextResponse.json(
      { error: 'Could not load jobs.' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

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

    const [created] = await getDb()
      .insert(jobs)
      .values({ ...jobFields, location })
      .returning({ id: jobs.id, slug: jobs.slug });

    await syncJobScopeJoins(
      created.id,
      parsed.value.locationScope,
      regionIds,
      storeIds,
    );

    return NextResponse.json({ job: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && /unique/i.test(error.message)) {
      return NextResponse.json(
        { error: 'A job with that URL already exists. Change the slug.' },
        { status: 409 },
      );
    }
    console.error('[admin-jobs] Create failed:', error);
    return NextResponse.json(
      { error: 'Could not create the job.' },
      { status: 500 },
    );
  }
}
