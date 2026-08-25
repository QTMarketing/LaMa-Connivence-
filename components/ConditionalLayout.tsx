'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MobileStickyCTA from '@/components/MobileStickyCTA';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  // Hide Navbar and Footer on admin pages
  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-[100svh] flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <MobileStickyCTA />
      <Footer />
    </div>
  );
}
