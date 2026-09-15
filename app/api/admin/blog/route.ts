import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { listBlogs, setBlogTags } from '@/lib/blog/queries';
import { parseBlog } from '@/lib/blog/validation';
import { apiFailure } from '@/lib/content/adminQueries';
import { getDb } from '@/lib/db/client';
import { blogs } from '@/lib/db/schema';

export async function GET(request: Request) {
  const guard = await requireSection('blog');
  if (guard instanceof NextResponse) return guard;

  const includeTrash =
    new URL(request.url).searchParams.get('trash') === 'true';

  try {
    return NextResponse.json({ posts: await listBlogs(includeTrash) });
  } catch (error) {
    return apiFailure('admin-blog-list', error, 'Could not load posts.');
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('blog');
  if (guard instanceof NextResponse) return guard;

  const parsed = parseBlog(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { blog, tagIds } = parsed.value;

  try {
    const [created] = await getDb()
      .insert(blogs)
      .values({
        ...blog,
        publishedAt: blog.status === 'published' ? new Date() : null,
      })
      .returning({ id: blogs.id });

    await setBlogTags(created.id, tagIds);

    return NextResponse.json({ post: created }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('blogs_slug_unique')) {
      return NextResponse.json(
        { error: 'Another post already uses that URL slug.' },
        { status: 409 },
      );
    }
    return apiFailure('admin-blog-create', error, 'Could not create the post.');
  }
}
