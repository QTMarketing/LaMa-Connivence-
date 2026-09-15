import { redirect } from 'next/navigation';

import AdminShell from '@/components/admin/AdminShell';
import DatabaseNotice, {
  DB_UNCONFIGURED_MESSAGE,
  DB_UNREACHABLE_MESSAGE,
} from '@/components/admin/DatabaseNotice';
import { getSession } from '@/lib/auth/server';
import { canAccessSection } from '@/lib/auth/session';
import { isDatabaseConfigured } from '@/lib/db/client';
import { ADMIN_SECTIONS } from '@/lib/db/schema';
import type { Product } from '@/lib/productData';
import { adminListProducts } from '@/lib/products/queries';

import ProductsAdmin from './ProductsAdmin';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const session = await getSession();
  if (!session) redirect('/admin/login?next=/admin/products');
  if (!canAccessSection(session, 'products')) redirect('/admin?denied=products');

  const sections =
    session.role === 'owner' ? [...ADMIN_SECTIONS] : session.permissions;

  let products: Product[] = [];
  let loadError: string | null = null;

  if (!isDatabaseConfigured()) {
    loadError = DB_UNCONFIGURED_MESSAGE;
  } else {
    try {
      products = (await adminListProducts()).map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        image: row.image,
        category: row.category,
        price: row.price ?? undefined,
        featured: row.featured,
      }));
    } catch (error) {
      console.error('[admin-products] Load failed:', error);
      loadError = DB_UNREACHABLE_MESSAGE;
    }
  }

  return (
    <AdminShell
      sections={sections}
      userName={session.name || session.email}
      activePath="/admin/products"
      showDashboard={session.role === 'owner'}
    >
      {loadError ? (
        <DatabaseNotice section="Products" message={loadError} />
      ) : (
        <ProductsAdmin initialProducts={products} />
      )}
    </AdminShell>
  );
}
