import { NextResponse } from 'next/server';

// Dynamic robots.txt route
// This provides more control than the static robots.ts file

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://la-ma-connivence.vercel.app';
  const isProduction = process.env.NODE_ENV === 'production';

  let robotsTxt = '';

  // Default rules for all bots
  robotsTxt += 'User-agent: *\n';
  robotsTxt += 'Allow: /\n';
  robotsTxt += 'Disallow: /admin/\n';
  robotsTxt += 'Disallow: /api/\n';
  robotsTxt += 'Disallow: /admin/*\n';
  robotsTxt += 'Disallow: *.json\n';
  robotsTxt += '\n';

  // Googlebot specific rules
  robotsTxt += 'User-agent: Googlebot\n';
  robotsTxt += 'Allow: /\n';
  robotsTxt += 'Disallow: /admin/\n';
  robotsTxt += 'Disallow: /api/\n';
  robotsTxt += '\n';

  // Bingbot specific rules
  robotsTxt += 'User-agent: Bingbot\n';
  robotsTxt += 'Allow: /\n';
  robotsTxt += 'Disallow: /admin/\n';
  robotsTxt += 'Disallow: /api/\n';
  robotsTxt += '\n';

  // Block AI crawlers if not in production (optional)
  if (!isProduction) {
    robotsTxt += 'User-agent: GPTBot\n';
    robotsTxt += 'Disallow: /\n';
    robotsTxt += '\n';
    robotsTxt += 'User-agent: ChatGPT-User\n';
    robotsTxt += 'Disallow: /\n';
    robotsTxt += '\n';
    robotsTxt += 'User-agent: CCBot\n';
    robotsTxt += 'Disallow: /\n';
    robotsTxt += '\n';
    robotsTxt += 'User-agent: anthropic-ai\n';
    robotsTxt += 'Disallow: /\n';
    robotsTxt += '\n';
    robotsTxt += 'User-agent: Claude-Web\n';
    robotsTxt += 'Disallow: /\n';
    robotsTxt += '\n';
  }

  // Sitemap location
  robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
