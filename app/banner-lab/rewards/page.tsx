import CategoryBand from '@/components/CategoryBand';
import { RewardsBand } from '@/components/BannerVariants';
import { CAMPAIGN } from '@/lib/campaignImages';

/** Locked structure + palette range. Throwaway route. */
export const metadata = { title: 'Band structure — LaMa' };

const BANDS = [
  {
    field: 'mist' as const,
    title: 'Ice-cold, all day',
    subtitle: 'Fountain drinks, energy, and bottled water from the brands you know.',
    img: CAMPAIGN.cutDrinks,
    alt: 'Fountain drink, bottled water and an energy can',
  },
  {
    field: 'sand' as const,
    title: 'Hot brews, all day',
    subtitle: 'Fresh coffee poured from open to close, every single morning.',
    img: CAMPAIGN.cutCoffee,
    alt: 'Two hot takeaway coffee cups',
  },
  {
    field: 'peach' as const,
    title: 'Hot off the grill',
    subtitle: 'Crispitos, Rollerbites and Bahama Mama, hot and ready all day.',
    img: CAMPAIGN.cutCrispitos,
    alt: 'Crispitos rolled taquitos',
  },
  {
    field: 'honey' as const,
    title: 'Snack aisle favourites',
    subtitle: 'Chips, nuts, candy and everything else worth grabbing on the way out.',
    img: CAMPAIGN.cutSnacks,
    alt: 'Chips, nuts and a candy bar',
  },
  {
    field: 'sage' as const,
    title: 'The basics, covered',
    subtitle: 'Milk, bread, eggs and the everyday things you forgot to buy.',
    img: CAMPAIGN.cutGrocery,
    alt: 'Milk carton, bread loaf and eggs',
  },
  {
    field: 'lilac' as const,
    title: 'More than a fill-up',
    subtitle: 'ATM, car wash, lottery and money orders at locations near you.',
    img: CAMPAIGN.cutGrocery,
    alt: 'Everyday store goods',
  },
];

export default function BandStructurePage() {
  return (
    <main className="min-h-screen bg-white">
      {BANDS.map((b) => (
        <div key={b.title} className="mb-1">
          <CategoryBand
            field={b.field}
            title={b.title}
            subtitle={b.subtitle}
            cta={{ label: 'Join LaMa Rewards', href: '/rewards' }}
            ctaNote="Free to join · earn on every visit"
            imageSrc={b.img}
            imageAlt={b.alt}
          />
        </div>
      ))}

      <RewardsBand />
    </main>
  );
}
