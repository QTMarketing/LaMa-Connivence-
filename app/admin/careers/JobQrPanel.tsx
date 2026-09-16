'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download, Loader2, Printer, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

import { applyUrlForJobStore } from '@/lib/careers/location';
import type { JobView, StoreOption } from '@/lib/careers/types';

interface JobQrPanelProps {
  job: JobView;
  stores: StoreOption[];
}

function storesForJob(job: JobView, all: StoreOption[]): StoreOption[] {
  if (job.locationScope === 'chain') return all;
  if (job.locationScope === 'region') {
    const ids = new Set(job.regionIds);
    return all.filter((s) => s.regionId && ids.has(s.regionId));
  }
  const ids = new Set(job.storeIds);
  return all.filter((s) => ids.has(s.id));
}

export default function JobQrPanel({ job, stores }: JobQrPanelProps) {
  const eligible = useMemo(() => storesForJob(job, stores), [job, stores]);
  const [storeId, setStoreId] = useState<number | ''>(
    eligible[0]?.id ?? '',
  );
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = eligible.find((s) => s.id === storeId) ?? null;

  const applyUrl = useMemo(() => {
    if (!selected) return null;
    const base =
      typeof window !== 'undefined'
        ? window.location.origin
        : (process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3001');
    return applyUrlForJobStore({
      baseUrl: base,
      slug: job.slug,
      storeId: selected.id,
    });
  }, [job.slug, selected]);

  useEffect(() => {
    if (eligible.length === 0) {
      setStoreId('');
      return;
    }
    if (!eligible.some((s) => s.id === storeId)) {
      setStoreId(eligible[0].id);
    }
  }, [eligible, storeId]);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      if (!applyUrl) {
        setDataUrl(null);
        return;
      }
      setBusy(true);
      try {
        const url = await QRCode.toDataURL(applyUrl, {
          width: 360,
          margin: 2,
          errorCorrectionLevel: 'M',
        });
        if (!cancelled) setDataUrl(url);
      } catch (error) {
        console.error('[job-qr] Generate failed:', error);
        if (!cancelled) setDataUrl(null);
      } finally {
        if (!cancelled) setBusy(false);
      }
    }
    void render();
    return () => {
      cancelled = true;
    };
  }, [applyUrl]);

  if (job.status !== 'open') {
    return (
      <p className="mt-3 text-xs text-gray-500">
        Publish this job before generating QR codes for store managers.
      </p>
    );
  }

  if (eligible.length === 0) {
    return (
      <p className="mt-3 text-xs text-amber-700">
        No stores match this job&apos;s location scope. Assign stores to
        regions, or widen the scope.
      </p>
    );
  }

  return (
    <div className="mt-4 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
        <QrCode size={16} />
        Store manager QR
      </div>

      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        Store
      </label>
      <select
        value={storeId}
        onChange={(e) =>
          setStoreId(e.target.value ? Number(e.target.value) : '')
        }
        className="mb-4 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
      >
        {eligible.map((store) => (
          <option key={store.id} value={store.id}>
            {store.name}
            {store.city || store.state
              ? ` — ${[store.city, store.state].filter(Boolean).join(', ')}`
              : ''}
          </option>
        ))}
      </select>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        <div className="flex h-44 w-44 items-center justify-center rounded-md bg-white p-2 shadow-sm">
          {busy && <Loader2 className="animate-spin text-gray-400" />}
          {!busy && dataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dataUrl} alt={`QR for ${job.title}`} className="h-full w-full" />
          )}
        </div>

        <div className="flex-1 text-sm text-gray-600">
          <p className="mb-2 font-semibold text-gray-900">
            {job.title}
            {selected ? ` · ${selected.name}` : ''}
          </p>
          <p className="mb-3 break-all text-xs text-gray-500">{applyUrl}</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!dataUrl || !selected}
              onClick={() => {
                if (!dataUrl || !selected) return;
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = `lama-${job.slug}-store-${selected.id}.png`;
                a.click();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-40"
            >
              <Download size={15} />
              Download PNG
            </button>
            <button
              type="button"
              disabled={!dataUrl || !selected || !applyUrl}
              onClick={() => {
                if (!dataUrl || !selected || !applyUrl) return;
                printQrSheet({
                  jobTitle: job.title,
                  storeName: selected.name,
                  storeAddress: selected.address,
                  dataUrl,
                  applyUrl,
                });
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-40"
            >
              <Printer size={15} />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function printQrSheet(input: {
  jobTitle: string;
  storeName: string;
  storeAddress: string;
  dataUrl: string;
  applyUrl: string;
}) {
  const win = window.open('', '_blank', 'noopener,noreferrer,width=480,height=720');
  if (!win) return;
  win.document.write(`<!doctype html>
<html>
<head>
  <title>${escapeHtml(input.jobTitle)} — Apply QR</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; padding: 32px; text-align: center; color: #1a1a1a; }
    h1 { font-size: 22px; margin: 0 0 8px; }
    h2 { font-size: 16px; font-weight: 600; margin: 0 0 4px; color: #444; }
    p { font-size: 13px; color: #666; margin: 0 0 20px; }
    img { width: 280px; height: 280px; }
    .hint { margin-top: 20px; font-size: 18px; font-weight: 700; }
    .url { margin-top: 12px; font-size: 10px; word-break: break-all; color: #888; }
  </style>
</head>
<body>
  <p style="text-transform:uppercase;letter-spacing:.08em;font-size:11px;font-weight:700;color:#FF6B35;">LaMa Convenience — Now hiring</p>
  <h1>${escapeHtml(input.jobTitle)}</h1>
  <h2>${escapeHtml(input.storeName)}</h2>
  <p>${escapeHtml(input.storeAddress)}</p>
  <img src="${input.dataUrl}" alt="QR code" />
  <p class="hint">Scan to apply</p>
  <p class="url">${escapeHtml(input.applyUrl)}</p>
  <script>window.onload = function () { window.print(); }</script>
</body>
</html>`);
  win.document.close();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
