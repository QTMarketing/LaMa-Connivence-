export type RewardFeature = {
  slug: 'digital-wallet' | 'savings' | 'mobile-checkout';
  title: string;
  cardImage: string;
  heroImage: string;
  shortDescription: string;
  heroSubtitle: string;
  overview: string[];
  steps: string[];
  benefits: { title: string; description: string }[];
  gallery: { image: string; alt: string }[];
};

export const rewardFeatures: RewardFeature[] = [
  {
    slug: 'digital-wallet',
    title: 'Digital Wallet',
    cardImage: '/foo/coco.png',
    heroImage: '/foo/coco.png',
    shortDescription: 'Pay securely, track rewards, and keep every receipt in one place.',
    heroSubtitle: 'A faster way to pay and manage rewards in the LaMa app.',
    overview: [
      'Digital Wallet lets members check out quickly by scanning their in-app code at the register. Your payment and rewards identity stay connected in one place, reducing friction during busy store visits.',
      'Every qualifying purchase is saved to your account history, making it easy to review spending, track points, and resolve receipt questions without keeping paper copies.',
    ],
    steps: [
      'Open the LaMa app and choose Digital Wallet.',
      'Scan your member code at checkout before payment.',
      'Confirm points and receipt details in your activity feed.',
    ],
    benefits: [
      {
        title: 'Faster Checkout',
        description: 'Reduce transaction time with quick scan-and-pay flow at participating stores.',
      },
      {
        title: 'Secure Transactions',
        description: 'Payment details are handled through protected app flows and account verification.',
      },
      {
        title: 'Better Tracking',
        description: 'View your purchases, earned points, and redeemed rewards in one timeline.',
      },
    ],
    gallery: [
      { image: '/foo/coco.png', alt: 'Digital wallet checkout promotion' },
      { image: '/prommo.png', alt: 'Rewards and offers visual for wallet users' },
    ],
  },
  {
    slug: 'savings',
    title: 'Savings',
    cardImage: '/photos/red.png',
    heroImage: '/photos/red.png',
    shortDescription: 'Unlock weekly offers, bonus deals, and member pricing opportunities.',
    heroSubtitle: 'Save more on everyday purchases with member-focused offers.',
    overview: [
      'LaMa Savings helps members discover high-value deals across drinks, snacks, and meal bundles. Personalized and seasonal offers appear in the app based on active campaigns and participating locations.',
      'Members can combine point earning with eligible savings promotions, so each purchase delivers immediate value now and reward value later.',
    ],
    steps: [
      'Browse active offers in the Savings section of the app.',
      'Clip or activate the deals you want before checkout.',
      'Scan your member code to apply eligible discounts automatically.',
    ],
    benefits: [
      {
        title: 'Member-Only Pricing',
        description: 'Access select offers and bundles that are reserved for enrolled rewards members.',
      },
      {
        title: 'Predictable Value',
        description: 'Plan purchases with clear offer windows and visible savings before checkout.',
      },
      {
        title: 'Stacked Benefits',
        description: 'Earn points on qualifying items while still taking advantage of active savings deals.',
      },
    ],
    gallery: [
      { image: '/photos/red.png', alt: 'Savings feature with beverage deal creative' },
      { image: '/photos/c.png', alt: 'Additional promotional savings visual' },
    ],
  },
  {
    slug: 'mobile-checkout',
    title: 'Mobile Checkout',
    cardImage: '/photos/c.png',
    heroImage: '/foo/burger.jpg',
    shortDescription: 'Shop at your own pace and move through checkout with less waiting.',
    heroSubtitle: 'A smoother in-store checkout experience designed for speed.',
    overview: [
      'Mobile Checkout is designed for members who want more control and less queue time. The experience is optimized for quick entry, clear confirmation, and immediate visibility into applied points and promotions.',
      'By linking checkout with your rewards identity, every qualifying purchase can be captured accurately, helping you avoid missed points and making redemption easier on future visits.',
    ],
    steps: [
      'Select your items and proceed to checkout as usual.',
      'Scan your app barcode to link the transaction to your rewards account.',
      'Review the confirmation screen to verify points and applied offers.',
    ],
    benefits: [
      {
        title: 'Reduced Waiting',
        description: 'Move through high-traffic periods with faster, reward-linked checkout handling.',
      },
      {
        title: 'Clear Confirmation',
        description: 'Immediately validate that your transaction counted toward rewards.',
      },
      {
        title: 'Consistent Experience',
        description: 'Use the same app flow across participating stores for familiar checkout behavior.',
      },
    ],
    gallery: [
      { image: '/foo/burger.jpg', alt: 'Mobile checkout campaign artwork' },
      { image: '/photos/c.png', alt: 'Checkout speed and value promotional image' },
    ],
  },
];

export function getRewardFeatureBySlug(slug: string): RewardFeature | undefined {
  return rewardFeatures.find((feature) => feature.slug === slug);
}
