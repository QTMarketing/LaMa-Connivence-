'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import Footer from '@/components/Footer';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import Navbar from '@/components/Navbar';
import type { SiteSettings } from '@/lib/settings/keys';

export default function ConditionalLayoutClient({
  children,
  settings,
}: {
  children: ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[100svh] flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <MobileStickyCTA />
      <Footer settings={settings} />
    </div>
  );
}
