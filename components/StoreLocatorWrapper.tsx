'use client';

import { usePathname } from 'next/navigation';
import StoreLocator from './StoreLocator';

export default function StoreLocatorWrapper() {
  const pathname = usePathname();
  
  // Don't show on homepage
  if (pathname === '/') {
    return null;
  }
  
  return <StoreLocator />;
}
