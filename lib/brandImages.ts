/**
 * Pack shots for drink brand tiles.
 * All paths are files that exist under /public/brands (clean names).
 * Pepsi is the known-good pattern: JPEG, white well, no mix-blend.
 */
const FILES = {
  monster: '/brands/monster.webp',
  'red-bull': '/brands/red-bull.png',
  celsius: '/brands/celsius.png',
  ghost: '/brands/ghost.webp',
  c4: '/brands/c4.webp',
  'alani-nu': '/brands/alani-nu.png',
  pepsi: '/brands/pepsi.jpg',
  gatorade: '/brands/gatorade.webp',
} as const;

export const BRAND_IMAGE_FALLBACK = FILES.pepsi;

export function brandImageSrc(name: string): string {
  const n = name.toLowerCase();

  if (n.includes('monster')) return FILES.monster;
  if (n.includes('red bull') || n.includes('redbull')) return FILES['red-bull'];
  if (n.includes('celsius') || n.includes('celcius')) return FILES.celsius;
  if (n.includes('ghost')) return FILES.ghost;
  if (/\bc4\b/.test(n) || n.trim() === 'c4') return FILES.c4;
  if (n.includes('alani')) return FILES['alani-nu'];
  if (n.includes('pepsi')) return FILES.pepsi;
  if (n.includes('gatorade') || n.includes('gatorlyte')) return FILES.gatorade;

  return BRAND_IMAGE_FALLBACK;
}
