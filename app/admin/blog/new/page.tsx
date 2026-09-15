import { redirect } from 'next/navigation';

import BlogEditor from '@/components/admin/BlogEditor';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { getTaxonomy } from '@/lib/blog/queries';

export const dynamic = 'force-dynamic';

export default async function NewBlogPostPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login?next=/admin/blog/new');
  if (!canAccessSection(session, 'blog')) redirect('/admin?denied=blog');

  const { categories, tags } = await getTaxonomy();

  // The editor is full-screen chrome of its own, so it renders outside AdminShell.
  return <BlogEditor categories={categories} tags={tags} />;
}
