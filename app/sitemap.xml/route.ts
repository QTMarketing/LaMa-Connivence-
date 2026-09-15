import { NextResponse } from 'next/server';

import { getPublishedBlogSlugs } from '@/lib/blog/queries';
import { PRODUCT_CATEGORIES } from '@/lib/products/categories';
import { getAllStores } from '@/lib/stores/queries';

interface SitemapUrl {
  loc: string;
  lastmod: Date;
  changefreq: string;
  priority: string;
}

function renderUrl({ loc, lastmod, changefreq, priority }: SitemapUrl) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod.toISOString().split('T')[0]}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://la-ma-connivence.vercel.app';
  const now = new Date();

  const urls: SitemapUrl[] = [
    { loc: baseUrl, lastmod: now, changefreq: 'daily', priority: '1.0' },
    { loc: `${baseUrl}/stores`, lastmod: now, changefreq: 'weekly', priority: '0.9' },
    { loc: `${baseUrl}/deals`, lastmod: now, changefreq: 'daily', priority: '0.9' },
    { loc: `${baseUrl}/drinks`, lastmod: now, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/products`, lastmod: now, changefreq: 'weekly', priority: '0.8' },
    { loc: `${baseUrl}/media/blog`, lastmod: now, changefreq: 'daily', priority: '0.8' },
    { loc: `${baseUrl}/services`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/rewards`, lastmod: now, changefreq: 'monthly', priority: '0.7' },
    { loc: `${baseUrl}/careers`, lastmod: now, changefreq: 'weekly', priority: '0.6' },
    { loc: `${baseUrl}/franchise`, lastmod: now, changefreq: 'monthly', priority: '0.6' },
    { loc: `${baseUrl}/about`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
    { loc: `${baseUrl}/contact`, lastmod: now, changefreq: 'monthly', priority: '0.5' },
  ];

  for (const category of PRODUCT_CATEGORIES) {
    urls.push({
      loc: `${baseUrl}/products/${category.slug}`,
      lastmod: now,
      changefreq: 'weekly',
      priority: '0.7',
    });
  }

  // A failed query here would drop every dynamic URL from the sitemap, so each
  // section is isolated and the static pages always ship.
  try {
    for (const post of await getPublishedBlogSlugs()) {
      urls.push({
        loc: `${baseUrl}/media/blog/${post.slug}`,
        lastmod: post.updatedAt,
        changefreq: 'weekly',
        priority: '0.7',
      });
    }
  } catch (error) {
    console.error('[sitemap] Could not list blog posts:', error);
  }

  try {
    for (const store of await getAllStores()) {
      urls.push({
        loc: `${baseUrl}/stores/${store.id}`,
        lastmod: now,
        changefreq: 'monthly',
        priority: '0.6',
      });
    }
  } catch (error) {
    console.error('[sitemap] Could not list stores:', error);
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(renderUrl),
    '</urlset>',
  ].join('\n');

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
