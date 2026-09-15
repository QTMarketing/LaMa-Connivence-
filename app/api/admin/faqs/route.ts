import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { apiFailure } from '@/lib/content/adminQueries';
import { getDb } from '@/lib/db/client';
import { faqs } from '@/lib/db/schema';
import { adminListFaqs } from '@/lib/settings/queries';

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function GET(request: Request) {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  const section =
    new URL(request.url).searchParams.get('section') ?? 'rewards';

  try {
    return NextResponse.json({ faqs: await adminListFaqs(section) });
  } catch (error) {
    return apiFailure('admin-faqs-list', error, 'Could not load FAQs.');
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Expected a JSON object.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const question = text(input.question, 300);
  const answer = text(input.answer, 2000);
  const section = text(input.section, 40) || 'rewards';
  const sortOrder =
    typeof input.sortOrder === 'number' && Number.isFinite(input.sortOrder)
      ? Math.trunc(input.sortOrder)
      : 0;

  if (!question) {
    return NextResponse.json({ error: 'A question is required.' }, { status: 400 });
  }
  if (!answer) {
    return NextResponse.json({ error: 'An answer is required.' }, { status: 400 });
  }

  try {
    const [created] = await getDb()
      .insert(faqs)
      .values({ question, answer, section, sortOrder })
      .returning({ id: faqs.id });

    return NextResponse.json({ faq: created }, { status: 201 });
  } catch (error) {
    return apiFailure('admin-faqs-create', error, 'Could not create the FAQ.');
  }
}

export async function PUT(request: Request) {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Expected a JSON object.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const id = text(input.id, 36);
  if (!id) {
    return NextResponse.json({ error: 'An id is required.' }, { status: 400 });
  }

  const question = text(input.question, 300);
  const answer = text(input.answer, 2000);
  const sortOrder =
    typeof input.sortOrder === 'number' && Number.isFinite(input.sortOrder)
      ? Math.trunc(input.sortOrder)
      : 0;

  if (!question || !answer) {
    return NextResponse.json(
      { error: 'Question and answer are both required.' },
      { status: 400 },
    );
  }

  try {
    const [updated] = await getDb()
      .update(faqs)
      .set({ question, answer, sortOrder, updatedAt: new Date() })
      .where(eq(faqs.id, id))
      .returning({ id: faqs.id });

    if (!updated) {
      return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    }

    return NextResponse.json({ faq: updated });
  } catch (error) {
    return apiFailure('admin-faqs-update', error, 'Could not update the FAQ.');
  }
}

export async function DELETE(request: Request) {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'An id is required.' }, { status: 400 });
  }

  try {
    const [deleted] = await getDb()
      .delete(faqs)
      .where(eq(faqs.id, id))
      .returning({ id: faqs.id });

    if (!deleted) {
      return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiFailure('admin-faqs-delete', error, 'Could not delete the FAQ.');
  }
}
