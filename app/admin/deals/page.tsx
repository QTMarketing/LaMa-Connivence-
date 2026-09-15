import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import ContentAdmin from '@/app/admin/ContentAdmin';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { ADMIN_SECTIONS } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export default async function AdminDealsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login?next=/admin/deals');
  if (!canAccessSection(session, 'deals')) redirect('/admin?denied=deals');

  const sections =
    session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions;

  return (
    <AdminShell
      sections={sections}
      userName={session.name || session.email}
      activePath="/admin/deals"
      showDashboard={session.role === 'owner'}
    >
      <ContentAdmin tab="promos" />
    </AdminShell>
  );
}
