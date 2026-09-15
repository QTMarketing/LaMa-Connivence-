import {
  APPLICATION_STATUSES,
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  type ApplicationStatus,
  type EmploymentType,
  type JobStatus,
} from './types';

/** Route segments under /careers that a slug must not shadow. */
const RESERVED_SLUGS = new Set(['apply']);

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export interface JobPayload {
  slug: string;
  title: string;
  department: string;
  location: string;
  employmentType: EmploymentType;
  status: JobStatus;
  payRange: string | null;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string;
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function cleanList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 25);
}

function cleanText(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function parseJobPayload(
  body: unknown,
): ValidationResult<JobPayload> {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Expected a JSON object.' };
  }

  const input = body as Record<string, unknown>;

  const title = cleanText(input.title, 140);
  if (!title) return { ok: false, error: 'A job title is required.' };

  const summary = cleanText(input.summary, 1000);
  if (!summary) return { ok: false, error: 'A summary is required.' };

  const department = cleanText(input.department, 80);
  if (!department) return { ok: false, error: 'A department is required.' };

  const location = cleanText(input.location, 120);
  if (!location) return { ok: false, error: 'A location is required.' };

  const slug = slugify(cleanText(input.slug, 80) || title);
  if (!slug) {
    return {
      ok: false,
      error: 'Could not build a URL from that title. Set the slug manually.',
    };
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false, error: `"${slug}" is a reserved URL. Pick another.` };
  }

  const employmentType = cleanText(input.employmentType, 40);
  if (!EMPLOYMENT_TYPES.includes(employmentType as EmploymentType)) {
    return {
      ok: false,
      error: `Employment type must be one of: ${EMPLOYMENT_TYPES.join(', ')}.`,
    };
  }

  const status = cleanText(input.status, 20) || 'draft';
  if (!JOB_STATUSES.includes(status as JobStatus)) {
    return {
      ok: false,
      error: `Status must be one of: ${JOB_STATUSES.join(', ')}.`,
    };
  }

  const postedAt = cleanText(input.postedAt, 10);
  if (postedAt && !DATE_PATTERN.test(postedAt)) {
    return { ok: false, error: 'Posted date must be YYYY-MM-DD.' };
  }

  return {
    ok: true,
    value: {
      slug,
      title,
      department,
      location,
      employmentType: employmentType as EmploymentType,
      status: status as JobStatus,
      payRange: cleanText(input.payRange, 80) || null,
      summary,
      responsibilities: cleanList(input.responsibilities),
      requirements: cleanList(input.requirements),
      postedAt: postedAt || new Date().toISOString().slice(0, 10),
    },
  };
}

export interface ApplicationUpdatePayload {
  status?: ApplicationStatus;
  notes?: string | null;
}

export function parseApplicationUpdate(
  body: unknown,
): ValidationResult<ApplicationUpdatePayload> {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Expected a JSON object.' };
  }

  const input = body as Record<string, unknown>;
  const update: ApplicationUpdatePayload = {};

  if (input.status !== undefined) {
    const status = cleanText(input.status, 20);
    if (!APPLICATION_STATUSES.includes(status as ApplicationStatus)) {
      return {
        ok: false,
        error: `Status must be one of: ${APPLICATION_STATUSES.join(', ')}.`,
      };
    }
    update.status = status as ApplicationStatus;
  }

  if (input.notes !== undefined) {
    update.notes = cleanText(input.notes, 4000) || null;
  }

  if (Object.keys(update).length === 0) {
    return { ok: false, error: 'Nothing to update.' };
  }

  return { ok: true, value: update };
}
