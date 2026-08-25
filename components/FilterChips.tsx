'use client';

import type { LucideIcon } from 'lucide-react';

type Item<T extends string> = {
  id: T;
  label: string;
  icon: LucideIcon;
};

export default function FilterChips<T extends string>({
  items,
  value,
  onChange,
  ariaLabel,
}: {
  items: Item<T>[];
  value: T;
  onChange: (id: T) => void;
  ariaLabel: string;
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className="flex flex-nowrap gap-2.5 overflow-x-auto scrollbar-hide px-5 md:px-0"
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active = value === item.id;
        return (
          <button
            key={item.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(item.id)}
            className={`inline-flex shrink-0 items-center justify-center gap-2 px-4 md:px-6 py-2.5 rounded-full typography-body-sm font-semibold min-h-[44px] border ${
              active
                ? 'border-transparent shadow-sm'
                : 'bg-white text-[#1A1A1A] border-gray-200'
            }`}
            style={active ? { backgroundColor: '#FF6B35', color: '#1A1A1A' } : undefined}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
