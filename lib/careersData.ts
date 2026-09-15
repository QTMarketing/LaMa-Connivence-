/**
 * Seed data for the `jobs` table, and the fallback the public careers pages
 * render when Postgres is unconfigured or unreachable.
 *
 * This is no longer the live source. Reads go through lib/careers/queries.ts;
 * `npm run db:seed` copies these rows in once. Edit jobs in /admin/careers,
 * not here.
 */
import type { JobView } from './careers/types';

export const JOB_SEED: JobView[] = [
  {
    id: 'store-associate',
    slug: 'store-associate',
    title: 'Store Associate',
    department: 'Retail',
    location: 'Multiple locations',
    employmentType: 'Full-time / Part-time',
    status: 'open',
    payRange: null,
    summary:
      'Run the front of the store: greet customers, work the register, keep the coffee and roller grill stocked, and keep the floor clean.',
    responsibilities: [
      'Serve customers at the register and on the floor',
      'Restock coffee, fountain, roller grill and cooler',
      'Keep the sales floor, restrooms and forecourt clean',
      'Follow age-restricted sales rules on tobacco and alcohol',
    ],
    requirements: [
      '18 or older',
      'Able to lift 25 lbs and stay on your feet through a shift',
      'Available for at least one weekend shift a week',
    ],
    postedAt: '2026-09-01',
  },
  {
    id: 'shift-manager',
    slug: 'shift-manager',
    title: 'Shift Manager',
    department: 'Management',
    location: 'Multiple locations',
    employmentType: 'Full-time',
    status: 'open',
    payRange: null,
    summary:
      'Lead a shift end to end — open or close the store, direct two to four associates, and own the cash drawer for your hours.',
    responsibilities: [
      'Open or close the store and reconcile the drawer',
      'Direct associates and cover gaps during the shift',
      'Handle customer escalations',
      'Place and receive vendor orders',
    ],
    requirements: [
      'One year of retail, food service or similar experience',
      'Comfortable being the senior person on site',
      'Open availability including weekends',
    ],
    postedAt: '2026-09-01',
  },
  {
    id: 'assistant-manager',
    slug: 'assistant-manager',
    title: 'Assistant Manager',
    department: 'Management',
    location: 'Multiple locations',
    employmentType: 'Full-time',
    status: 'open',
    payRange: null,
    summary:
      'Second in command of a single store: build the schedule, manage inventory and margins, and step in as acting manager when needed.',
    responsibilities: [
      'Build the weekly schedule and manage labor hours',
      'Run inventory counts and control shrink',
      'Train new associates',
      'Act as store manager in their absence',
    ],
    requirements: [
      'Two years of retail experience, at least one supervising',
      'Comfortable with inventory and basic P&L numbers',
      'Reliable transportation',
    ],
    postedAt: '2026-09-01',
  },
];
