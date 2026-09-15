import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { getBlogById, setBlogTags } from '@/lib/blog/queries';
import { parseBlog } from '@/lib/blog/validation';
import { apiFailure } from '@/lib/content/adminQueries';
import { getDb } from '@/lib/db/client';
import { blogs } from '@/lib/db/schema';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const guard = await requireSection('blog');
  if (guard instanceof NextResponse) return guard;

  try {
    const post = await getBlogById((await params).id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (error) {
    return apiFailure('admin-blog-read', error, 'Could not load the post.');
  }
}

export async function PUT(request: Request, { params }: Params) {
  const guard = await requireSection('blog');
  if (guard instanceof NextResponse) return guard;

  const id = (await params).id;
  const parsed = parseBlog(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { blog, tagIds } = parsed.value;

  try {
    const db = getDb();
    const [existing] = await db
      .select({ publishedAt: blogs.publishedAt })
      .from(blogs)
      .where(eq(blogs.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    // Stamped on the first publish and never moved afterwards, so editing a
    // live post does not shuffle it back to the top of the feed.
    const publishedAt =
      blog.status === 'published'
        ? (existing.publishedAt ?? new Date())
        : existing.publishedAt;

    await db
      .update(blogs)
      .set({ ...blog, publishedAt, updatedAt: new Date() })
      .where(eq(blogs.id, id));

    await setBlogTags(id, tagIds);

    return NextResponse.json({ post: { id } });
  } catch (error) {
    if (error instanceof Error && error.message.includes('blogs_slug_unique')) {
      return NextResponse.json(
        { error: 'Another post already uses that URL slug.' },
        { status: 409 },
      );
    }
    return apiFailure('admin-blog-update', error, 'Could not save the post.');
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const guard = await requireSection('blog');
  if (guard instanceof NextResponse) return guard;

  try {
    const [deleted] = await getDb()
      .delete(blogs)
      .where(eq(blogs.id, (await params).id))
      .returning({ id: blogs.id });

    if (!deleted) {
      return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiFailure('admin-blog-delete', error, 'Could not delete the post.');
  }
}
