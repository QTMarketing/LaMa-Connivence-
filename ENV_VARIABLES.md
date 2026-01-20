# Environment Variables Guide

This document lists all environment variables needed for the LaMa CMS application.

## Required Variables

### `DATABASE_URL`
**Type:** String  
**Required:** Yes  
**Description:** PostgreSQL connection string for Neon database  
**Example:**
```
DATABASE_URL=postgresql://neondb_owner:npg_dnoia7pm8qVT@ep-aged-forest-ahxsf2ub-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### `NEXT_PUBLIC_BASE_URL`
**Type:** String  
**Required:** Yes  
**Description:** Base URL of your application (used in sitemaps, SEO metadata, canonical URLs)  
**Local Development:**
```
NEXT_PUBLIC_BASE_URL=http://localhost:3002
```
**Production:**
```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Optional Variables

### `ADMIN_PASSWORD`
**Type:** String  
**Required:** No (currently hardcoded)  
**Description:** Admin password for CMS access  
**Note:** Currently hardcoded in `app/admin/login/page.tsx`. Recommended to move to environment variable for better security.  
**Example:**
```
ADMIN_PASSWORD=your_secure_password_here
```

### `NODE_ENV`
**Type:** String  
**Required:** No (automatically set by Next.js)  
**Description:** Node.js environment mode  
**Values:** `development` | `production` | `test`  
**Note:** Usually set automatically by Next.js based on the command you run (`npm run dev` sets it to `development`, `npm run build` sets it to `production`)

## Future/Planned Variables

### Cloudinary Image Hosting (Optional)
If you plan to integrate Cloudinary for image hosting:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Setup Instructions

1. **Create `.env.local` file** in the root directory:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Fill in your values** in `.env.local`

3. **Restart your development server** after making changes:
   ```bash
   npm run dev
   ```

## Security Notes

- ⚠️ **Never commit `.env.local` to git** (it's already in `.gitignore`)
- ⚠️ **Never share your `DATABASE_URL` publicly** - it contains credentials
- ⚠️ **Use strong passwords** for admin access
- ⚠️ **In production**, use environment variables provided by your hosting platform (Vercel, etc.)

## Where Variables Are Used

| Variable | Used In |
|----------|---------|
| `DATABASE_URL` | `lib/db.ts` - Database connection |
| `NEXT_PUBLIC_BASE_URL` | `app/api/sitemap-blogs/route.ts` - Sitemap generation |
| `NEXT_PUBLIC_BASE_URL` | `lib/sitemapHelper.ts` - Sitemap helper functions |
| `NEXT_PUBLIC_BASE_URL` | `app/llm.txt/route.ts` - LLM.txt generation |
| `NEXT_PUBLIC_BASE_URL` | `app/robots.txt/route.ts` - Robots.txt generation |
| `NEXT_PUBLIC_BASE_URL` | `app/sitemap.xml/route.ts` - Sitemap XML generation |
