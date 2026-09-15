import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import DatabaseNotice, {
  DB_UNCONFIGURED_MESSAGE,
  DB_UNREACHABLE_MESSAGE,
} from '@/components/admin/DatabaseNotice';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { isDatabaseConfigured } from '@/lib/db/client';
import { ADMIN_SECTIONS } from '@/lib/db/schema';
import { EMPTY_SITE_SETTINGS, type SiteSettings } from '@/lib/settings/keys';
import {
  adminListFaqs,
  adminListHeroSlides,
  adminGetSiteSettings,
  type FaqView,
  type HeroSlideView,
} from '@/lib/settings/queries';

import SettingsAdmin from './SettingsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login?next=/admin/settings');
  if (!canAccessSection(session, 'settings')) {
    redirect('/admin?denied=settings');
  }

  const sections =
    session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions;

  let settings: SiteSettings = EMPTY_SITE_SETTINGS;
  let faqs: FaqView[] = [];
  let slides: HeroSlideView[] = [];
  let loadError: string | null = null;

  if (!isDatabaseConfigured()) {
    loadError = DB_UNCONFIGURED_MESSAGE;
  } else {
    try {
      [settings, faqs, slides] = await Promise.all([
        adminGetSiteSettings(),
        adminListFaqs('rewards'),
        adminListHeroSlides(),
      ]);
    } catch (error) {
      console.error('[admin-settings] Load failed:', error);
      loadError = DB_UNREACHABLE_MESSAGE;
    }
  }

  return (
    <AdminShell
      sections={sections}
      userName={session.name || session.email}
      activePath="/admin/settings"
      showDashboard={session.role === 'owner'}
    >
      {loadError ? (
        <DatabaseNotice section="Site settings" message={loadError} />
      ) : (
        <SettingsAdmin
          initialSettings={settings}
          initialFaqs={faqs}
          initialSlides={slides}
        />
      )}
    </AdminShell>
  );
}
