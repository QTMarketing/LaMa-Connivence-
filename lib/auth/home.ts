import type { AdminSection } from '@/lib/db/schema';

import type { AdminSession } from './session';

/** First place a signed-in admin should land after login or a denied redirect. */
const SECTION_HOME: Record<AdminSection, string> = {
  careers: '/admin/careers',
  deals: '/admin/deals',
  drinks: '/admin/drinks',
  stores: '/admin/stores',
  products: '/admin/products',
  blog: '/admin/blog',
  settings: '/admin/settings',
};

const SECTION_ORDER: AdminSection[] = [
  'careers',
  'deals',
  'drinks',
  'stores',
  'products',
  'blog',
  'settings',
];

export function homePathForSession(session: AdminSession): string {
  if (session.role === 'owner') return '/admin';

  for (const section of SECTION_ORDER) {
    if (session.permissions.includes(section)) {
      return SECTION_HOME[section];
    }
  }

  // Signed in but no sections — still better than an empty deals dashboard.
  return '/admin';
}

export function labelForSection(section: string): string {
  const labels: Record<string, string> = {
    careers: 'Careers',
    deals: 'Promos & Deals',
    drinks: 'Drinks',
    stores: 'Store Locations',
    products: 'Products',
    blog: 'Blog Posts',
    settings: 'Site Settings',
  };
  return labels[section] ?? section;
}
