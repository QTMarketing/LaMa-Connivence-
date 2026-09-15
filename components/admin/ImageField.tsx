'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { AlertTriangle, Loader2, Upload } from 'lucide-react';

import {
  IMAGE_ACCEPT_ATTRIBUTE,
  MAX_IMAGE_LABEL,
  isStockPlaceholder,
} from '@/lib/content/imageUpload';
import type { AdminSection } from '@/lib/db/schema';

interface ImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  /** Blob folder, also used to authorise the upload server-side. */
  folder: AdminSection;
  label?: string;
}

export default function ImageField({
  value,
  onChange,
  folder,
  label = 'Image',
}: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);

    const body = new FormData();
    body.set('file', file);
    body.set('folder', folder);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data.error === 'string' ? data.error : 'Upload failed.',
        );
        return;
      }

      onChange(data.url);
    } catch (err) {
      console.error('[image-field] Upload failed:', err);
      setError('Could not reach the server.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <div className="flex items-start gap-4">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {value ? (
            <Image
              src={value}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-gray-400">
              None
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/campaign/example.webp or https://..."
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none"
            aria-label={`${label} path`}
          />

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Uploading
                </>
              ) : (
                <>
                  <Upload size={15} />
                  Upload
                </>
              )}
            </button>
            <span className="text-xs text-gray-500">
              JPEG, PNG, WebP or AVIF up to {MAX_IMAGE_LABEL}
            </span>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={IMAGE_ACCEPT_ATTRIBUTE}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          {isStockPlaceholder(value) && (
            <p className="mt-2 flex items-start gap-2 text-xs font-semibold text-amber-700">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              Stock placeholder, not a real LaMa product. Upload a real photo to
              replace it.
            </p>
          )}

          {error && (
            <p className="mt-2 text-xs font-semibold text-red-600" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
