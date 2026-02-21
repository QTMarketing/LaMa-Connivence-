'use client';

import { MapPin, Tag } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MobileStickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 gap-3">
        <Link
          href="/stores"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <MapPin size={18} className="text-primary" />
          <span className="typography-body-sm font-semibold text-gray-900">Find Store</span>
        </Link>
        <Link
          href="/deals"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md btn-primary"
        >
          <Tag size={18} />
          <span className="typography-body-sm font-semibold">View Deals</span>
        </Link>
      </div>
    </div>
  );
}
