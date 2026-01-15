'use client';

import Link from 'next/link';
import { CreditCard, MapPin } from 'lucide-react';

export default function TopHeader() {
  return (
    <div 
      className="w-full py-2 px-4 md:px-6 flex items-center justify-between text-white text-sm"
      style={{ backgroundColor: '#FF6B35' }}
    >
      <div className="flex items-center gap-2">
        <CreditCard size={16} />
        <span>We accept SNAP/EBT.</span>
      </div>
      <Link 
        href="/stores" 
        className="flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <span>Find a Store</span>
        <MapPin size={16} />
      </Link>
    </div>
  );
}
