import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  doublePrecision,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

/**
 * Admin sections a staff user can be granted. `owner` implicitly has all of
 * them; a `staff` user only has what is listed in `users.permissions`.
 *
 * Suzeze starts with ['careers']. Widening her access later is an UPDATE on one
 * row, not a code change.
 */
export const ADMIN_SECTIONS = [
  'careers',
  'deals',
  'drinks',
  'stores',
  'products',
  'blog',
  'settings',
] as const;

export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export const userRoleEnum = pgEnum('user_role', ['owner', 'staff']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull().default('staff'),
  /** Section slugs from ADMIN_SECTIONS. Ignored when role is 'owner'. */
  permissions: text('permissions').array().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// ---------------------------------------------------------------------------
// Careers
// ---------------------------------------------------------------------------

export const employmentTypeEnum = pgEnum('employment_type', [
  'Full-time',
  'Part-time',
  'Full-time / Part-time',
]);

export const jobStatusEnum = pgEnum('job_status', ['draft', 'open', 'closed']);

/**
 * Where a posting is hiring: the whole chain, one or more regions, or specific
 * stores. Join tables (job_regions / job_stores) hold the selections.
 */
export const locationScopeEnum = pgEnum('location_scope', [
  'chain',
  'region',
  'store',
]);

export const regions = pgTable('regions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const jobs = pgTable(
  'jobs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    department: text('department').notNull(),
    /**
     * Display label for public cards — auto-filled from scope selection
     * (e.g. "Texas · Louisiana", a store name, or "All locations").
     */
    location: text('location').notNull(),
    locationScope: locationScopeEnum('location_scope')
      .notNull()
      .default('chain'),
    employmentType: employmentTypeEnum('employment_type')
      .notNull()
      .default('Full-time'),
    status: jobStatusEnum('status').notNull().default('draft'),
    /** Null until a real range is confirmed — never show an invented number. */
    payRange: text('pay_range'),
    summary: text('summary').notNull(),
    responsibilities: jsonb('responsibilities')
      .$type<string[]>()
      .notNull()
      .default([]),
    requirements: jsonb('requirements').$type<string[]>().notNull().default([]),
    postedAt: date('posted_at', { mode: 'string' }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('jobs_status_idx').on(table.status)],
);

export const jobRegions = pgTable(
  'job_regions',
  {
    jobId: uuid('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    regionId: uuid('region_id')
      .notNull()
      .references(() => regions.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.jobId, table.regionId] }),
    index('job_regions_region_id_idx').on(table.regionId),
  ],
);

/** Populated when location_scope = 'store'. Defined before stores via lazy FK. */
export const jobStores = pgTable(
  'job_stores',
  {
    jobId: uuid('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    storeId: integer('store_id')
      .notNull()
      .references(() => stores.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.jobId, table.storeId] }),
    index('job_stores_store_id_idx').on(table.storeId),
  ],
);

export const applicationStatusEnum = pgEnum('application_status', [
  'new',
  'reviewing',
  'interviewing',
  'rejected',
  'hired',
]);

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /**
     * Nulled rather than cascaded when a posting is deleted: an application is
     * a record of a real person applying and must outlive the job ad.
     */
    jobId: uuid('job_id').references(() => jobs.id, { onDelete: 'set null' }),
    /** Snapshot, so a deleted or renamed posting still reads correctly. */
    jobTitle: text('job_title').notNull(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    phone: text('phone').notNull(),
    coverLetter: text('cover_letter'),
    /**
     * Vercel Blob URLs are unguessable but publicly reachable and have no
     * private ACL, so this must never be sent to the browser. Downloads go
     * through /api/admin/applications/[id]/cv instead.
     */
    cvBlobUrl: text('cv_blob_url'),
    cvFilename: text('cv_filename'),
    cvContentType: text('cv_content_type'),
    cvSize: integer('cv_size'),
    /**
     * Store the candidate prefers / scanned a QR for. Survives store deletion
     * as null; job_title snapshot still identifies the role.
     */
    preferredStoreId: integer('preferred_store_id').references(() => stores.id, {
      onDelete: 'set null',
    }),
    status: applicationStatusEnum('status').notNull().default('new'),
    /** Internal notes from whoever is reviewing. */
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('applications_job_id_idx').on(table.jobId),
    index('applications_status_idx').on(table.status),
    index('applications_created_at_idx').on(table.createdAt),
    index('applications_preferred_store_id_idx').on(table.preferredStoreId),
  ],
);

export const jobsRelations = relations(jobs, ({ many }) => ({
  applications: many(applications),
  jobRegions: many(jobRegions),
  jobStores: many(jobStores),
}));

export const regionsRelations = relations(regions, ({ many }) => ({
  stores: many(stores),
  jobRegions: many(jobRegions),
}));

export const jobRegionsRelations = relations(jobRegions, ({ one }) => ({
  job: one(jobs, { fields: [jobRegions.jobId], references: [jobs.id] }),
  region: one(regions, {
    fields: [jobRegions.regionId],
    references: [regions.id],
  }),
}));

export const jobStoresRelations = relations(jobStores, ({ one }) => ({
  job: one(jobs, { fields: [jobStores.jobId], references: [jobs.id] }),
  store: one(stores, { fields: [jobStores.storeId], references: [stores.id] }),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  job: one(jobs, {
    fields: [applications.jobId],
    references: [jobs.id],
  }),
  preferredStore: one(stores, {
    fields: [applications.preferredStoreId],
    references: [stores.id],
  }),
}));

export type Region = typeof regions.$inferSelect;
export type NewRegion = typeof regions.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

// ---------------------------------------------------------------------------
// Deals
// ---------------------------------------------------------------------------

/**
 * All seven categories the Deal type always declared. The old admin dropdown
 * only offered four, and three of those ('meal-deals', 'daily-specials',
 * 'weekly-promotions') triggered the homepage cache purge, so every promo
 * created through the UI destroyed itself. The enum, the admin form and the
 * data now agree on one list.
 */
export const dealCategoryEnum = pgEnum('deal_category', [
  'meal-deals',
  'daily-specials',
  'weekly-promotions',
  'grill-items',
  'mix-and-match',
  'best-value',
  'combo-offers',
]);

export const deals = pgTable(
  'deals',
  {
    // Serial rather than uuid so existing /deals/[id] links keep working.
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    image: text('image').notNull(),
    category: dealCategoryEnum('category').notNull(),
    savings: text('savings').notNull(),
    expirationDate: date('expiration_date', { mode: 'string' }),
    featured: boolean('featured').notNull().default(false),
    /** Overrides the title on homepage promo cards. */
    displayName: text('display_name'),
    homepageOrder: integer('homepage_order'),
    price: numeric('price', { precision: 10, scale: 2 }),
    originalPrice: numeric('original_price', { precision: 10, scale: 2 }),
    stockLeft: integer('stock_left'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('deals_category_idx').on(table.category),
    index('deals_featured_idx').on(table.featured),
  ],
);

export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;

// ---------------------------------------------------------------------------
// Drinks
// ---------------------------------------------------------------------------

export const drinkCategoryEnum = pgEnum('drink_category', [
  'buy-2-save',
  'discounted',
  'seasonal',
]);

export const drinks = pgTable(
  'drinks',
  {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    image: text('image').notNull(),
    category: drinkCategoryEnum('category').notNull(),
    savings: text('savings').notNull(),
    expirationDate: date('expiration_date', { mode: 'string' }),
    featured: boolean('featured').notNull().default(false),
    /** Free text because it is displayed verbatim, e.g. "$4.99". */
    price: text('price'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('drinks_category_idx').on(table.category)],
);

export type Drink = typeof drinks.$inferSelect;
export type NewDrink = typeof drinks.$inferInsert;

// ---------------------------------------------------------------------------
// Stores
// ---------------------------------------------------------------------------

export const stores = pgTable(
  'stores',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address').notNull(),
    lat: doublePrecision('lat').notNull(),
    lng: doublePrecision('lng').notNull(),
    /** Empty string when not recovered. 8 of 96 are real. */
    phone: text('phone').notNull().default(''),
    /** "Call to confirm" until confirmed. Never invent hours. */
    hours: text('hours').notNull().default('Call to confirm'),
    city: text('city'),
    state: text('state'),
    zip: text('zip'),
    category: text('category'),
    /** Hiring / ops region; null until HR assigns one. */
    regionId: uuid('region_id').references(() => regions.id, {
      onDelete: 'set null',
    }),
    /**
     * Data-quality workflow, deliberately preserved: the store rows came from a
     * 2023 Wayback snapshot, so each field needs confirming before anyone
     * relies on it.
     */
    hoursVerified: boolean('hours_verified').notNull().default(false),
    phoneVerified: boolean('phone_verified').notNull().default(false),
    addressComplete: boolean('address_complete').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('stores_state_idx').on(table.state),
    index('stores_region_id_idx').on(table.regionId),
  ],
);

export const storesRelations = relations(stores, ({ one, many }) => ({
  region: one(regions, {
    fields: [stores.regionId],
    references: [regions.id],
  }),
  jobStores: many(jobStores),
  applications: many(applications),
}));

export type Store = typeof stores.$inferSelect;
export type NewStore = typeof stores.$inferInsert;

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export const productCategoryEnum = pgEnum('product_category', [
  'hot-beverages',
  'fresh-food',
  'cold-drinks',
  'snacks',
  'grocery',
  'services',
]);

export const products = pgTable(
  'products',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    image: text('image').notNull(),
    category: productCategoryEnum('category').notNull(),
    /** Free text because it is displayed verbatim, e.g. "$2.49". */
    price: text('price'),
    featured: boolean('featured').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('products_category_idx').on(table.category)],
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * 'scheduled' exists because the editor offers it, but nothing promotes a
 * scheduled post to published yet, so the public queries treat it as unpublished.
 */
export const blogStatusEnum = pgEnum('blog_status', [
  'draft',
  'published',
  'scheduled',
  'trash',
]);

/**
 * Mirrors the old localStorage BlogPost, minus the fields nothing ever read:
 * seoScore and readabilityScore (recomputed live in the editor), schemaType and
 * schemaData (no JSON-LD is emitted anywhere), pageBuilderData (the editor
 * imported PageBuilder but never rendered it) and authorId (author is free text,
 * not a users FK).
 */
export const blogs = pgTable(
  'blogs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    content: text('content').notNull().default(''),
    excerpt: text('excerpt'),
    status: blogStatusEnum('status').notNull().default('draft'),
    /** Set the first time a post is published; kept on later edits. */
    publishedAt: timestamp('published_at', { withTimezone: true }),
    author: text('author').notNull().default('LaMa Team'),
    featuredImage: text('featured_image'),

    seoTitle: text('seo_title'),
    seoDescription: text('seo_description'),
    focusKeyword: text('focus_keyword'),
    canonicalUrl: text('canonical_url'),

    ogTitle: text('og_title'),
    ogDescription: text('og_description'),
    ogImage: text('og_image'),
    twitterTitle: text('twitter_title'),
    twitterDescription: text('twitter_description'),
    twitterImage: text('twitter_image'),

    robotsIndex: boolean('robots_index').notNull().default(true),
    robotsFollow: boolean('robots_follow').notNull().default(true),
    robotsNoArchive: boolean('robots_no_archive').notNull().default(false),
    robotsNoSnippet: boolean('robots_no_snippet').notNull().default(false),

    wordCount: integer('word_count').notNull().default(0),

    categoryId: uuid('category_id').references(() => categories.id, {
      onDelete: 'set null',
    }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('blogs_status_idx').on(table.status),
    index('blogs_published_at_idx').on(table.publishedAt),
    index('blogs_category_id_idx').on(table.categoryId),
  ],
);

export const blogTags = pgTable(
  'blog_tags',
  {
    blogId: uuid('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.blogId, table.tagId] }),
    index('blog_tags_tag_id_idx').on(table.tagId),
  ],
);

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  category: one(categories, {
    fields: [blogs.categoryId],
    references: [categories.id],
  }),
  blogTags: many(blogTags),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  blogs: many(blogs),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  blogTags: many(blogTags),
}));

export const blogTagsRelations = relations(blogTags, ({ one }) => ({
  blog: one(blogs, { fields: [blogTags.blogId], references: [blogs.id] }),
  tag: one(tags, { fields: [blogTags.tagId], references: [tags.id] }),
}));

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type Tag = typeof tags.$inferSelect;

// ---------------------------------------------------------------------------
// Site settings, FAQs, homepage hero
// ---------------------------------------------------------------------------

/**
 * Key/value bag for the handful of contact details and social URLs that used
 * to be hardcoded (or missing). Keys are known strings in lib/settings/keys.ts;
 * values are free text, empty until the admin fills them in.
 */
export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull().default(''),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const faqs = pgTable(
  'faqs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    /** Groups FAQs by page; only 'rewards' ships today. */
    section: text('section').notNull().default('rewards'),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('faqs_section_idx').on(table.section),
    index('faqs_sort_order_idx').on(table.sortOrder),
  ],
);

export const heroSlides = pgTable(
  'hero_slides',
  {
    id: serial('id').primaryKey(),
    italicText: text('italic_text').notNull(),
    headline: text('headline').notNull(),
    bodyText: text('body_text').notNull(),
    image: text('image').notNull(),
    alt: text('alt').notNull(),
    ctaText: text('cta_text').notNull(),
    ctaLink: text('cta_link').notNull(),
    /** Optional price burst on the campaign band, e.g. "$3.99". */
    priceAmount: text('price_amount'),
    priceLabel: text('price_label'),
    sortOrder: integer('sort_order').notNull().default(0),
    published: boolean('published').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('hero_slides_sort_order_idx').on(table.sortOrder)],
);

export type SiteSetting = typeof siteSettings.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type HeroSlide = typeof heroSlides.$inferSelect;
