import type {
  applicationStatusEnum,
  employmentTypeEnum,
  jobStatusEnum,
  locationScopeEnum,
} from '@/lib/db/schema';

// Derived from the pg enums so the database stays the single source of truth.
// These are type-only imports, so no Drizzle code reaches the client bundle.
export type EmploymentType = (typeof employmentTypeEnum.enumValues)[number];
export type JobStatus = (typeof jobStatusEnum.enumValues)[number];
export type LocationScope = (typeof locationScopeEnum.enumValues)[number];
export type ApplicationStatus =
  (typeof applicationStatusEnum.enumValues)[number];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time',
  'Part-time',
  'Full-time / Part-time',
];

export const JOB_STATUSES: JobStatus[] = ['draft', 'open', 'closed'];

export const LOCATION_SCOPES: LocationScope[] = ['chain', 'region', 'store'];

export const LOCATION_SCOPE_LABELS: Record<LocationScope, string> = {
  chain: 'All locations',
  region: 'Region(s)',
  store: 'Store(s)',
};

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'new',
  'reviewing',
  'interviewing',
  'rejected',
  'hired',
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: 'New',
  reviewing: 'Reviewing',
  interviewing: 'Interviewing',
  rejected: 'Not moving forward',
  hired: 'Hired',
};

export interface RegionView {
  id: string;
  name: string;
  slug: string;
  storeCount?: number;
}

export interface StoreOption {
  id: number;
  name: string;
  address: string;
  city: string | null;
  state: string | null;
  regionId: string | null;
  regionName?: string | null;
}

/**
 * The job shape pages render. A `jobs` row is a superset of this, and the seed
 * array in lib/careersData.ts conforms to it, so both feed the same components.
 */
export interface JobView {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  locationScope: LocationScope;
  regionIds: string[];
  regions: Array<{ id: string; name: string; slug: string }>;
  storeIds: number[];
  stores: Array<{
    id: number;
    name: string;
    address: string;
    regionId: string | null;
  }>;
  employmentType: EmploymentType;
  status: JobStatus;
  /** Null when no range is confirmed. Never render an invented number. */
  payRange: string | null;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string;
}

/** Admin-facing application row. Deliberately omits cvBlobUrl. */
export interface ApplicationView {
  id: string;
  jobId: string | null;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  coverLetter: string | null;
  cvFilename: string | null;
  cvSize: number | null;
  hasCv: boolean;
  preferredStoreId: number | null;
  preferredStoreName: string | null;
  preferredStoreRegionId: string | null;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: string;
}
