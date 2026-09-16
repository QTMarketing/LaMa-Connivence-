import { redirect } from 'next/navigation';
import { Database } from 'lucide-react';

import AdminShell from '@/components/admin/AdminShell';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { getApplications, getAllJobs, getRegions, getStoreOptions } from '@/lib/careers/queries';
import type { ApplicationView, JobView } from '@/lib/careers/types';
import { isDatabaseConfigured } from '@/lib/db/client';
import { ADMIN_SECTIONS } from '@/lib/db/schema';

import CareersAdmin from './CareersAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminCareersPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login?next=/admin/careers');
  if (!canAccessSection(session, 'careers')) redirect('/admin?denied=careers');

  const sections =
    session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions;

  let jobs: JobView[] = [];
  let applications: ApplicationView[] = [];
  let regions: Awaited<ReturnType<typeof getRegions>> = [];
  let stores: Awaited<ReturnType<typeof getStoreOptions>> = [];
  let loadError: string | null = null;

  if (!isDatabaseConfigured()) {
    loadError =
      'DATABASE_URL is not set, so there is nothing to edit yet. Add the Neon connection string to .env.local, then run the migrations and the seed.';
  } else {
    try {
      [jobs, applications, regions, stores] = await Promise.all([
        getAllJobs(),
        getApplications(),
        getRegions(),
        getStoreOptions(),
      ]);
    } catch (error) {
      console.error('[admin-careers] Load failed:', error);
      loadError =
        'Could not reach the database. Check DATABASE_URL and that the migrations have run.';
    }
  }

  return (
    <AdminShell
      sections={sections}
      userName={session.name || session.email}
      activePath="/admin/careers"
      showDashboard={session.role === 'owner'}
    >
      {loadError ? (
        <div className="p-8">
          <div className="mx-auto max-w-2xl rounded-md border border-amber-200 bg-amber-50 p-6">
            <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-100">
              <Database size={20} className="text-amber-700" />
            </span>
            <h1 className="mb-2 text-xl font-black text-gray-900">
              Careers is not connected yet
            </h1>
            <p className="mb-4 text-sm leading-relaxed text-gray-700">
              {loadError}
            </p>
            <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-xs text-gray-100">
              {`# .env.local
DATABASE_URL=postgresql://...

npm run db:migrate
npm run db:seed`}
            </pre>
          </div>
        </div>
      ) : (
        <CareersAdmin
          initialJobs={jobs}
          initialApplications={applications}
          initialRegions={regions}
          initialStores={stores}
        />
      )}
    </AdminShell>
  );
}
