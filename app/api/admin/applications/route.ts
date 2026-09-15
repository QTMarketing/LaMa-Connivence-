import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { getApplications } from '@/lib/careers/queries';

export async function GET(request: Request) {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  const jobId = new URL(request.url).searchParams.get('jobId') ?? undefined;

  try {
    return NextResponse.json({ applications: await getApplications(jobId) });
  } catch (error) {
    console.error('[admin-applications] List failed:', error);
    return NextResponse.json(
      { error: 'Could not load applications.' },
      { status: 500 },
    );
  }
}
