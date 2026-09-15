import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class strings, with later classes winning conflicts.
 *
 * Added for the mapcn map primitive (`@/lib/utils` is its only local import).
 * clsx resolves conditionals and arrays; twMerge then de-duplicates conflicting
 * Tailwind utilities so `cn('p-2', 'p-4')` yields `p-4` rather than both.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
