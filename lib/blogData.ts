import type { BlogView } from '@/lib/blog/types';

/**
 * Seed data only. Reads live in lib/blog/queries.ts and go to Postgres; this
 * array is what the seeder inserts and what public pages fall back to when the
 * database is unreachable.
 *
 * Ids are the deterministic uuids the seeder uses, so a fallback render and a
 * live render produce the same React keys.
 */
export const BLOG_SEED: BlogView[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    slug: 'grand-opening-downtown',
    title: 'Grand Opening in Downtown',
    excerpt:
      "We're excited to announce our newest location serving the downtown community. Come visit us for exclusive opening deals!",
    content: `
      <p>We are thrilled to open our doors in the heart of downtown! Our new store features a state-of-the-art coffee bar, a wide selection of fresh grab-and-go meals, and all your favorite snacks.</p>
      <p>Join us this weekend for our grand opening celebration, featuring:</p>
      <ul>
        <li>Free coffee for the first 100 customers</li>
        <li>Exclusive giveaways and merchandise</li>
        <li>Special discounts on fuel and car washes</li>
      </ul>
      <p>We can't wait to serve you and become a part of this vibrant community. See you there!</p>
    `,
    featuredImage:
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1600&h=900&fit=crop',
    author: 'LaMa Team',
    publishedAt: '2025-11-20T00:00:00.000Z',
    category: null,
    tags: [],
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    slug: 'perfect-brew-guide',
    title: 'The Perfect Brew Guide',
    excerpt:
      'Discover the secrets behind our signature coffee blend and how we ensure every cup is fresh and delicious.',
    content: `
      <p>At LaMa Convenience, coffee is more than just a drink; it's a ritual. We source our beans from sustainable farms and roast them to perfection.</p>
      <h3>Our Process</h3>
      <p>Our baristas are trained to brew every cup with care, ensuring you get the perfect start to your day. We use a precise water-to-coffee ratio and control the temperature to extract the optimal flavor profile.</p>
      <p>Stop by and taste the difference for yourself!</p>
    `,
    featuredImage:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&h=900&fit=crop',
    author: 'Head Barista',
    publishedAt: '2025-11-18T00:00:00.000Z',
    category: null,
    tags: [],
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    slug: 'community-first',
    title: 'Community First Initiative',
    excerpt:
      'LaMa Convenience is committed to giving back. Learn about our recent charity drive and local partnerships.',
    content: `
      <p>We believe in supporting the communities that support us. This month, we launched our Community First Initiative, partnering with local food banks and shelters to provide meals for those in need.</p>
      <p>A portion of every sale goes directly to these causes. We are also organizing volunteer days for our staff and customers to get involved.</p>
      <p>Together, we can make a real difference.</p>
    `,
    featuredImage:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&h=900&fit=crop',
    author: 'Community Outreach',
    publishedAt: '2025-11-15T00:00:00.000Z',
    category: null,
    tags: [],
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    slug: 'new-snack-arrivals',
    title: 'New Snack Arrivals',
    excerpt:
      'From spicy chips to sweet treats, check out the latest additions to our snack aisle this month.',
    content: `
      <p>Our snack aisle just got a major upgrade! We've added over 20 new items, including:</p>
      <ul>
        <li>Limited-edition spicy chips</li>
        <li>Gourmet chocolates from local makers</li>
        <li>Healthy organic options for guilt-free snacking</li>
      </ul>
      <p>Whether you're craving something salty or sweet, we have something for everyone. Stop by today to try them out!</p>
    `,
    featuredImage:
      'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=1600&h=900&fit=crop',
    author: 'Product Team',
    publishedAt: '2025-11-10T00:00:00.000Z',
    category: null,
    tags: [],
  },
];
