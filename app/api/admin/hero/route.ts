import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { apiFailure } from '@/lib/content/adminQueries';
import { getDb } from '@/lib/db/client';
import { heroSlides } from '@/lib/db/schema';
import { adminListHeroSlides } from '@/lib/settings/queries';

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function bool(value: unknown, fallback = true) {
  return typeof value === 'boolean' ? value : fallback;
}

function parseSlide(body: unknown) {
  if (typeof body !== 'object' || body === null) {
    return { ok: false as const, error: 'Expected a JSON object.' };
  }

  const input = body as Record<string, unknown>;
  const italicText = text(input.italicText, 80);
  const headline = text(input.headline, 120);
  const bodyText = text(input.bodyText, 1000);
  const image = text(input.image, 500);
  const alt = text(input.alt, 200);
  const ctaText = text(input.ctaText, 80);
  const ctaLink = text(input.ctaLink, 300);
  const priceAmount = text(input.priceAmount, 40) || null;
  const priceLabel = text(input.priceLabel, 80) || null;

  if (!italicText || !headline || !bodyText || !image || !alt || !ctaText || !ctaLink) {
    return {
      ok: false as const,
      error: 'Every field on a hero slide is required.',
    };
  }

  if (!ctaLink.startsWith('/') && !ctaLink.startsWith('http')) {
    return {
      ok: false as const,
      error: 'CTA link must start with / or http.',
    };
  }

  const sortOrder =
    typeof input.sortOrder === 'number' && Number.isFinite(input.sortOrder)
      ? Math.trunc(input.sortOrder)
      : 0;

  return {
    ok: true as const,
    value: {
      italicText,
      headline,
      bodyText,
      image,
      alt,
      ctaText,
      ctaLink,
      priceAmount,
      priceLabel,
      sortOrder,
      published: bool(input.published, true),
    },
  };
}

export async function GET() {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ slides: await adminListHeroSlides() });
  } catch (error) {
    return apiFailure(
      'admin-hero-list',
      error,
      'Could not load hero slides.',
    );
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  const parsed = parseSlide(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [created] = await getDb()
      .insert(heroSlides)
      .values(parsed.value)
      .returning({ id: heroSlides.id });

    return NextResponse.json({ slide: created }, { status: 201 });
  } catch (error) {
    return apiFailure(
      'admin-hero-create',
      error,
      'Could not create the hero slide.',
    );
  }
}

export async function PUT(request: Request) {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Expected a JSON object.' }, { status: 400 });
  }

  const id = Number((body as Record<string, unknown>).id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'A valid id is required.' }, { status: 400 });
  }

  const parsed = parseSlide(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [updated] = await getDb()
      .update(heroSlides)
      .set({ ...parsed.value, updatedAt: new Date() })
      .where(eq(heroSlides.id, id))
      .returning({ id: heroSlides.id });

    if (!updated) {
      return NextResponse.json({ error: 'Slide not found.' }, { status: 404 });
    }

    return NextResponse.json({ slide: updated });
  } catch (error) {
    return apiFailure(
      'admin-hero-update',
      error,
      'Could not update the hero slide.',
    );
  }
}

export async function DELETE(request: Request) {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: 'A valid id is required.' }, { status: 400 });
  }

  try {
    const [deleted] = await getDb()
      .delete(heroSlides)
      .where(eq(heroSlides.id, id))
      .returning({ id: heroSlides.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Slide not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiFailure(
      'admin-hero-delete',
      error,
      'Could not delete the hero slide.',
    );
  }
}
