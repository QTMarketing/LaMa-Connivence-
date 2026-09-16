import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm';

import { JOB_SEED } from '@/lib/careersData';
import { getDb } from '@/lib/db/client';
import { publicRead } from '@/lib/db/fallback';
import {
  applications,
  jobRegions,
  jobs,
  jobStores,
  regions,
  stores,
  type Application,
  type Job,
} from '@/lib/db/schema';

import type {
  ApplicationView,
  JobView,
  LocationScope,
  RegionView,
  StoreOption,
} from './types';

function toJobView(
  row: Job,
  extras?: {
    regions?: Array<{ id: string; name: string; slug: string }>;
    stores?: Array<{
      id: number;
      name: string;
      address: string;
      regionId: string | null;
    }>;
  },
): JobView {
  const regionList = extras?.regions ?? [];
  const storeList = extras?.stores ?? [];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    department: row.department,
    location: row.location,
    locationScope: row.locationScope ?? 'chain',
    regionIds: regionList.map((r) => r.id),
    regions: regionList,
    storeIds: storeList.map((s) => s.id),
    stores: storeList,
    employmentType: row.employmentType,
    status: row.status,
    payRange: row.payRange,
    summary: row.summary,
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    postedAt: row.postedAt,
  };
}

export function toApplicationView(
  row: Application,
  store?: { name: string; regionId: string | null } | null,
): ApplicationView {
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
    hasCv: Boolean(row.cvBlobUrl),
    preferredStoreId: row.preferredStoreId,
    preferredStoreName: store?.name ?? null,
    preferredStoreRegionId: store?.regionId ?? null,
    status: row.status,
    notes: row.notes,
    createdAt: row.createdAt.toISOString(),
  };
}

async function loadJobExtras(jobIds: string[]) {
  if (jobIds.length === 0) {
    return {
      regionsByJob: new Map<
        string,
        Array<{ id: string; name: string; slug: string }>
      >(),
      storesByJob: new Map<
        string,
        Array<{
          id: number;
          name: string;
          address: string;
          regionId: string | null;
        }>
      >(),
    };
  }

  const db = getDb();

  const regionRows = await db
    .select({
      jobId: jobRegions.jobId,
      id: regions.id,
      name: regions.name,
      slug: regions.slug,
    })
    .from(jobRegions)
    .innerJoin(regions, eq(jobRegions.regionId, regions.id))
    .where(inArray(jobRegions.jobId, jobIds));

  const storeRows = await db
    .select({
      jobId: jobStores.jobId,
      id: stores.id,
      name: stores.name,
      address: stores.address,
      regionId: stores.regionId,
    })
    .from(jobStores)
    .innerJoin(stores, eq(jobStores.storeId, stores.id))
    .where(inArray(jobStores.jobId, jobIds));

  const regionsByJob = new Map<
    string,
    Array<{ id: string; name: string; slug: string }>
  >();
  for (const row of regionRows) {
    const list = regionsByJob.get(row.jobId) ?? [];
    list.push({ id: row.id, name: row.name, slug: row.slug });
    regionsByJob.set(row.jobId, list);
  }

  const storesByJob = new Map<
    string,
    Array<{
      id: number;
      name: string;
      address: string;
      regionId: string | null;
    }>
  >();
  for (const row of storeRows) {
    const list = storesByJob.get(row.jobId) ?? [];
    list.push({
      id: row.id,
      name: row.name,
      address: row.address,
      regionId: row.regionId,
    });
    storesByJob.set(row.jobId, list);
  }

  return { regionsByJob, storesByJob };
}

function attachExtras(
  rows: Job[],
  regionsByJob: Map<string, Array<{ id: string; name: string; slug: string }>>,
  storesByJob: Map<
    string,
    Array<{
      id: number;
      name: string;
      address: string;
      regionId: string | null;
    }>
  >,
): JobView[] {
  return rows.map((row) =>
    toJobView(row, {
      regions: regionsByJob.get(row.id) ?? [],
      stores: storesByJob.get(row.id) ?? [],
    }),
  );
}

function seedJobView(job: (typeof JOB_SEED)[number]): JobView {
  return {
    ...job,
    locationScope: job.locationScope ?? 'chain',
    regionIds: job.regionIds ?? [],
    regions: job.regions ?? [],
    storeIds: job.storeIds ?? [],
    stores: job.stores ?? [],
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
      const { regionsByJob, storesByJob } = await loadJobExtras(
        rows.map((r) => r.id),
      );
      return attachExtras(rows, regionsByJob, storesByJob);
    },
    JOB_SEED.filter((job) => job.status === 'open').map(seedJobView),
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
      if (!row) return null;
      const { regionsByJob, storesByJob } = await loadJobExtras([row.id]);
      return (
        attachExtras([row], regionsByJob, storesByJob)[0] ?? null
      );
    },
    (() => {
      const job = JOB_SEED.find(
        (j) => j.slug === slug && j.status === 'open',
      );
      return job ? seedJobView(job) : null;
    })(),
  );
}

// ---------------------------------------------------------------------------
// Admin reads — allowed to throw, so nobody edits stale seed data
// ---------------------------------------------------------------------------

export async function getAllJobs(): Promise<JobView[]> {
  const rows = await getDb().select().from(jobs).orderBy(desc(jobs.createdAt));
  const { regionsByJob, storesByJob } = await loadJobExtras(
    rows.map((r) => r.id),
  );
  return attachExtras(rows, regionsByJob, storesByJob);
}

export async function getJobById(id: string): Promise<JobView | null> {
  const [row] = await getDb()
    .select()
    .from(jobs)
    .where(eq(jobs.id, id))
    .limit(1);
  if (!row) return null;
  const { regionsByJob, storesByJob } = await loadJobExtras([row.id]);
  return attachExtras([row], regionsByJob, storesByJob)[0] ?? null;
}

export async function getApplications(
  jobId?: string,
): Promise<ApplicationView[]> {
  const db = getDb();
  const rows = jobId
    ? await db
        .select({
          application: applications,
          storeName: stores.name,
          storeRegionId: stores.regionId,
        })
        .from(applications)
        .leftJoin(stores, eq(applications.preferredStoreId, stores.id))
        .where(eq(applications.jobId, jobId))
        .orderBy(desc(applications.createdAt))
    : await db
        .select({
          application: applications,
          storeName: stores.name,
          storeRegionId: stores.regionId,
        })
        .from(applications)
        .leftJoin(stores, eq(applications.preferredStoreId, stores.id))
        .orderBy(desc(applications.createdAt));

  return rows.map((row) =>
    toApplicationView(
      row.application,
      row.storeName
        ? { name: row.storeName, regionId: row.storeRegionId }
        : null,
    ),
  );
}

// ---------------------------------------------------------------------------
// Regions & stores for hiring CRM
// ---------------------------------------------------------------------------

export async function getRegions(): Promise<RegionView[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: regions.id,
      name: regions.name,
      slug: regions.slug,
      storeCount: sql<number>`count(${stores.id})::int`,
    })
    .from(regions)
    .leftJoin(stores, eq(stores.regionId, regions.id))
    .groupBy(regions.id)
    .orderBy(asc(regions.name));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    storeCount: row.storeCount,
  }));
}

export async function getStoreOptions(): Promise<StoreOption[]> {
  const rows = await getDb()
    .select({
      id: stores.id,
      name: stores.name,
      address: stores.address,
      city: stores.city,
      state: stores.state,
      regionId: stores.regionId,
      regionName: regions.name,
    })
    .from(stores)
    .leftJoin(regions, eq(stores.regionId, regions.id))
    .orderBy(asc(stores.name));

  return rows;
}

/**
 * Stores a candidate may pick for a given job (QR / apply form).
 * Chain → all stores; region → stores in those regions; store → listed stores.
 */
export async function getEligibleStoresForJob(
  job: JobView,
): Promise<StoreOption[]> {
  try {
    const all = await getStoreOptions();

    if (job.locationScope === 'chain') return all;

    if (job.locationScope === 'region') {
      const regionSet = new Set(job.regionIds);
      return all.filter((s) => s.regionId && regionSet.has(s.regionId));
    }

    const storeSet = new Set(job.storeIds);
    return all.filter((s) => storeSet.has(s.id));
  } catch (error) {
    console.error('[careers] getEligibleStoresForJob failed:', error);
    return [];
  }
}

export async function isStoreInJobScope(
  job: JobView,
  storeId: number,
): Promise<boolean> {
  if (job.locationScope === 'chain') {
    const [row] = await getDb()
      .select({ id: stores.id })
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1);
    return Boolean(row);
  }

  if (job.locationScope === 'region') {
    if (job.regionIds.length === 0) return false;
    const [row] = await getDb()
      .select({ id: stores.id })
      .from(stores)
      .where(
        and(
          eq(stores.id, storeId),
          inArray(stores.regionId, job.regionIds),
        ),
      )
      .limit(1);
    return Boolean(row);
  }

  return job.storeIds.includes(storeId);
}

export async function replaceJobRegions(
  jobId: string,
  regionIds: string[],
): Promise<void> {
  const db = getDb();
  await db.delete(jobRegions).where(eq(jobRegions.jobId, jobId));
  if (regionIds.length === 0) return;
  await db.insert(jobRegions).values(
    regionIds.map((regionId) => ({ jobId, regionId })),
  );
}

export async function replaceJobStores(
  jobId: string,
  storeIds: number[],
): Promise<void> {
  const db = getDb();
  await db.delete(jobStores).where(eq(jobStores.jobId, jobId));
  if (storeIds.length === 0) return;
  await db.insert(jobStores).values(
    storeIds.map((storeId) => ({ jobId, storeId })),
  );
}

export async function syncJobScopeJoins(
  jobId: string,
  locationScope: LocationScope,
  regionIds: string[],
  storeIds: number[],
): Promise<void> {
  if (locationScope === 'chain') {
    await replaceJobRegions(jobId, []);
    await replaceJobStores(jobId, []);
    return;
  }
  if (locationScope === 'region') {
    await replaceJobRegions(jobId, regionIds);
    await replaceJobStores(jobId, []);
    return;
  }
  await replaceJobRegions(jobId, []);
  await replaceJobStores(jobId, storeIds);
}
