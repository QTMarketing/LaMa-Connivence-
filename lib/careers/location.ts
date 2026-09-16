import type { LocationScope } from './types';

/** Default US-state regions seeded from existing store.state values. */
export const STATE_REGION_SEED: Array<{
  name: string;
  slug: string;
  stateCode: string;
}> = [
  { name: 'Texas', slug: 'texas', stateCode: 'TX' },
  { name: 'Louisiana', slug: 'louisiana', stateCode: 'LA' },
  { name: 'Oklahoma', slug: 'oklahoma', stateCode: 'OK' },
  { name: 'Arkansas', slug: 'arkansas', stateCode: 'AR' },
  { name: 'Mississippi', slug: 'mississippi', stateCode: 'MS' },
  { name: 'New Mexico', slug: 'new-mexico', stateCode: 'NM' },
];

export function buildLocationLabel(input: {
  locationScope: LocationScope;
  regionNames: string[];
  storeNames: string[];
  override?: string | null;
}): string {
  const override = input.override?.trim();
  if (override) return override;

  if (input.locationScope === 'chain') return 'All locations';

  if (input.locationScope === 'region') {
    const names = input.regionNames.filter(Boolean);
    if (names.length === 0) return 'Selected regions';
    if (names.length <= 3) return names.join(' · ');
    return `${names.slice(0, 2).join(' · ')} +${names.length - 2} more`;
  }

  const stores = input.storeNames.filter(Boolean);
  if (stores.length === 0) return 'Selected stores';
  if (stores.length === 1) return stores[0];
  if (stores.length <= 3) return stores.join(' · ');
  return `${stores.slice(0, 2).join(' · ')} +${stores.length - 2} more`;
}

export function applyUrlForJobStore(input: {
  baseUrl: string;
  slug: string;
  storeId: number;
}): string {
  const base = input.baseUrl.replace(/\/$/, '');
  return `${base}/careers/${input.slug}?store=${input.storeId}#apply`;
}
