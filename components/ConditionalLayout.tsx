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
    <>
      <Navbar />
      {children}
      <MobileStickyCTA />
      <Footer />
    </>
  );
}
