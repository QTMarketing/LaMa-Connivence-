import { isDatabaseConfigured } from './client';

/**
 * Wraps a public read so the site keeps rendering when Postgres is
 * unconfigured or unreachable, serving the hardcoded seed data instead.
 *
 * Public reads degrade; admin reads deliberately do not. An editor seeing
 * stale seed rows would edit records that do not exist, so admin paths call the
 * database directly and are allowed to throw.
 */
export async function publicRead<T>(
  label: string,
  query: () => Promise<T>,
  seedFallback: T,
): Promise<T> {
  if (!isDatabaseConfigured()) {
    return seedFallback;
  }

  try {
    return await query();
  } catch (error) {
    console.error(
      `[db] ${label} failed; serving seed data. Fix the database before this hides real edits.`,
      error,
    );
    return seedFallback;
  }
}
