/**
 * Seeds the admin accounts. Idempotent: existing rows keep their password and
 * only have name/role/permissions refreshed, so re-running never locks anyone
 * out.
 *
 *   npm run db:seed
 *
 * Passwords come from OWNER_PASSWORD / SUZEE_PASSWORD when set. Otherwise a
 * strong one is generated and printed once — copy it before clearing the
 * terminal, it is not recoverable afterwards.
 */
import { randomBytes } from 'node:crypto';

import bcrypt from 'bcryptjs';
import { eq, sql } from 'drizzle-orm';

import { countWords } from '../lib/blog/types';
import { BLOG_SEED } from '../lib/blogData';
import { JOB_SEED } from '../lib/careersData';
import { isStockPlaceholder } from '../lib/content/imageUpload';
import { getDb } from '../lib/db/client';
import {
  blogs,
  deals,
  drinks,
  faqs,
  heroSlides,
  jobs,
  products,
  siteSettings,
  stores,
  users,
  type AdminSection,
} from '../lib/db/schema';
import { deals as DEAL_SEED } from '../lib/dealsData';
import { drinks as DRINK_SEED } from '../lib/drinksData';
import { products as PRODUCT_SEED } from '../lib/productData';
import { SITE_SETTING_KEYS } from '../lib/settings/keys';
import { FAQ_SEED, HERO_SLIDE_SEED } from '../lib/settings/queries';
import { stores as STORE_SEED } from '../lib/storeData';

const BCRYPT_ROUNDS = 12;

interface SeedAccount {
  email: string;
  name: string;
  role: 'owner' | 'staff';
  permissions: AdminSection[];
  passwordEnvVar: string;
}

const ACCOUNTS: SeedAccount[] = [
  {
    email: process.env.OWNER_EMAIL?.toLowerCase() ?? 'owner@quicktrackinc.com',
    name: process.env.OWNER_NAME ?? 'LaMa Owner',
    role: 'owner',
    permissions: [],
    passwordEnvVar: 'OWNER_PASSWORD',
  },
  {
    email: 'suzee@quicktrackinc.com',
    name: 'Suzee',
    role: 'owner',
    permissions: [],
    passwordEnvVar: 'SUZEE_PASSWORD',
  },
];

function generatePassword() {
  return randomBytes(12).toString('base64url');
}

/**
 * Inserts the seed postings, skipping any slug that already exists so a
 * re-run never overwrites what Suzeze has edited in the admin.
 */
async function seedJobs() {
  const db = getDb();

  for (const job of JOB_SEED) {
    const inserted = await db
      .insert(jobs)
      .values({
        slug: job.slug,
        title: job.title,
        department: job.department,
        location: job.location,
        employmentType: job.employmentType,
        status: job.status,
        payRange: job.payRange,
        summary: job.summary,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        postedAt: job.postedAt,
      })
      .onConflictDoNothing({ target: jobs.slug })
      .returning({ id: jobs.id });

    console.log(
      inserted.length > 0
        ? `created  job ${job.slug}`
        : `skipped  job ${job.slug} (already exists)`,
    );
  }
}

/**
 * Content tables are seeded only when empty. Once the admin owns the data, a
 * re-run must never resurrect deleted rows or revert edits.
 */
async function seedContent() {
  const db = getDb();

  const [existingDeals] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(deals);

  if (existingDeals.count === 0) {
    await db.insert(deals).values(
      DEAL_SEED.map((deal) => ({
        id: deal.id,
        title: deal.title,
        description: deal.description,
        image: deal.image,
        category: deal.category,
        savings: deal.savings,
        expirationDate: deal.expirationDate ?? null,
        featured: deal.featured ?? false,
        displayName: deal.displayName ?? null,
        homepageOrder: deal.homepageOrder ?? null,
        price: deal.price !== undefined ? String(deal.price) : null,
        originalPrice:
          deal.originalPrice !== undefined ? String(deal.originalPrice) : null,
        stockLeft: deal.stockLeft ?? null,
      })),
    );
    // Explicit ids were inserted, so bump the sequence past them.
    await db.execute(
      sql`SELECT setval('deals_id_seq', (SELECT COALESCE(MAX(id), 1) FROM deals))`,
    );
    console.log(`created  ${DEAL_SEED.length} deals`);
  } else {
    console.log(`skipped  deals (${existingDeals.count} already present)`);
  }

  const [existingDrinks] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(drinks);

  if (existingDrinks.count === 0) {
    await db.insert(drinks).values(
      DRINK_SEED.map((drink) => ({
        id: drink.id,
        title: drink.title,
        description: drink.description,
        image: drink.image,
        category: drink.category,
        savings: drink.savings,
        expirationDate: drink.expirationDate ?? null,
        featured: drink.featured ?? false,
        price: drink.price ?? null,
      })),
    );
    await db.execute(
      sql`SELECT setval('drinks_id_seq', (SELECT COALESCE(MAX(id), 1) FROM drinks))`,
    );
    console.log(`created  ${DRINK_SEED.length} drinks`);
  } else {
    console.log(`skipped  drinks (${existingDrinks.count} already present)`);
  }

  const [existingStores] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(stores);

  if (existingStores.count === 0) {
    await db.insert(stores).values(
      STORE_SEED.map((store) => ({
        id: store.id,
        name: store.name,
        address: store.address,
        lat: store.lat,
        lng: store.lng,
        phone: store.phone,
        hours: store.hours,
        city: store.city ?? null,
        state: store.state ?? null,
        zip: store.zip ?? null,
        category: store.category ?? null,
        hoursVerified: store.hoursVerified ?? false,
        phoneVerified: store.phoneVerified ?? false,
        addressComplete: store.addressComplete ?? true,
      })),
    );
    await db.execute(
      sql`SELECT setval('stores_id_seq', (SELECT COALESCE(MAX(id), 1) FROM stores))`,
    );
    console.log(`created  ${STORE_SEED.length} stores`);
  } else {
    console.log(`skipped  stores (${existingStores.count} already present)`);
  }

  const [existingProducts] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);

  if (existingProducts.count === 0) {
    const rows = PRODUCT_SEED.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      category: product.category,
      price: product.price ?? null,
      featured: product.featured ?? false,
    }));

    await db.insert(products).values(rows);
    await db.execute(
      sql`SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM products))`,
    );

    const placeholders = rows.filter((row) =>
      isStockPlaceholder(row.image),
    ).length;
    console.log(
      `created  ${rows.length} products (${placeholders} still on stock photos)`,
    );
  } else {
    console.log(`skipped  products (${existingProducts.count} already present)`);
  }

  const [existingBlogs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(blogs);

  if (existingBlogs.count === 0) {
    await db.insert(blogs).values(
      BLOG_SEED.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: 'published' as const,
        publishedAt: new Date(post.publishedAt),
        author: post.author,
        featuredImage: post.featuredImage,
        wordCount: countWords(post.content),
      })),
    );
    console.log(`created  ${BLOG_SEED.length} blog posts`);
  } else {
    console.log(`skipped  blog posts (${existingBlogs.count} already present)`);
  }

  const [existingFaqs] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(faqs);

  if (existingFaqs.count === 0) {
    await db.insert(faqs).values(
      FAQ_SEED.map((item, index) => ({
        section: 'rewards',
        question: item.question,
        answer: item.answer,
        sortOrder: index,
      })),
    );
    console.log(`created  ${FAQ_SEED.length} FAQs`);
  } else {
    console.log(`skipped  FAQs (${existingFaqs.count} already present)`);
  }

  const [existingSlides] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(heroSlides);

  if (existingSlides.count === 0) {
    await db.insert(heroSlides).values(
      HERO_SLIDE_SEED.map((slide) => ({
        italicText: slide.italicText,
        headline: slide.headline,
        bodyText: slide.bodyText,
        image: slide.image,
        alt: slide.alt,
        ctaText: slide.ctaText,
        ctaLink: slide.ctaLink,
        priceAmount: slide.priceAmount,
        priceLabel: slide.priceLabel,
        sortOrder: slide.sortOrder,
        published: true,
      })),
    );
    console.log(`created  ${HERO_SLIDE_SEED.length} hero slides`);
  } else {
    console.log(`skipped  hero slides (${existingSlides.count} already present)`);
  }

  // Settings keys are created empty so the admin form always has something to
  // edit. Real phone/email/socials are not known yet — leave them blank.
  await db
    .insert(siteSettings)
    .values(SITE_SETTING_KEYS.map((key) => ({ key, value: '' })))
    .onConflictDoNothing();
  console.log(`ensured  ${SITE_SETTING_KEYS.length} site_settings keys`);
}

async function main() {
  const db = getDb();
  const generated: Array<{ email: string; password: string }> = [];

  for (const account of ACCOUNTS) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, account.email))
      .limit(1);

    if (existing) {
      await db
        .update(users)
        .set({
          name: account.name,
          role: account.role,
          permissions: account.permissions,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id));

      console.log(`updated  ${account.email} (${account.role}) — password unchanged`);
      continue;
    }

    const password = process.env[account.passwordEnvVar] ?? generatePassword();
    if (!process.env[account.passwordEnvVar]) {
      generated.push({ email: account.email, password });
    }

    await db.insert(users).values({
      email: account.email,
      name: account.name,
      role: account.role,
      permissions: account.permissions,
      passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS),
    });

    console.log(`created  ${account.email} (${account.role})`);
  }

  await seedJobs();
  await seedContent();

  if (generated.length > 0) {
    console.log('\nGenerated passwords — shown once, store them now:');
    for (const { email, password } of generated) {
      console.log(`  ${email}  ${password}`);
    }
  }

  console.log(
    '\nSeed complete. The ADMIN_PASSWORD bootstrap login is now disabled; sign in with an email.',
  );
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
