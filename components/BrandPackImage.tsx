'use client';

import Image from 'next/image';
import { useState } from 'react';
import { BRAND_IMAGE_FALLBACK, brandImageSrc } from '@/lib/brandImages';

export default function BrandPackImage({
  brand,
  alt,
  sizes = '(max-width: 768px) 100vw, 33vw',
  className = 'object-contain',
}: {
  brand: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const primary = brandImageSrc(brand);
  const [src, setSrc] = useState(primary);

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      onError={() => {
        if (src !== BRAND_IMAGE_FALLBACK) setSrc(BRAND_IMAGE_FALLBACK);
      }}
    />
  );
}
