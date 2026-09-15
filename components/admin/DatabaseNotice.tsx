import { Database } from 'lucide-react';

/**
 * Shown when an admin section cannot reach Postgres. Admin pages never fall
 * back to seed data, because editing rows that do not exist is worse than an
 * explicit error.
 */
export default function DatabaseNotice({
  section,
  message,
}: {
  section: string;
  message: string;
}) {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-2xl rounded-md border border-amber-200 bg-amber-50 p-6">
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-amber-100">
          <Database size={20} className="text-amber-700" />
        </span>
        <h1 className="mb-2 text-xl font-black text-gray-900">
          {section} is not connected yet
        </h1>
        <p className="mb-4 text-sm leading-relaxed text-gray-700">{message}</p>
        <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-xs text-gray-100">
          {`# .env.local
DATABASE_URL=postgresql://...

npm run db:migrate
npm run db:seed`}
        </pre>
      </div>
    </div>
  );
}

export const DB_UNCONFIGURED_MESSAGE =
  'DATABASE_URL is not set, so there is nothing to edit yet. Add the Neon connection string to .env.local, then run the migrations and the seed.';

export const DB_UNREACHABLE_MESSAGE =
  'Could not reach the database. Check DATABASE_URL and that the migrations have run.';
