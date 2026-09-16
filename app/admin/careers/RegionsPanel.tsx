'use client';

import { useMemo, useState } from 'react';
import { Loader2, MapPin, Plus, Trash2 } from 'lucide-react';

import type { RegionView, StoreOption } from '@/lib/careers/types';

interface RegionsPanelProps {
  regions: RegionView[];
  stores: StoreOption[];
  onRegionsChange: (regions: RegionView[]) => void;
  onStoresChange: (stores: StoreOption[]) => void;
  onError: (message: string | null) => void;
}

export default function RegionsPanel({
  regions,
  stores,
  onRegionsChange,
  onStoresChange,
  onError,
}: RegionsPanelProps) {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(
    regions[0]?.id ?? null,
  );
  const [pickedStoreIds, setPickedStoreIds] = useState<number[]>([]);

  const unassigned = useMemo(
    () => stores.filter((s) => !s.regionId),
    [stores],
  );

  const regionStores = useMemo(
    () =>
      selectedRegionId
        ? stores.filter((s) => s.regionId === selectedRegionId)
        : [],
    [stores, selectedRegionId],
  );

  async function createRegion() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setBusy('create');
    onError(null);
    const res = await fetch('/api/admin/regions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: trimmed }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      onError(data.error ?? 'Could not create region.');
      return;
    }
    onRegionsChange([...regions, data.region]);
    setSelectedRegionId(data.region.id);
    setName('');
  }

  async function deleteRegion(region: RegionView) {
    if (
      !window.confirm(
        `Delete region "${region.name}"? Stores in it become unassigned.`,
      )
    ) {
      return;
    }
    setBusy(region.id);
    onError(null);
    const res = await fetch(`/api/admin/regions/${region.id}`, {
      method: 'DELETE',
    });
    setBusy(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      onError(data.error ?? 'Could not delete region.');
      return;
    }
    onRegionsChange(regions.filter((r) => r.id !== region.id));
    onStoresChange(
      stores.map((s) =>
        s.regionId === region.id
          ? { ...s, regionId: null, regionName: null }
          : s,
      ),
    );
    if (selectedRegionId === region.id) {
      setSelectedRegionId(regions.find((r) => r.id !== region.id)?.id ?? null);
    }
  }

  async function assignStores(regionId: string | null, storeIds: number[]) {
    if (storeIds.length === 0) return;
    setBusy('assign');
    onError(null);
    const res = await fetch('/api/admin/regions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regionId, storeIds }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(null);
    if (!res.ok) {
      onError(data.error ?? 'Could not assign stores.');
      return;
    }

    const regionName =
      regionId == null
        ? null
        : (regions.find((r) => r.id === regionId)?.name ?? null);

    onStoresChange(
      stores.map((s) =>
        storeIds.includes(s.id)
          ? { ...s, regionId, regionName }
          : s,
      ),
    );

    // Refresh store counts on regions
    const nextCounts = new Map<string, number>();
    for (const s of stores) {
      const rid = storeIds.includes(s.id) ? regionId : s.regionId;
      if (rid) nextCounts.set(rid, (nextCounts.get(rid) ?? 0) + 1);
    }
    // Recount properly from updated list
    const updatedStores = stores.map((s) =>
      storeIds.includes(s.id) ? { ...s, regionId, regionName } : s,
    );
    onRegionsChange(
      regions.map((r) => ({
        ...r,
        storeCount: updatedStores.filter((s) => s.regionId === r.id).length,
      })),
    );
    setPickedStoreIds([]);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-md border border-gray-200 bg-white p-5">
        <h2 className="mb-1 text-lg font-bold text-gray-900">Regions</h2>
        <p className="mb-4 text-sm text-gray-600">
          Group stores so HR can post jobs by area. Seeded from states; add
          custom regions like &ldquo;North Texas&rdquo; anytime.
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Region name"
            maxLength={80}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={createRegion}
            disabled={busy === 'create' || !name.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {busy === 'create' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Plus size={15} />
            )}
            Add region
          </button>
        </div>

        <ul className="divide-y divide-gray-100">
          {regions.map((region) => (
            <li
              key={region.id}
              className={`flex items-center justify-between gap-3 py-3 ${
                selectedRegionId === region.id ? 'bg-orange-50/60' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedRegionId(region.id)}
                className="flex min-w-0 flex-1 items-center gap-2 px-2 text-left"
              >
                <MapPin size={16} className="shrink-0 text-primary" />
                <span className="font-semibold text-gray-900">
                  {region.name}
                </span>
                <span className="text-xs text-gray-500">
                  {region.storeCount ?? 0} stores · /{region.slug}
                </span>
              </button>
              <button
                type="button"
                onClick={() => deleteRegion(region)}
                disabled={busy === region.id}
                className="rounded-lg border border-red-200 px-2 py-1.5 text-red-700 hover:bg-red-50 disabled:opacity-50"
                aria-label={`Delete ${region.name}`}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
          {regions.length === 0 && (
            <li className="py-6 text-center text-sm text-gray-500">
              No regions yet. Create one above.
            </li>
          )}
        </ul>
      </div>

      {selectedRegionId && (
        <div className="rounded-md border border-gray-200 bg-white p-5">
          <h3 className="mb-1 font-bold text-gray-900">
            Stores in{' '}
            {regions.find((r) => r.id === selectedRegionId)?.name ?? 'region'}
          </h3>
          <p className="mb-4 text-sm text-gray-600">
            {regionStores.length} assigned. Pick unassigned stores below to add
            them.
          </p>

          {regionStores.length > 0 && (
            <ul className="mb-4 max-h-40 space-y-1 overflow-y-auto text-sm text-gray-700">
              {regionStores.map((store) => (
                <li key={store.id} className="flex justify-between gap-2">
                  <span>
                    {store.name}
                    <span className="text-gray-400">
                      {' '}
                      — {[store.city, store.state].filter(Boolean).join(', ') ||
                        store.address}
                    </span>
                  </span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-red-600"
                    onClick={() => assignStores(null, [store.id])}
                  >
                    Unassign
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">
            Unassigned stores ({unassigned.length})
          </p>
          <div className="mb-3 max-h-48 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-2">
            {unassigned.length === 0 && (
              <p className="p-2 text-sm text-gray-500">
                Every store already has a region.
              </p>
            )}
            {unassigned.map((store) => (
              <label
                key={store.id}
                className="flex cursor-pointer items-start gap-2 rounded px-2 py-1.5 text-sm hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={pickedStoreIds.includes(store.id)}
                  onChange={() =>
                    setPickedStoreIds((prev) =>
                      prev.includes(store.id)
                        ? prev.filter((id) => id !== store.id)
                        : [...prev, store.id],
                    )
                  }
                  className="mt-0.5"
                />
                <span>
                  <span className="font-semibold">{store.name}</span>
                  <span className="block text-xs text-gray-500">
                    {[store.city, store.state].filter(Boolean).join(', ') ||
                      store.address}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={pickedStoreIds.length === 0 || busy === 'assign'}
            onClick={() => assignStores(selectedRegionId, pickedStoreIds)}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          >
            {busy === 'assign' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : null}
            Assign {pickedStoreIds.length || ''} to region
          </button>
        </div>
      )}
    </div>
  );
}
