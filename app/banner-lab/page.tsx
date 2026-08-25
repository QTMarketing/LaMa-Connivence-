import CategoryBand from '@/components/CategoryBand';
import { BannerSevenEleven, BannerPriceLed, RewardsBand } from '@/components/BannerVariants';
import { CAMPAIGN } from '@/lib/campaignImages';

/**
 * Comparison route — three banner directions, identical content, so the choice is
 * about design and not about copy. Delete this route once a direction is picked.
 */
export const metadata = { title: 'Banner directions — LaMa' };

function Label({ n, name, ref_ }: { n: string; name: string; ref_: string }) {
  return (
    <div className="container-standard px-4 pb-3 pt-12 md:px-6">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
        Direction {n}
      </p>
      <h3 className="typography-h4 text-[#1A1A1A]">{name}</h3>
      <p className="typography-body-sm mt-1 text-gray-600">{ref_}</p>
    </div>
  );
}

export default function BannerLabPage() {
  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="container-standard px-4 pt-10 md:px-6">
        <h1 className="typography-h2 text-[#1A1A1A]">Banner directions</h1>
        <p className="typography-body mt-2 max-w-2xl text-gray-600">
          Same products, same offer, three grammars. All three use the real deal data:
          grill items are $2.00 each and the Mix &amp; Match is $3.99.
        </p>
      </div>

      <Label
        n="A"
        name="Wawa — soft field, cutout, doodles"
        ref_="Field colour belongs to the category; orange is reserved for the CTA, so it only ever means 'act here'."
      />
      <CategoryBand
        field="peach"
        eyebrow="Roller grill · all day"
        title="Grill Favorites"
        subtitle="Hot off the roller grill all day. Crispitos, Rollerbites, Bahama Mama and more."
        cta={{ label: 'See All Deals', href: '/deals' }}
        imageSrc={CAMPAIGN.cutCrispitos}
        imageAlt="Crispitos rolled taquitos"
      />

      <Label
        n="B"
        name="7-Eleven — label box, product row, CTA strip"
        ref_="Title in a solid black box, branded tissue pattern behind, copy and CTA on a grey strip below the band."
      />
      <BannerSevenEleven />

      <Label
        n="C"
        name="Little Caesars / RaceTrac — price-led on brand orange"
        ref_="Flat brand-orange field, oversized condensed headline, angled starburst carrying the offer."
      />
      <BannerPriceLed />

      <Label
        n="A"
        name="Rewards — direction A on a section with NO food"
        ref_="Same grammar, no product photo. The sign-in card content is real structure here instead of a translucent floating panel."
      />
      <RewardsBand />

      <div className="container-standard px-4 pt-16 md:px-6">
        <p className="typography-body-sm text-gray-500">
          Page title + description as the band, with the rewards join as the CTA —
          no eyebrow:
        </p>
      </div>
      <div className="mt-4">
        {/* Page title + description carry the band; the CTA is the rewards join.
            Both live here without being welded into one block. No eyebrow. */}
        <CategoryBand
          field="sand"
          title="Ice-cold, all day"
          subtitle="Fountain drinks, energy, and bottled water from the brands you know."
          cta={{ label: 'Join LaMa Rewards', href: '/rewards' }}
        ctaNote="Free to join · earn on every visit"
          imageSrc={CAMPAIGN.cutRollerbites}
          imageAlt="Rollerbites cheeseburger bites"
        />
      </div>
    </main>
  );
}
