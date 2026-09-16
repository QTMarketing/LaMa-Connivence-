'use client';

import { useMemo } from 'react';
import { Loader2, Plus, Save, Trash2, X } from 'lucide-react';

import { buildLocationLabel } from '@/lib/careers/location';
import {
  EMPLOYMENT_TYPES,
  JOB_STATUSES,
  LOCATION_SCOPE_LABELS,
  LOCATION_SCOPES,
  type EmploymentType,
  type JobStatus,
  type LocationScope,
  type RegionView,
  type StoreOption,
} from '@/lib/careers/types';

export interface JobFormValues {
  slug: string;
  title: string;
  department: string;
  location: string;
  locationScope: LocationScope;
  regionIds: string[];
  storeIds: number[];
  employmentType: EmploymentType;
  status: JobStatus;
  payRange: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  postedAt: string;
}

interface JobFormProps {
  values: JobFormValues;
  isEdit: boolean;
  saving: boolean;
  regions: RegionView[];
  stores: StoreOption[];
  onChange: (values: JobFormValues) => void;
  onCancel: () => void;
  onSubmit: (values: JobFormValues) => void;
  onCreateRegion?: (name: string) => Promise<RegionView | null>;
}

const inputClass =
  'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-semibold text-gray-700';

export default function JobForm({
  values,
  isEdit,
  saving,
  regions,
  stores,
  onChange,
  onCancel,
  onSubmit,
  onCreateRegion,
}: JobFormProps) {
  const set = <K extends keyof JobFormValues>(
    key: K,
    value: JobFormValues[K],
  ) => onChange({ ...values, [key]: value });

  const setScope = (locationScope: LocationScope) => {
    const next: JobFormValues = {
      ...values,
      locationScope,
      regionIds: locationScope === 'region' ? values.regionIds : [],
      storeIds: locationScope === 'store' ? values.storeIds : [],
    };
    next.location = labelFor(next, regions, stores);
    onChange(next);
  };

  const locationPreview = useMemo(
    () => labelFor(values, regions, stores),
    [values, regions, stores],
  );

  const setListItem = (
    key: 'responsibilities' | 'requirements',
    index: number,
    value: string,
  ) => {
    const next = [...values[key]];
    next[index] = value;
    set(key, next);
  };

  const addListItem = (key: 'responsibilities' | 'requirements') =>
    set(key, [...values[key], '']);

  const removeListItem = (
    key: 'responsibilities' | 'requirements',
    index: number,
  ) => {
    const next = values[key].filter((_, i) => i !== index);
    set(key, next.length > 0 ? next : ['']);
  };

  const toggleRegion = (id: string) => {
    const regionIds = values.regionIds.includes(id)
      ? values.regionIds.filter((r) => r !== id)
      : [...values.regionIds, id];
    const next = { ...values, regionIds };
    next.location = labelFor(next, regions, stores);
    onChange(next);
  };

  const toggleStore = (id: number) => {
    const storeIds = values.storeIds.includes(id)
      ? values.storeIds.filter((s) => s !== id)
      : [...values.storeIds, id];
    const next = { ...values, storeIds };
    next.location = labelFor(next, regions, stores);
    onChange(next);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ ...values, location: locationPreview });
      }}
      className="mb-6 rounded-md border border-gray-200 bg-white p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900">
          {isEdit ? 'Edit job' : 'New job'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
          aria-label="Cancel"
        >
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="job-title" className={labelClass}>
            Job title <span className="text-primary">*</span>
          </label>
          <input
            id="job-title"
            value={values.title}
            onChange={(e) => set('title', e.target.value)}
            required
            maxLength={140}
            className={inputClass}
            placeholder="Store Associate"
          />
        </div>

        <div>
          <label htmlFor="job-department" className={labelClass}>
            Department <span className="text-primary">*</span>
          </label>
          <input
            id="job-department"
            value={values.department}
            onChange={(e) => set('department', e.target.value)}
            required
            maxLength={80}
            className={inputClass}
            placeholder="Retail"
          />
        </div>

        <div>
          <label htmlFor="job-type" className={labelClass}>
            Employment type
          </label>
          <select
            id="job-type"
            value={values.employmentType}
            onChange={(e) =>
              set('employmentType', e.target.value as EmploymentType)
            }
            className={inputClass}
          >
            {EMPLOYMENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <p className={labelClass}>
            Where is this role hiring? <span className="text-primary">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {LOCATION_SCOPES.map((scope) => (
              <button
                key={scope}
                type="button"
                onClick={() => setScope(scope)}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
                  values.locationScope === scope
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {LOCATION_SCOPE_LABELS[scope]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Public label: <strong>{locationPreview}</strong>
          </p>
        </div>

        {values.locationScope === 'region' && (
          <div className="md:col-span-2">
            <p className={labelClass}>Select regions</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {regions.map((region) => {
                const selected = values.regionIds.includes(region.id);
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => toggleRegion(region.id)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
                      selected
                        ? 'border-primary bg-orange-50 text-primary'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {region.name}
                    {typeof region.storeCount === 'number'
                      ? ` (${region.storeCount})`
                      : ''}
                  </button>
                );
              })}
            </div>
            {onCreateRegion && (
              <InlineCreateRegion
                onCreate={async (name) => {
                  const created = await onCreateRegion(name);
                  if (created) toggleRegion(created.id);
                }}
              />
            )}
          </div>
        )}

        {values.locationScope === 'store' && (
          <div className="md:col-span-2">
            <p className={labelClass}>Select stores</p>
            <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-gray-200 p-3">
              {stores.map((store) => {
                const selected = values.storeIds.includes(store.id);
                return (
                  <label
                    key={store.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-1.5 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleStore(store.id)}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-800">
                      <span className="font-semibold">{store.name}</span>
                      <span className="block text-xs text-gray-500">
                        {[store.city, store.state].filter(Boolean).join(', ') ||
                          store.address}
                        {store.regionName ? ` · ${store.regionName}` : ''}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="job-status" className={labelClass}>
            Status
          </label>
          <select
            id="job-status"
            value={values.status}
            onChange={(e) => set('status', e.target.value as JobStatus)}
            className={inputClass}
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Only <strong>open</strong> roles appear on the website. Use
            Publish on the job card for a one-click go-live.
          </p>
        </div>

        <div>
          <label htmlFor="job-pay" className={labelClass}>
            Pay range
          </label>
          <input
            id="job-pay"
            value={values.payRange}
            onChange={(e) => set('payRange', e.target.value)}
            maxLength={80}
            className={inputClass}
            placeholder="$13 – $15 / hour"
          />
        </div>

        <div>
          <label htmlFor="job-posted" className={labelClass}>
            Posted date
          </label>
          <input
            id="job-posted"
            type="date"
            value={values.postedAt}
            onChange={(e) => set('postedAt', e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="job-slug" className={labelClass}>
            URL
          </label>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-gray-500">/careers/</span>
            <input
              id="job-slug"
              value={values.slug}
              onChange={(e) => set('slug', e.target.value)}
              maxLength={80}
              className={inputClass}
              placeholder="store-associate"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="job-summary" className={labelClass}>
            Summary <span className="text-primary">*</span>
          </label>
          <textarea
            id="job-summary"
            value={values.summary}
            onChange={(e) => set('summary', e.target.value)}
            required
            rows={3}
            maxLength={1000}
            className={inputClass}
            placeholder="One or two sentences describing the role."
          />
        </div>
      </div>

      <ListEditor
        legend="What you will do"
        items={values.responsibilities}
        placeholder="Serve customers at the register and on the floor"
        onItemChange={(i, v) => setListItem('responsibilities', i, v)}
        onAdd={() => addListItem('responsibilities')}
        onRemove={(i) => removeListItem('responsibilities', i)}
      />

      <ListEditor
        legend="What you need"
        items={values.requirements}
        placeholder="18 or older"
        onItemChange={(i, v) => setListItem('requirements', i, v)}
        onAdd={() => addListItem('requirements')}
        onRemove={(i) => removeListItem('requirements', i)}
      />

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving
            </>
          ) : (
            <>
              <Save size={18} />
              {isEdit ? 'Save changes' : 'Create job'}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-5 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function labelFor(
  values: JobFormValues,
  regions: RegionView[],
  stores: StoreOption[],
) {
  return buildLocationLabel({
    locationScope: values.locationScope,
    regionNames: regions
      .filter((r) => values.regionIds.includes(r.id))
      .map((r) => r.name),
    storeNames: stores
      .filter((s) => values.storeIds.includes(s.id))
      .map((s) => s.name),
  });
}

function InlineCreateRegion({
  onCreate,
}: {
  onCreate: (name: string) => Promise<void>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        id="new-region-inline"
        maxLength={80}
        placeholder="New region name"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        onKeyDown={async (e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          const input = e.currentTarget;
          const name = input.value.trim();
          if (!name) return;
          await onCreate(name);
          input.value = '';
        }}
      />
      <button
        type="button"
        className="inline-flex items-center gap-1 text-sm font-semibold text-primary"
        onClick={async () => {
          const input = document.getElementById(
            'new-region-inline',
          ) as HTMLInputElement | null;
          const name = input?.value.trim();
          if (!name || !input) return;
          await onCreate(name);
          input.value = '';
        }}
      >
        <Plus size={14} />
        Add region
      </button>
    </div>
  );
}

function ListEditor({
  legend,
  items,
  placeholder,
  onItemChange,
  onAdd,
  onRemove,
}: {
  legend: string;
  items: string[];
  placeholder: string;
  onItemChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="mb-2 text-sm font-semibold text-gray-700">
        {legend}
      </legend>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              value={item}
              onChange={(e) => onItemChange(index, e.target.value)}
              maxLength={200}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none"
              placeholder={placeholder}
              aria-label={`${legend} item ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="shrink-0 rounded-lg border border-gray-200 p-2.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
              aria-label={`Remove ${legend} item ${index + 1}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <Plus size={15} />
        Add another
      </button>
    </fieldset>
  );
}
