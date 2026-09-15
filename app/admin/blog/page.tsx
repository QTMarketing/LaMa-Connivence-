import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import DatabaseNotice, {
  DB_UNCONFIGURED_MESSAGE,
  DB_UNREACHABLE_MESSAGE,
} from '@/components/admin/DatabaseNotice';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { listBlogs } from '@/lib/blog/queries';
import type { BlogSummary } from '@/lib/blog/types';
import { isDatabaseConfigured } from '@/lib/db/client';
import { ADMIN_SECTIONS } from '@/lib/db/schema';

import BlogAdmin from './BlogAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminBlogPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login?next=/admin/blog');
  if (!canAccessSection(session, 'blog')) redirect('/admin?denied=blog');

  const sections =
    session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions;

  let posts: BlogSummary[] = [];
  let loadError: string | null = null;

  if (!isDatabaseConfigured()) {
    loadError = DB_UNCONFIGURED_MESSAGE;
  } else {
    try {
      posts = await listBlogs(true);
    } catch (error) {
      console.error('[admin-blog] Load failed:', error);
      loadError = DB_UNREACHABLE_MESSAGE;
    }
  }

  return (
    <AdminShell
      sections={sections}
      userName={session.name || session.email}
      activePath="/admin/blog"
      showDashboard={session.role === 'owner'}
    >
      {loadError ? (
        <DatabaseNotice section="The blog" message={loadError} />
      ) : (
        <BlogAdmin initialPosts={posts} />
      )}
    </AdminShell>
  );
}
