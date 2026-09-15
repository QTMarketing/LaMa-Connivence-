import { NextResponse } from 'next/server';

import { requireSection } from '@/lib/auth/server';
import { apiFailure } from '@/lib/content/adminQueries';
import { parseProduct } from '@/lib/content/validation';
import { getDb } from '@/lib/db/client';
import { products } from '@/lib/db/schema';
import { adminListProducts } from '@/lib/products/queries';

export async function GET() {
  const guard = await requireSection('products');
  if (guard instanceof NextResponse) return guard;

  try {
    return NextResponse.json({ products: await adminListProducts() });
  } catch (error) {
    return apiFailure('admin-products-list', error, 'Could not load products.');
  }
}

export async function POST(request: Request) {
  const guard = await requireSection('products');
  if (guard instanceof NextResponse) return guard;

  const parsed = parseProduct(await request.json().catch(() => null));
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const [created] = await getDb()
      .insert(products)
      .values(parsed.value)
      .returning({ id: products.id });
    return NextResponse.json({ product: created }, { status: 201 });
  } catch (error) {
    return apiFailure(
      'admin-products-create',
      error,
      'Could not create the product.',
    );
  }
}
