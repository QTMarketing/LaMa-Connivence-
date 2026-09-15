'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Briefcase,
  CupSoda,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ShoppingBag,
  Settings as SettingsIcon,
  Store as StoreIcon,
  Tag,
  X as XIcon,
} from 'lucide-react';

import { labelForSection } from '@/lib/auth/home';
import type { AdminSection } from '@/lib/db/schema';

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  /** Null means every signed-in admin sees it. */
  section: AdminSection | null;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, section: null },
  { href: '/admin/careers', label: 'Careers', icon: Briefcase, section: 'careers' },
  { href: '/admin/deals', label: 'Promos & Deals', icon: Tag, section: 'deals' },
  { href: '/admin/drinks', label: 'Drinks', icon: CupSoda, section: 'drinks' },
  { href: '/admin/stores', label: 'Store Locations', icon: StoreIcon, section: 'stores' },
  { href: '/admin/products', label: 'Products', icon: ShoppingBag, section: 'products' },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText, section: 'blog' },
  { href: '/admin/settings', label: 'Site Settings', icon: SettingsIcon, section: 'settings' },
];

interface AdminShellProps {
  /** Sections this user may see, already resolved from their role. */
  sections: AdminSection[];
  userName: string;
  activePath: string;
  /** Hide Dashboard for staff who only have one section — less noise. */
  showDashboard?: boolean;
  children: React.ReactNode;
}

function DeniedBanner() {
  const denied = useSearchParams().get('denied');
  if (!denied) return null;

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-900"
      role="status"
    >
      You do not have access to{' '}
      <span className="font-semibold">{labelForSection(denied)}</span>. Ask
      the site owner if you need it.
    </div>
  );
}

export default function AdminShell({
  sections,
  userName,
  activePath,
  showDashboard = true,
  children,
}: AdminShellProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (item.section === null) return showDashboard;
    return sections.includes(item.section);
  });

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    router.replace('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-20'} fixed left-0 top-0 z-40 flex h-full flex-col transition-all duration-300`}
        style={{ backgroundColor: '#1A1A1A' }}
      >
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          {sidebarOpen && (
            <div className="min-w-0">
              <h2 className="text-xl font-black text-white">Admin</h2>
              <p className="truncate text-xs text-white/60">{userName}</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 text-white transition-colors hover:bg-white/10"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <XIcon size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/admin'
                ? activePath === '/admin'
                : activePath === item.href ||
                  activePath.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-4 py-3 font-semibold transition-all ${
                  isActive
                    ? 'bg-primary/20'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                style={isActive ? { color: '#FF6B35' } : {}}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-4 py-3 font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}
      >
        <Suspense fallback={null}>
          <DeniedBanner />
        </Suspense>
        {children}
      </div>
    </div>
  );
}
