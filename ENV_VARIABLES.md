# Environment Variables Guide

All values live in `.env.local` for local development and in the Vercel project
settings for preview and production. `.env*` is gitignored.

> **Never paste a real secret into this file.** A live Neon connection string was
> committed here in `aea125f` and had to be rotated. Anything written here is
> permanent in git history. Use placeholders only.

## Required

### `DATABASE_URL`

Neon Postgres connection string. Use the **pooled** endpoint.

```
DATABASE_URL=postgresql://<user>:<password>@<host>-pooler.<region>.aws.neon.tech/<db>?sslmode=require
```

Used by `lib/db/client.ts`.

### `ADMIN_JWT_SECRET`

Signs the `lama_admin_session` cookie. Generate with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

If this is missing, `app/api/admin/login/route.ts` throws and returns a 500 on
every login attempt, and `proxy.ts` denies all `/admin` routes. The admin panel
is completely unreachable without it.

### `NEXT_PUBLIC_BASE_URL`

Base URL used for sitemaps, canonical URLs and absolute links in email.

```
NEXT_PUBLIC_BASE_URL=http://localhost:3001   # local
NEXT_PUBLIC_BASE_URL=https://your-domain.com # production
```

## Required for careers

### `BLOB_READ_WRITE_TOKEN`

Vercel Blob token, used to store uploaded CVs and admin images. Created
automatically when you add a Blob store to the Vercel project; pull it locally
with `vercel env pull .env.local`.

### `RESEND_API_KEY`

Resend API key for job application notifications.

### `CAREERS_NOTIFY_EMAIL`

Where new job applications are sent.

```
CAREERS_NOTIFY_EMAIL=suzee@quicktrackinc.com
```

### `CAREERS_FROM_EMAIL`

Sender address. Must sit on a domain verified in Resend.

```
CAREERS_FROM_EMAIL=careers@quicktrackinc.com
```

## Optional

### `ADMIN_PASSWORD`

Legacy shared-password login. Superseded by per-user accounts in the `users`
table. Kept as a fallback so the panel stays reachable before those accounts are
seeded; remove it once real accounts exist.

### `NODE_ENV`

Set automatically by Next.js. Does not need to be defined.

## Setup

1. Copy the keys above into `.env.local`.
2. Fill in real values.
3. Restart the dev server — Next.js only reads env files at boot.

## Security notes

- Never commit `.env.local`.
- Never paste a real credential into documentation, including this file.
- Rotate immediately if a secret is ever committed; deleting the line does not
  remove it from git history.
- In production, set these through the Vercel dashboard rather than a file.
