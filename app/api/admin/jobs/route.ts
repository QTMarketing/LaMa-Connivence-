import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { getAllJobs } from '@/lib/careers/queries';
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
    const [created] = await getDb()
      .insert(jobs)
      .values(parsed.value)
      .returning({ id: jobs.id, slug: jobs.slug });

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
