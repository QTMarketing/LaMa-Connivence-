import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { ArrowLeft, Download, Mail, MapPin, Phone } from 'lucide-react';

import AdminShell from '@/components/admin/AdminShell';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { toApplicationView } from '@/lib/careers/queries';
import { APPLICATION_STATUS_LABELS } from '@/lib/careers/types';
import { getDb, isDatabaseConfigured } from '@/lib/db/client';
import { ADMIN_SECTIONS, applications, stores } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;

  const session = await getSession();
  if (!session) {
    redirect(`/admin/login?next=/admin/careers/applications/${id}`);
  }
  if (!canAccessSection(session, 'careers')) redirect('/admin?denied=careers');

  if (!isDatabaseConfigured()) notFound();

  const [row] = await getDb()
    .select({
      application: applications,
      storeName: stores.name,
      storeRegionId: stores.regionId,
    })
    .from(applications)
    .leftJoin(stores, eq(applications.preferredStoreId, stores.id))
    .where(eq(applications.id, id))
    .limit(1);

  if (!row) notFound();

  const application = toApplicationView(
    row.application,
    row.storeName
      ? { name: row.storeName, regionId: row.storeRegionId }
      : null,
  );
  const sections =
    session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions;

  return (
    <AdminShell
      sections={sections}
      userName={session.name || session.email}
      activePath="/admin/careers"
      showDashboard={session.role === 'owner'}
    >
      <div className="p-6 md:p-8">
        <Link
          href="/admin/careers"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          All applications
        </Link>

        <div className="max-w-3xl rounded-md border border-gray-200 bg-white p-6 md:p-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">
            {application.jobTitle}
          </p>
          <h1 className="mb-4 text-3xl font-black text-gray-900">
            {application.name}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
              {APPLICATION_STATUS_LABELS[application.status]}
            </span>
            <span className="text-xs text-gray-500">
              Applied {new Date(application.createdAt).toLocaleString()}
            </span>
          </div>

          <dl className="mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <Mail size={16} className="shrink-0 text-gray-400" />
              <a
                href={`mailto:${application.email}`}
                className="font-semibold text-primary hover:underline"
              >
                {application.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="shrink-0 text-gray-400" />
              <a
                href={`tel:${application.phone}`}
                className="font-semibold text-gray-900 hover:underline"
              >
                {application.phone}
              </a>
            </div>
            {application.preferredStoreName && (
              <div className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0 text-gray-400" />
                <span className="font-semibold text-gray-900">
                  Preferred store: {application.preferredStoreName}
                </span>
              </div>
            )}
          </dl>

          {application.coverLetter && (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                Why they want the job
              </h2>
              <p className="whitespace-pre-wrap rounded bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
                {application.coverLetter}
              </p>
            </div>
          )}

          {application.notes && (
            <div className="mb-6">
              <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                Internal notes
              </h2>
              <p className="whitespace-pre-wrap rounded bg-amber-50 p-4 text-sm leading-relaxed text-gray-700">
                {application.notes}
              </p>
            </div>
          )}

          {application.hasCv ? (
            <a
              href={`/api/admin/applications/${application.id}/cv`}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
            >
              <Download size={18} />
              Download {application.cvFilename ?? 'CV'}
            </a>
          ) : (
            <p className="text-sm text-gray-500">No CV was attached.</p>
          )}

          <p className="mt-6 border-t border-gray-100 pt-4 text-xs text-gray-500">
            Change the status or edit notes from the{' '}
            <Link
              href="/admin/careers"
              className="font-semibold text-primary hover:underline"
            >
              careers list
            </Link>
            .
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
