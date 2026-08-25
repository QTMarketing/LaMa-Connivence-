import Image from 'next/image';
import { ASSETS } from '@/lib/assetInventory';

/** Every generated asset in one place, with where it is planned to go. Throwaway route. */
export const metadata = { title: 'Asset inventory — LaMa' };

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  keep: { label: 'In use — keep', bg: '#DDE4D0', fg: '#1A1A1A' },
  review: { label: 'Needs your call', bg: '#FFE0B8', fg: '#1A1A1A' },
  retire: { label: 'Propose retiring', bg: '#F2CFC6', fg: '#1A1A1A' },
};

function Group({ status }: { status: string }) {
  const rows = ASSETS.filter((a) => a.status === status);
  if (!rows.length) return null;
  const kb = rows.reduce((n, r) => n + r.kb, 0);
  const s = STATUS[status];

  return (
    <section className="mb-14">
      <div className="mb-4 flex flex-wrap items-baseline gap-3">
        <span
          className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]"
          style={{ background: s.bg, color: s.fg }}
        >
          {s.label}
        </span>
        <span className="typography-body-sm text-gray-600">
          {rows.length} files · {(kb / 1024).toFixed(1)} MB
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {rows.map((a) => (
          <div
            key={a.file}
            className="overflow-hidden rounded-md border border-[#1A1A1A]/10 bg-white"
          >
            {/* Checkerboard shows transparency, so cutouts are obvious at a glance. */}
            <div
              className="relative aspect-[4/3]"
              style={{
                backgroundImage:
                  'linear-gradient(45deg,#eee 25%,transparent 25%),linear-gradient(-45deg,#eee 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#eee 75%),linear-gradient(-45deg,transparent 75%,#eee 75%)',
                backgroundSize: '16px 16px',
                backgroundPosition: '0 0,0 8px,8px -8px,-8px 0px',
              }}
            >
              <Image
                src={`/campaign/${a.file}`}
                alt={a.stem}
                fill
                sizes="260px"
                className="object-contain"
              />
            </div>
            <div className="p-3">
              <p className="break-all font-mono text-[0.68rem] font-semibold text-[#1A1A1A]">
                {a.file}
              </p>
              <p className="mt-1 text-[0.68rem] text-gray-500">
                {a.kb} KB · {a.family}
              </p>
              <p className="mt-2 text-[0.72rem] leading-snug text-[#1A1A1A]/80">{a.plan}</p>
              {a.used.length > 0 && (
                <p className="mt-2 break-all font-mono text-[0.6rem] text-gray-500">
                  {a.used.join(', ')}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function AssetInventoryPage() {
  const total = ASSETS.reduce((n, a) => n + a.kb, 0);
  const retire = ASSETS.filter((a) => a.status === 'retire').reduce((n, a) => n + a.kb, 0);

  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="container-standard px-4 pt-10 md:px-6">
        <h1 className="typography-h2 text-[#1A1A1A]">Asset inventory</h1>
        <p className="typography-body mt-2 max-w-2xl text-gray-600">
          Every image generated for this project, where each one is planned to go, and
          which are still referenced in code. {ASSETS.length} files,{' '}
          {(total / 1024).toFixed(1)} MB total — {(retire / 1024).toFixed(1)} MB of that is
          the rejected dark direction and unused variants.
        </p>
        <p className="typography-body-sm mt-3 max-w-2xl text-gray-500">
          Nothing here is deleted. The groups below are a proposal for you to confirm.
        </p>
      </div>

      <div className="container-standard px-4 pt-10 md:px-6">
        <Group status="keep" />
        <Group status="review" />
        <Group status="retire" />
      </div>
    </main>
  );
}
