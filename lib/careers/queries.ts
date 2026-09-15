import { and, desc, eq } from 'drizzle-orm';

import { JOB_SEED } from '@/lib/careersData';
import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import { applications, jobs, type Application, type Job } from '@/lib/db/schema';

import type { ApplicationView, JobView } from './types';

function toJobView(row: Job): JobView {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    employmentType: row.employmentType,
    status: row.status,
    payRange: row.payRange,
    summary: row.summary,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    postedAt: row.postedAt,
  };
}

export function toApplicationView(row: Application): ApplicationView {
  return {
    id: row.id,
    jobId: row.jobId,
    jobTitle: row.jobTitle,
    name: row.name,
    email: row.email,
    phone: row.phone,
    coverLetter: row.coverLetter,
    cvFilename: row.cvFilename,
    cvSize: row.cvSize,
    // The blob URL itself is never exposed; the admin links to the gated route.
    hasCv: Boolean(row.cvBlobUrl),
    status: row.status,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Public reads
// ---------------------------------------------------------------------------

export async function getOpenJobs(): Promise<JobView[]> {
  return publicRead(
    'getOpenJobs',
    async () => {
      const rows = await getDb()
        .select()
        .from(jobs)
        .where(eq(jobs.status, 'open'))
        .orderBy(desc(jobs.postedAt));
      return rows.map(toJobView);
    },
    JOB_SEED.filter((job) => job.status === 'open'),
  );
}

/** Only returns open postings — drafts and closed roles are not public. */
export async function getPublicJobBySlug(
  slug: string,
): Promise<JobView | null> {
  return publicRead(
    `getPublicJobBySlug(${slug})`,
    async () => {
      const [row] = await getDb()
        .select()
        .from(jobs)
        .where(and(eq(jobs.slug, slug), eq(jobs.status, 'open')))
        .limit(1);
      return row ? toJobView(row) : null;
    },
    JOB_SEED.find((job) => job.slug === slug && job.status === 'open') ?? null,
  );
}

// ---------------------------------------------------------------------------
// Admin reads — allowed to throw, so nobody edits stale seed data
// ---------------------------------------------------------------------------

export async function getAllJobs(): Promise<JobView[]> {
  const rows = await getDb().select().from(jobs).orderBy(desc(jobs.createdAt));
  return rows.map(toJobView);
}

export async function getJobById(id: string): Promise<JobView | null> {
  const [row] = await getDb()
    .select()
    .from(jobs)
    .where(eq(jobs.id, id))
    .limit(1);
  return row ? toJobView(row) : null;
}

export async function getApplications(
  jobId?: string,
): Promise<ApplicationView[]> {
  const db = getDb();
  const rows = jobId
    ? await db
        .select()
        .from(applications)
        .where(eq(applications.jobId, jobId))
        .orderBy(desc(applications.createdAt))
    : await db.select().from(applications).orderBy(desc(applications.createdAt));

  return rows.map(toApplicationView);
}
