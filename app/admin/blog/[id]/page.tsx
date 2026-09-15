import { notFound, redirect } from 'next/navigation';

import BlogEditor from '@/components/admin/BlogEditor';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { getBlogById, getTaxonomy } from '@/lib/blog/queries';

export const dynamic = 'force-dynamic';

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await getSession();
  if (!session) redirect(`/admin/login?next=/admin/blog/${id}`);
  if (!canAccessSection(session, 'blog')) redirect('/admin?denied=blog');

  const [post, taxonomy] = await Promise.all([getBlogById(id), getTaxonomy()]);
  if (!post) notFound();

  return (
    <BlogEditor
      post={post}
      categories={taxonomy.categories}
      tags={taxonomy.tags}
    />
  );
}
