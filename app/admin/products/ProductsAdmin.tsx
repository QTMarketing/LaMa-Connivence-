'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  AlertTriangle,
  Edit2,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
  X,
} from 'lucide-react';

import ImageField from '@/components/admin/ImageField';
import { isStockPlaceholder } from '@/lib/content/imageUpload';
import { PRODUCT_CATEGORIES } from '@/lib/content/validation';
import type { Product } from '@/lib/productData';

type Draft = Omit<Product, 'id'>;

function emptyDraft(): Draft {
  return {
    name: '',
    description: '',
    image: '',
    category: 'snacks',
    price: '',
    featured: false,
  };
}

function categoryLabel(category: string) {
  return category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const inputClass =
  'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-primary focus:outline-none';
const labelClass = 'mb-1.5 block text-sm font-semibold text-gray-700';

export default function ProductsAdmin({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [categoryFilter, setCategoryFilter] = useState<'all' | Product['category']>('all');
  const [editing, setEditing] = useState<{ id: number | null; draft: Draft } | null>(null);
  const [busy, setBusy] = useState<number | 'save' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const placeholderCount = useMemo(
    () => products.filter((p) => isStockPlaceholder(p.image)).length,
    [products],
  );

  const visible = useMemo(
    () =>
      categoryFilter === 'all'
        ? products
        : products.filter((p) => p.category === categoryFilter),
    [products, categoryFilter],
  );

  async function refresh() {
    const res = await fetch('/api/admin/products');
    if (res.ok) setProducts((await res.json()).products);
  }

  async function save() {
    if (!editing) return;

    const { id, draft } = editing;
    if (!draft.name || !draft.description || !draft.image) {
      setError('Name, description and image are all required.');
      return;
    }

    setError(null);
    setBusy('save');

    const res = await fetch(
      id === null ? '/api/admin/products' : `/api/admin/products/${id}`,
      {
        method: id === null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      },
    );

    setBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not save the product.');
      return;
    }

    setEditing(null);
    await refresh();
  }

  async function remove(product: Product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;

    setError(null);
    setBusy(product.id);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'DELETE',
    });
    setBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not delete the product.');
      return;
    }

    await refresh();
  }

  async function toggleFeatured(product: Product) {
    setError(null);
    setBusy(product.id);
    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...product, featured: !product.featured }),
    });
    setBusy(null);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? 'Could not update the product.');
      return;
    }

    await refresh();
  }

  return (
    <div className="p-6 md:p-8">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-600">
            {products.length} products across {PRODUCT_CATEGORIES.length}{' '}
            categories.
          </p>
        </div>

        <button
          onClick={() => setEditing({ id: null, draft: emptyDraft() })}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition-opacity hover:opacity-90"
        >
          <Plus size={18} />
          New product
        </button>
      </header>

      {placeholderCount > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-700" />
          <p className="text-sm text-amber-900">
            <strong>{placeholderCount}</strong> of {products.length} products
            still use an Unsplash stock photo rather than a real LaMa product
            shot. Open one and upload a real image to replace it.
          </p>
        </div>
      )}

      {error && (
        <div
          className="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto shrink-0"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {editing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="mb-6 rounded-md border border-gray-200 bg-white p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900">
              {editing.id === null ? 'New product' : 'Edit product'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setError(null);
              }}
              className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
              aria-label="Cancel"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="product-name" className={labelClass}>
                Name <span className="text-primary">*</span>
              </label>
              <input
                id="product-name"
                value={editing.draft.name}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    draft: { ...editing.draft, name: e.target.value },
                  })
                }
                required
                maxLength={160}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="product-category" className={labelClass}>
                Category
              </label>
              <select
                id="product-category"
                value={editing.draft.category}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    draft: {
                      ...editing.draft,
                      category: e.target.value as Product['category'],
                    },
                  })
                }
                className={inputClass}
              >
                {PRODUCT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="product-price" className={labelClass}>
                Price
              </label>
              <input
                id="product-price"
                value={editing.draft.price ?? ''}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    draft: { ...editing.draft, price: e.target.value },
                  })
                }
                maxLength={40}
                placeholder="$2.49"
                className={inputClass}
              />
            </div>

            <div className="flex items-end">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={editing.draft.featured ?? false}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      draft: { ...editing.draft, featured: e.target.checked },
                    })
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Featured in its category
                </span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="product-description" className={labelClass}>
                Description <span className="text-primary">*</span>
              </label>
              <textarea
                id="product-description"
                value={editing.draft.description}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    draft: { ...editing.draft, description: e.target.value },
                  })
                }
                required
                rows={3}
                maxLength={1000}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <ImageField
                value={editing.draft.image}
                onChange={(url) =>
                  setEditing({
                    ...editing,
                    draft: { ...editing.draft, image: url },
                  })
                }
                folder="products"
                label="Product image"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy === 'save'}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {busy === 'save' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving
                </>
              ) : (
                <>
                  <Save size={18} />
                  {editing.id === null ? 'Create product' : 'Save changes'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setError(null);
              }}
              className="rounded-lg border border-gray-200 px-5 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {(['all', ...PRODUCT_CATEGORIES] as const).map((category) => (
          <button
            key={category}
            onClick={() => setCategoryFilter(category)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-colors ${
              categoryFilter === category
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All' : categoryLabel(category)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.length === 0 && (
          <p className="rounded-md border border-gray-200 bg-white p-8 text-center text-gray-500 md:col-span-2 xl:col-span-3">
            No products in this category.
          </p>
        )}

        {visible.map((product) => (
          <article
            key={product.id}
            className="flex gap-4 rounded-md border border-gray-200 bg-white p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
              <Image
                src={product.image}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-start justify-between gap-2">
                <h3 className="truncate font-bold text-gray-900">
                  {product.name}
                </h3>
                {product.price && (
                  <span className="shrink-0 font-black text-primary">
                    {product.price}
                  </span>
                )}
              </div>

              <p className="mb-2 line-clamp-2 text-xs text-gray-600">
                {product.description}
              </p>

              <div className="mb-2 flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                  {categoryLabel(product.category)}
                </span>
                {isStockPlaceholder(product.image) && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                    Stock photo
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFeatured(product)}
                  disabled={busy === product.id}
                  className={`rounded p-1.5 transition-colors disabled:opacity-50 ${
                    product.featured
                      ? 'text-primary'
                      : 'text-gray-300 hover:text-gray-500'
                  }`}
                  aria-label={
                    product.featured ? 'Remove from featured' : 'Mark featured'
                  }
                  title={
                    product.featured ? 'Remove from featured' : 'Mark featured'
                  }
                >
                  <Star
                    size={16}
                    fill={product.featured ? 'currentColor' : 'none'}
                  />
                </button>

                <button
                  onClick={() =>
                    setEditing({
                      id: product.id,
                      draft: {
                        name: product.name,
                        description: product.description,
                        image: product.image,
                        category: product.category,
                        price: product.price ?? '',
                        featured: product.featured ?? false,
                      },
                    })
                  }
                  className="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  aria-label={`Edit ${product.name}`}
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => remove(product)}
                  disabled={busy === product.id}
                  className="rounded p-1.5 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Delete ${product.name}`}
                >
                  {busy === product.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
