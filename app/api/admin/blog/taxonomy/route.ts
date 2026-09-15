import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { getTaxonomy } from '@/lib/blog/queries';
import { parseTaxonomyTerm } from '@/lib/blog/validation';
import { apiFailure } from '@/lib/content/adminQueries';
import { getDb } from '@/lib/db/client';
import { categories, tags } from '@/lib/db/schema';

export async function GET() {
  const guard = await requireSection('blog');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json(await getTaxonomy());
  } catch (error) {
    return apiFailure(
      'admin-taxonomy-list',
      error,
      'Could not load categories and tags.',
    );
  }
}

/**
 * Create-on-demand from the editor sidebar. Categories and tags are small
 * enough that a separate management screen would be more clicks than it saves.
 */
export async function POST(request: Request) {
  const guard = await requireSection('blog');
  if (guard instanceof NextResponse) return guard;

  const parsed = parseTaxonomyTerm(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { type, name, slug } = parsed.value;
  const table = type === 'category' ? categories : tags;

  try {
    const db = getDb();
    const [created] = await db
      .insert(table)
      .values({ name, slug })
      .onConflictDoNothing({ target: table.slug })
      .returning({ id: table.id, name: table.name, slug: table.slug });

    if (created) {
      return NextResponse.json({ term: created }, { status: 201 });
    }

    // Same slug already exists: return it so the editor can just select it.
    const { categories: existingCategories, tags: existingTags } =
      await getTaxonomy();
    const existing = (
      type === 'category' ? existingCategories : existingTags
    ).find((term) => term.slug === slug);

    return NextResponse.json({ term: existing });
  } catch (error) {
    return apiFailure('admin-taxonomy-create', error, `Could not add the ${type}.`);
  }
}
