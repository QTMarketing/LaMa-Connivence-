import { defineConfig } from 'drizzle-kit';

// Next.js loads .env.local automatically; the drizzle-kit CLI does not.
// process.loadEnvFile is built into Node >= 20.12, so this needs no dependency.
try {
  process.loadEnvFile('.env.local');
} catch {
  // Fine when the file is absent (CI) or the env is already populated.
}

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? '',
  },
  strict: true,
  verbose: true,
});
