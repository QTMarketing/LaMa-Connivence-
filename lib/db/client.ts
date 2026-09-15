import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

/**
 * Neon HTTP driver. Works in both the Node and Edge runtimes, so route handlers
 * and server components share one client.
 *
 * The connection string is read lazily. Importing this module during a build
 * where DATABASE_URL is absent should not throw — only actually querying should.
 */
function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add the Neon connection string to .env.local (see ENV_VARIABLES.md).',
    );
  }
  return url;
}

let cached: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (!cached) {
    cached = drizzle(neon(connectionString()), { schema });
  }
  return cached;
}

/** True when a connection string is configured, for graceful fallbacks. */
export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
