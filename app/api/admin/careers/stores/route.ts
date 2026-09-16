import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { getStoreOptions } from '@/lib/careers/queries';

export async function GET() {
  const guard = await requireSection('careers');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ stores: await getStoreOptions() });
  } catch (error) {
    console.error('[admin-careers-stores] List failed:', error);
    return NextResponse.json(
      { error: 'Could not load stores.' },
      { status: 500 },
    );
  }
}
