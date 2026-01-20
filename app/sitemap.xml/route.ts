import { NextResponse } from 'next/server';

// Dynamic sitemap.xml route that combines static pages with blog posts
// When you move to a database, uncomment the blog posts section below

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://la-ma-connivence.vercel.app';

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: '1.0', changefreq: 'daily', lastmod: new Date() },
    { url: `${baseUrl}/stores`, priority: '0.9', changefreq: 'weekly', lastmod: new Date() },
    { url: `${baseUrl}/products`, priority: '0.8', changefreq: 'weekly', lastmod: new Date() },
    { url: `${baseUrl}/deals`, priority: '0.9', changefreq: 'daily', lastmod: new Date() },
    { url: `${baseUrl}/media/blog`, priority: '0.8', changefreq: 'daily', lastmod: new Date() },
    { url: `${baseUrl}/about`, priority: '0.5', changefreq: 'monthly', lastmod: new Date() },
    { url: `${baseUrl}/contact`, priority: '0.5', changefreq: 'monthly', lastmod: new Date() },
    { url: `${baseUrl}/careers`, priority: '0.6', changefreq: 'monthly', lastmod: new Date() },
    { url: `${baseUrl}/franchise`, priority: '0.6', changefreq: 'monthly', lastmod: new Date() },
    { url: `${baseUrl}/rewards`, priority: '0.7', changefreq: 'monthly', lastmod: new Date() },
    { url: `${baseUrl}/services`, priority: '0.7', changefreq: 'monthly', lastmod: new Date() },
  ];

  // Start building XML
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Add static pages
  staticPages.forEach((page) => {
    xml += '  <url>\n';
    xml += `    <loc>${page.url}</loc>\n`;
    xml += `    <lastmod>${page.lastmod.toISOString().split('T')[0]}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  // Blog posts - UNCOMMENT WHEN YOU HAVE DATABASE CONNECTION
  // Example implementation:
  /*
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true, publishedAt: true },
      orderBy: { updatedAt: 'desc' },
    });

    blogs.forEach(blog => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/media/blog/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${new Date(blog.updatedAt || blog.publishedAt).toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    });
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }
  */

  // Store pages - UNCOMMENT WHEN YOU HAVE DATABASE CONNECTION
  /*
  try {
    const stores = await prisma.store.findMany({
      select: { id: true, updatedAt: true },
    });

    stores.forEach(store => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/stores/${store.id}</loc>\n`;
      xml += `    <lastmod>${new Date(store.updatedAt).toISOString().split('T')[0]}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.6</priority>\n';
      xml += '  </url>\n';
    });
  } catch (error) {
    console.error('Error fetching stores for sitemap:', error);
  }
  */

  xml += '</urlset>';

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
