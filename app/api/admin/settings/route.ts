import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

import { requireSection } from '@/lib/auth/server';
import { apiFailure } from '@/lib/content/adminQueries';
import { getDb } from '@/lib/db/client';
import { siteSettings } from '@/lib/db/schema';
import {
  SITE_SETTING_KEYS,
  type SiteSettingKey,
  type SiteSettings,
} from '@/lib/settings/keys';
import { adminGetSiteSettings } from '@/lib/settings/queries';

const CAMEL_TO_KEY: Record<keyof SiteSettings, SiteSettingKey> = {
  contactPhone: 'contact_phone',
  contactEmail: 'contact_email',
  contactHours: 'contact_hours',
  socialInstagram: 'social_instagram',
  socialFacebook: 'social_facebook',
  socialTwitter: 'social_twitter',
};

export async function GET() {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ settings: await adminGetSiteSettings() });
  } catch (error) {
    return apiFailure(
      'admin-settings-get',
      error,
      'Could not load site settings.',
    );
  }
}

export async function PUT(request: Request) {
  const guard = await requireSection('settings');
  if (guard instanceof NextResponse) return guard;

  const body = await request.json().catch(() => null);
  if (typeof body !== 'object' || body === null) {
    return NextResponse.json({ error: 'Expected a JSON object.' }, { status: 400 });
  }

  const input = body as Record<string, unknown>;
  const updates: Array<{ key: SiteSettingKey; value: string }> = [];

  for (const [camel, key] of Object.entries(CAMEL_TO_KEY) as Array<
    [keyof SiteSettings, SiteSettingKey]
  >) {
    if (!(camel in input) && !(key in input)) continue;

    const raw = input[camel] ?? input[key];
    const value = typeof raw === 'string' ? raw.trim() : '';

    if (value.length > 500) {
      return NextResponse.json(
        { error: `${camel} is too long (max 500 characters).` },
        { status: 400 },
      );
    }

    updates.push({ key, value });
  }

  // Always write the full known set when the client sends a complete form.
  if (updates.length === 0) {
    for (const key of SITE_SETTING_KEYS) {
      updates.push({ key, value: '' });
    }
  }

  try {
    const db = getDb();
    for (const { key, value } of updates) {
      await db
        .insert(siteSettings)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value, updatedAt: sql`now()` },
        });
    }

    return NextResponse.json({ settings: await adminGetSiteSettings() });
  } catch (error) {
    return apiFailure(
      'admin-settings-put',
      error,
      'Could not save site settings.',
    );
  }
}
