'use client';

import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Briefcase,
  Check,
  Download,
  Edit2,
  Inbox,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from 'lucide-react';

import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  JOB_STATUSES,
  LOCATION_SCOPE_LABELS,
  type ApplicationStatus,
  type ApplicationView,
  type EmploymentType,
  type JobStatus,
  type JobView,
  type LocationScope,
  type RegionView,
  type StoreOption,
} from '@/lib/careers/types';

import JobForm, { type JobFormValues } from './JobForm';
import JobQrPanel from './JobQrPanel';
import RegionsPanel from './RegionsPanel';

interface CareersAdminProps {
  initialJobs: JobView[];
  initialApplications: ApplicationView[];
  initialRegions: RegionView[];
  initialStores: StoreOption[];
}

const STATUS_STYLES: Record<JobStatus, string> = {
  open: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-700',
  closed: 'bg-red-100 text-red-700',
};

const APPLICATION_STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  reviewing: 'bg-amber-100 text-amber-800',
  interviewing: 'bg-purple-100 text-purple-800',
  rejected: 'bg-gray-100 text-gray-700',
  hired: 'bg-green-100 text-green-800',
};

function emptyJob(): JobFormValues {
  return {
    slug: '',
    title: '',
    department: '',
    location: 'All locations',
    locationScope: 'chain',
    regionIds: [],
    storeIds: [],
    employmentType: 'Full-time' as EmploymentType,
    status: 'draft' as JobStatus,
    payRange: '',
    summary: '',
    responsibilities: [''],
    requirements: [''],
    postedAt: new Date().toISOString().slice(0, 10),
  };
}

function toFormValues(job: JobView): JobFormValues {
  return {
    slug: job.slug,
    title: job.title,
    department: job.department,
    location: job.location,
    locationScope: job.locationScope,
    regionIds: job.regionIds,
    storeIds: job.storeIds,
    employmentType: job.employmentType,
    status: job.status,
    payRange: job.payRange ?? '',
    summary: job.summary,
    responsibilities:
      job.responsibilities.length > 0 ? job.responsibilities : [''],
    requirements: job.requirements.length > 0 ? job.requirements : [''],
    postedAt: job.postedAt,
  };
}

export default function CareersAdmin({
  initialJobs,
  initialApplications,
  initialRegions,
  initialStores,
}: CareersAdminProps) {
  const [tab, setTab] = useState<'jobs' | 'applications' | 'regions'>('jobs');
  const [jobs, setJobs] = useState(initialJobs);
  const [applications, setApplications] = useState(initialApplications);
  const [regions, setRegions] = useState(initialRegions);
  const [stores, setStores] = useState(initialStores);
  const [editing, setEditing] = useState<{
    id: string | null;
    values: JobFormValues;
  } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrJobId, setQrJobId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>(
    'all',
  );
  const [filterJobId, setFilterJobId] = useState<string>('all');
  const [filterRegionId, setFilterRegionId] = useState<string>('all');
  const [filterStoreId, setFilterStoreId] = useState<string>('all');

  const newCount = useMemo(
    () => applications.filter((a) => a.status === 'new').length,
    [applications],
  );

  const filteredApplications = useMemo(() => {
    return applications.filter((a) => {
      if (filterStatus !== 'all' && a.status !== filterStatus) return false;
      if (filterJobId !== 'all' && a.jobId !== filterJobId) return false;
      if (filterStoreId !== 'all') {
        if (a.preferredStoreId !== Number(filterStoreId)) return false;
      }
      if (filterRegionId !== 'all') {
        if (a.preferredStoreRegionId !== filterRegionId) return false;
      }
      return true;
    });
  }, [
    applications,
    filterStatus,
    filterJobId,
    filterRegionId,
    filterStoreId,
  ]);

  async function refreshJobs() {
    const res = await fetch('/api/admin/jobs');
    if (res.ok) setJobs((await res.json()).jobs);
  }

  async function refreshApplications() {
    const res = await fetch('/api/admin/applications');
    if (res.ok) setApplications((await res.json()).applications);
  }

  async function createRegion(name: string): Promise<RegionView | null> {
    setError(null);
    const res = await fetch('/api/admin/regions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? 'Could not create region.');
      return null;
    }
    setRegions((prev) => [...prev, data.region]);
    return data.region as RegionView;
  }

  async function saveJob(values: JobFormValues) {
    setError(null);
    setBusy('save');

    const payload = {
      ...values,
      payRange: values.payRange.trim() || null,
      responsibilities: values.responsibilities.filter((r) => r.trim()),
      requirements: values.requirements.filter((r) => r.trim()),
    };

    const isEdit = Boolean(editing?.id);
    const res = await fetch(
      isEdit ? `/api/admin/jobs/${editing!.id}` : '/api/admin/jobs',
      {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    const data = await res.json().catch(() => ({}));
    setBusy(null);

    if (!res.ok) {
      setError(data.error ?? 'Could not save the job.');
      return;
    }

    setEditing(null);
    await refreshJobs();
  }

  async function setJobStatus(job: JobView, status: JobStatus) {
    setError(null);
    setBusy(job.id);

    const res = await fetch(`/api/admin/jobs/${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...job,
        payRange: job.payRange,
        regionIds: job.regionIds,
        storeIds: job.storeIds,
        locationScope: job.locationScope,
        status,
      }),
    });

    setBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not change the status.');
      return;
    }

    await refreshJobs();
  }

  async function deleteJob(job: JobView) {
    const applicationCount = applications.filter(
      (a) => a.jobId === job.id,
    ).length;

    const warning =
      applicationCount > 0
        ? `Delete "${job.title}"? Its ${applicationCount} application${applicationCount === 1 ? '' : 's'} will be kept but no longer linked to a posting.`
        : `Delete "${job.title}"? This cannot be undone.`;

    if (!window.confirm(warning)) return;

    setError(null);
    setBusy(job.id);
    const res = await fetch(`/api/admin/jobs/${job.id}`, { method: 'DELETE' });
    setBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not delete the job.');
      return;
    }

    await Promise.all([refreshJobs(), refreshApplications()]);
  }

  async function updateApplication(
    application: ApplicationView,
    patch: { status?: ApplicationStatus; notes?: string },
  ) {
    setError(null);
    setBusy(application.id);

    const res = await fetch(`/api/admin/applications/${application.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });

    setBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not update the application.');
      return;
    }

    const data = await res.json();
    setApplications((prev) =>
      prev.map((a) => (a.id === application.id ? data.application : a)),
    );
  }

  async function deleteApplication(application: ApplicationView) {
    if (
      !window.confirm(
        `Delete ${application.name}'s application? Their CV is deleted too and this cannot be undone.`,
      )
    ) {
      return;
    }

    setError(null);
    setBusy(application.id);
    const res = await fetch(`/api/admin/applications/${application.id}`, {
      method: 'DELETE',
    });
    setBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not delete the application.');
      return;
    }

    setApplications((prev) => prev.filter((a) => a.id !== application.id));
  }

  return (
    <div className="p-6 md:p-8">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Careers</h1>
          <p className="mt-1 text-sm text-gray-600">
            Post by region or store, publish, and send QR codes to managers.
          </p>
        </div>

        {tab === 'jobs' && (
          <button
            onClick={() => setEditing({ id: null, values: emptyJob() })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
          >
            <Plus size={18} />
            New job
          </button>
        )}
      </header>

      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200">
        <TabButton
          active={tab === 'jobs'}
          onClick={() => setTab('jobs')}
          icon={<Briefcase size={18} />}
          label={`Jobs (${jobs.length})`}
        />
        <TabButton
          active={tab === 'applications'}
          onClick={() => setTab('applications')}
          icon={<Inbox size={18} />}
          label={`Applications (${applications.length})`}
          badge={newCount > 0 ? `${newCount} new` : undefined}
        />
        <TabButton
          active={tab === 'regions'}
          onClick={() => setTab('regions')}
          icon={<MapPin size={18} />}
          label={`Regions (${regions.length})`}
        />
      </div>

      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {editing && (
        <JobForm
          values={editing.values}
          isEdit={Boolean(editing.id)}
          saving={busy === 'save'}
          regions={regions}
          stores={stores}
          onCreateRegion={createRegion}
          onChange={(values) => setEditing({ ...editing, values })}
          onCancel={() => {
            setEditing(null);
            setError(null);
          }}
          onSubmit={saveJob}
        />
      )}

      {tab === 'regions' && (
        <RegionsPanel
          regions={regions}
          stores={stores}
          onRegionsChange={setRegions}
          onStoresChange={setStores}
          onError={setError}
        />
      )}

      {tab === 'jobs' && !editing && (
        <div className="space-y-4">
          {jobs.length === 0 && (
            <p className="rounded-md border border-gray-200 bg-white p-8 text-center text-gray-500">
              No jobs yet. Create the first posting.
            </p>
          )}

          {jobs.map((job) => {
            const applicationCount = applications.filter(
              (a) => a.jobId === job.id,
            ).length;

            return (
              <article
                key={job.id}
                className="rounded-md border border-gray-200 bg-white p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {job.title}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${STATUS_STYLES[job.status]}`}
                      >
                        {job.status}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                        {LOCATION_SCOPE_LABELS[job.locationScope as LocationScope]}
                      </span>
                      {applicationCount > 0 && (
                        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                          {applicationCount} application
                          {applicationCount === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>

                    <p className="mb-2 max-w-2xl text-sm text-gray-600">
                      {job.summary}
                    </p>

                    <p className="text-xs text-gray-500">
                      {[
                        job.department,
                        job.location,
                        job.employmentType,
                        job.payRange,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                      {' · /careers/'}
                      {job.slug}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {job.status !== 'open' ? (
                      <button
                        type="button"
                        onClick={() => setJobStatus(job, 'open')}
                        disabled={busy === job.id}
                        className="rounded-lg bg-green-600 px-3 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Publish
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setJobStatus(job, 'closed')}
                        disabled={busy === job.id}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Unpublish
                      </button>
                    )}

                    <select
                      value={job.status}
                      onChange={(e) =>
                        setJobStatus(job, e.target.value as JobStatus)
                      }
                      disabled={busy === job.id}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 disabled:opacity-50"
                      aria-label={`Status for ${job.title}`}
                    >
                      {JOB_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        setQrJobId((id) => (id === job.id ? null : job.id))
                      }
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      QR
                    </button>

                    <button
                      onClick={() =>
                        setEditing({ id: job.id, values: toFormValues(job) })
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
                    >
                      <Edit2 size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => deleteJob(job)}
                      disabled={busy === job.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {busy === job.id ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>

                {qrJobId === job.id && (
                  <JobQrPanel job={job} stores={stores} />
                )}
              </article>
            );
          })}
        </div>
      )}

      {tab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 rounded-md border border-gray-200 bg-white p-4">
            <FilterSelect
              label="Status"
              value={filterStatus}
              onChange={(v) =>
                setFilterStatus(v as ApplicationStatus | 'all')
              }
              options={[
                { value: 'all', label: 'All statuses' },
                ...APPLICATION_STATUSES.map((s) => ({
                  value: s,
                  label: APPLICATION_STATUS_LABELS[s],
                })),
              ]}
            />
            <FilterSelect
              label="Job"
              value={filterJobId}
              onChange={setFilterJobId}
              options={[
                { value: 'all', label: 'All jobs' },
                ...jobs.map((j) => ({ value: j.id, label: j.title })),
              ]}
            />
            <FilterSelect
              label="Region"
              value={filterRegionId}
              onChange={(v) => {
                setFilterRegionId(v);
                setFilterStoreId('all');
              }}
              options={[
                { value: 'all', label: 'All regions' },
                ...regions.map((r) => ({ value: r.id, label: r.name })),
              ]}
            />
            <FilterSelect
              label="Store"
              value={filterStoreId}
              onChange={setFilterStoreId}
              options={[
                { value: 'all', label: 'All stores' },
                ...stores
                  .filter(
                    (s) =>
                      filterRegionId === 'all' ||
                      s.regionId === filterRegionId,
                  )
                  .map((s) => ({
                    value: String(s.id),
                    label: s.name,
                  })),
              ]}
            />
          </div>

          {filteredApplications.length === 0 && (
            <p className="rounded-md border border-gray-200 bg-white p-8 text-center text-gray-500">
              No applications match these filters.
            </p>
          )}

          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              busy={busy === application.id}
              onUpdate={updateApplication}
              onDelete={deleteApplication}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-bold transition-colors ${
        active
          ? 'border-b-2 border-primary text-primary'
          : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      {icon}
      {label}
      {badge && (
        <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="text-xs font-semibold text-gray-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ApplicationCard({
  application,
  busy,
  onUpdate,
  onDelete,
}: {
  application: ApplicationView;
  busy: boolean;
  onUpdate: (
    application: ApplicationView,
    patch: { status?: ApplicationStatus; notes?: string },
  ) => Promise<void>;
  onDelete: (application: ApplicationView) => Promise<void>;
}) {
  const [notes, setNotes] = useState(application.notes ?? '');
  const [notesSaved, setNotesSaved] = useState(false);

  const notesDirty = notes !== (application.notes ?? '');

  return (
    <article className="rounded-md border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-gray-900">
              {application.name}
            </h3>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${APPLICATION_STATUS_STYLES[application.status]}`}
            >
              {APPLICATION_STATUS_LABELS[application.status]}
            </span>
          </div>

          <p className="mb-1 text-sm font-semibold text-gray-700">
            {application.jobTitle}
          </p>

          {application.preferredStoreName && (
            <p className="mb-1 text-sm text-gray-600">
              <MapPin size={14} className="mr-1 inline" />
              Preferred store: {application.preferredStoreName}
            </p>
          )}

          <p className="text-sm text-gray-600">
            <a
              href={`mailto:${application.email}`}
              className="text-primary hover:underline"
            >
              {application.email}
            </a>
            {' · '}
            <a href={`tel:${application.phone}`} className="hover:underline">
              {application.phone}
            </a>
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Applied {new Date(application.createdAt).toLocaleString()}
          </p>

          {application.coverLetter && (
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700">
                Cover letter
              </summary>
              <p className="mt-2 whitespace-pre-wrap rounded bg-gray-50 p-3 text-sm text-gray-700">
                {application.coverLetter}
              </p>
            </details>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2">
          <select
            value={application.status}
            onChange={(e) =>
              onUpdate(application, {
                status: e.target.value as ApplicationStatus,
              })
            }
            disabled={busy}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 disabled:opacity-50"
            aria-label={`Status for ${application.name}`}
          >
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {APPLICATION_STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          {application.hasCv ? (
            <a
              href={`/api/admin/applications/${application.id}/cv`}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50"
            >
              <Download size={15} />
              {application.cvFilename ?? 'Download CV'}
            </a>
          ) : (
            <span className="rounded-lg border border-dashed border-gray-200 px-3 py-2 text-center text-xs text-gray-500">
              No CV attached
            </span>
          )}

          <button
            onClick={() => onDelete(application)}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {busy ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Trash2 size={15} />
            )}
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <label
          htmlFor={`notes-${application.id}`}
          className="mb-2 block text-xs font-bold uppercase tracking-wide text-gray-500"
        >
          Internal notes
        </label>
        <textarea
          id={`notes-${application.id}`}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setNotesSaved(false);
          }}
          rows={2}
          maxLength={4000}
          placeholder="Not visible to the applicant."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-primary focus:outline-none"
        />
        {(notesDirty || notesSaved) && (
          <button
            onClick={async () => {
              await onUpdate(application, { notes });
              setNotesSaved(true);
            }}
            disabled={busy || !notesDirty}
            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {notesSaved && !notesDirty ? (
              <>
                <Check size={15} />
                Saved
              </>
            ) : (
              'Save notes'
            )}
          </button>
        )}
      </div>
    </article>
  );
}
