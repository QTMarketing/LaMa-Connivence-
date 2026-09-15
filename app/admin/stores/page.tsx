import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import ContentAdmin from '@/app/admin/ContentAdmin';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { ADMIN_SECTIONS } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function AdminStoresPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login?next=/admin/stores');
  if (!canAccessSection(session, 'stores')) redirect('/admin?denied=stores');

  const sections =
    session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions;

  return (
    <AdminShell
      sections={sections}
      userName={session.name || session.email}
      activePath="/admin/stores"
      showDashboard={session.role === 'owner'}
    >
      <ContentAdmin tab="stores" />
    </AdminShell>
  );
}
