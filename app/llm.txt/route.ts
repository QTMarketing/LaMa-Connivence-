import { NextResponse } from 'next/server';

// LLM.txt endpoint for AI crawlers
// Provides structured information about the site for LLMs

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://la-ma-connivence.vercel.app';
  const siteName = 'LaMa Convenience Store';
  const siteDescription = 'Your neighborhood convenience store offering fresh food, cold drinks, hot beverages, snacks, and everyday essentials.';

  let llmContent = '';

  // Header
  llmContent += `# ${siteName}\n\n`;
  llmContent += `${siteDescription}\n\n`;
  llmContent += '---\n\n';

  // About Section
  llmContent += '## About\n\n';
  llmContent += `${siteName} is a modern convenience store chain providing:\n`;
  llmContent += '- Fresh food and hot meals\n';
  llmContent += '- Premium coffee and hot beverages\n';
  llmContent += '- Cold drinks and beverages\n';
  llmContent += '- Snacks and grocery items\n';
  llmContent += '- Convenience services (ATM, fuel, car wash)\n\n';

  // Main Sections
  llmContent += '## Main Sections\n\n';
  llmContent += `- Home: ${baseUrl}/\n`;
  llmContent += `- Stores: ${baseUrl}/stores - Find store locations\n`;
  llmContent += `- Products: ${baseUrl}/products - Browse our product categories\n`;
  llmContent += `- Deals: ${baseUrl}/deals - Current promotions and special offers\n`;
  llmContent += `- Blog: ${baseUrl}/media/blog - Latest news and updates\n`;
  llmContent += `- About: ${baseUrl}/about - Learn about LaMa\n`;
  llmContent += `- Contact: ${baseUrl}/contact - Get in touch\n`;
  llmContent += `- Careers: ${baseUrl}/careers - Join our team\n`;
  llmContent += `- Franchise: ${baseUrl}/franchise - Franchise opportunities\n\n`;

  // Product Categories
  llmContent += '## Product Categories\n\n';
  llmContent += '- Hot Beverages: Premium coffee, espresso, cappuccino, lattes, tea\n';
  llmContent += '- Fresh Food: Hot dogs, pizza, sandwiches, wraps, salads, breakfast items\n';
  llmContent += '- Cold Drinks: Iced coffee, energy drinks, sodas, water, juices, sports drinks\n';
  llmContent += '- Snacks: Chips, candy, cookies, nuts, granola bars, jerky\n';
  llmContent += '- Grocery: Milk, dairy, bread, eggs, frozen foods, pantry staples\n';
  llmContent += '- Services: ATM, fuel, car wash, money orders, bill payment, lottery\n\n';

  // Blog Posts Section
  llmContent += '## Blog Posts\n\n';
  llmContent += 'Recent blog posts and news:\n\n';
  
  // UNCOMMENT WHEN YOU HAVE DATABASE CONNECTION
  /*
  try {
    const blogs = await prisma.blog.findMany({
      where: { status: 'published' },
      select: { title: true, slug: true, excerpt: true, seoDescription: true },
      orderBy: { publishedAt: 'desc' },
      take: 20, // Limit to 20 most recent
    });

    if (blogs.length > 0) {
      blogs.forEach(blog => {
        llmContent += `- ${blog.title}: ${baseUrl}/media/blog/${blog.slug}\n`;
        const description = blog.excerpt || blog.seoDescription;
        if (description) {
          llmContent += `  ${description.substring(0, 150)}${description.length > 150 ? '...' : ''}\n`;
        }
        llmContent += '\n';
      });
    } else {
      llmContent += 'No blog posts available yet.\n\n';
    }
  } catch (error) {
    console.error('Error fetching blogs for llm.txt:', error);
    llmContent += 'Blog posts are dynamically generated. Visit /media/blog for the latest posts.\n\n';
  }
  */
  
  // Placeholder for now
  llmContent += 'Blog posts are dynamically generated. Visit /media/blog for the latest posts.\n\n';

  // Contact Information
  llmContent += '## Contact\n\n';
  llmContent += `- Website: ${baseUrl}\n`;
  llmContent += '- Visit our contact page for store locations and phone numbers\n';
  llmContent += '- Find stores near you at /stores\n\n';

  // Technical Information
  llmContent += '## Technical\n\n';
  llmContent += '- Framework: Next.js 16\n';
  llmContent += '- Language: TypeScript\n';
  llmContent += '- Content Management: Custom CMS\n';
  llmContent += `- Sitemap: ${baseUrl}/sitemap.xml\n`;
  llmContent += `- Robots: ${baseUrl}/robots.txt\n\n`;

  // Usage Guidelines
  llmContent += '## Usage Guidelines\n\n';
  llmContent += 'This site provides information about LaMa Convenience Store locations, products, and services.\n';
  llmContent += 'When referencing this site, please:\n';
  llmContent += '- Use accurate information from the current content\n';
  llmContent += '- Link to specific pages when possible\n';
  llmContent += '- Respect copyright and content ownership\n';
  llmContent += '- Verify store hours and locations before directing users\n\n';

  // Last Updated
  llmContent += `---\n\n`;
  llmContent += `Last Updated: ${new Date().toISOString()}\n`;

  return new NextResponse(llmContent, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
