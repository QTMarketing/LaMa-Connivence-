import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  Briefcase,
  CupSoda,
  FileText,
  ShoppingBag,
  Settings as SettingsIcon,
  Store as StoreIcon,
  Tag,
} from 'lucide-react';

import AdminShell from '@/components/admin/AdminShell';
import { homePathForSession, labelForSection } from '@/lib/auth/home';
import { getSession } from '@/lib/auth/server';
import type { AdminSection } from '@/lib/db/schema';
import { ADMIN_SECTIONS } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

const OWNER_LINKS: Array<{
  href: string;
  label: string;
  description: string;
  section: AdminSection;
  icon: typeof Tag;
}> = [
  {
    href: '/admin/careers',
    label: 'Careers',
    description: 'Jobs and applications',
    section: 'careers',
    icon: Briefcase,
  },
  {
    href: '/admin/deals',
    label: 'Promos & Deals',
    description: 'Homepage and deals offers',
    section: 'deals',
    icon: Tag,
  },
  {
    href: '/admin/drinks',
    label: 'Drinks',
    description: 'Cold drink promotions',
    section: 'drinks',
    icon: CupSoda,
  },
  {
    href: '/admin/stores',
    label: 'Store Locations',
    description: 'Addresses and hours',
    section: 'stores',
    icon: StoreIcon,
  },
  {
    href: '/admin/products',
    label: 'Products',
    description: 'Category catalog images',
    section: 'products',
    icon: ShoppingBag,
  },
  {
    href: '/admin/blog',
    label: 'Blog Posts',
    description: 'News and media posts',
    section: 'blog',
    icon: FileText,
  },
  {
    href: '/admin/settings',
    label: 'Site Settings',
    description: 'Contact, FAQs, hero slides',
    section: 'settings',
    icon: SettingsIcon,
  },
];

export default async function AdminHomePage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/admin/login?next=/admin');

  const params = await searchParams;
  const denied = params.denied;

  // Staff should not sit on an empty owner dashboard — send them to their work.
  if (session.role !== 'owner') {
    const home = homePathForSession(session);
    if (home !== '/admin') {
      if (denied) {
        redirect(`${home}?denied=${encodeURIComponent(denied)}`);
      }
      redirect(home);
    }
  }

  const sections =
    session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions;

  const links = OWNER_LINKS.filter(
    (link) => session.role === 'owner' || sections.includes(link.section),
  );

  return (
    <AdminShell
      sections={sections}
      userName={session.name || session.email}
      activePath="/admin"
      showDashboard={session.role === 'owner'}
    >
      <div className="mx-auto max-w-5xl px-6 py-10">
        {denied ? (
          <div
            className="mb-8 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            You do not have access to{' '}
            <span className="font-semibold">{labelForSection(denied)}</span>.
            Ask the site owner if you need it.
          </div>
        ) : null}

        <h1 className="text-3xl font-black text-secondary">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Pick a section to edit. Orange is the only action color — keep the rest quiet.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md border border-gray-200 bg-white p-5 transition-colors hover:border-primary/40"
              >
                <span
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-md"
                  style={{ backgroundColor: 'rgba(255,107,53,0.12)', color: '#FF6B35' }}
                >
                  <Icon size={20} />
                </span>
                <h2 className="text-lg font-black text-secondary">{link.label}</h2>
                <p className="mt-1 text-sm text-gray-500">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminShell>
  );
}
