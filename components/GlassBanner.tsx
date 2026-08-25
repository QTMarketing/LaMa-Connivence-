import Link from 'next/link';
import { ArrowRight, Gift } from 'lucide-react';

/**
 * Rewards prompt.
 *
 * This used to be a framer-motion card with initial={{opacity:0}}, which baked
 * `opacity:0` into the SERVER HTML — twice, on the wrapper and on the card. The rewards
 * offer shipped invisible and only appeared if JS hydrated. It was also a 42%-opacity
 * glass panel, so even once visible the copy fought whatever sat behind it.
 *
 * Now: no JS, an opaque warm card, and a CSS entrance whose resting state is the
 * VISIBLE state. If the animation never runs, the content is still there.
 */
export default function GlassBanner() {
  return (
    <div className="rewards-prompt relative z-30 w-full max-w-sm">
      <div className="overflow-hidden rounded-md border border-[#1A1A1A]/10 bg-[#FFE8D8] shadow-[0_8px_24px_rgba(26,26,26,0.12)]">
        <div className="flex items-start gap-3 p-4 md:p-5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]">
            <Gift size={18} className="text-[#1A1A1A]" />
          </span>

          <div className="min-w-0">
            <h2 className="typography-body font-bold text-[#1A1A1A]">
              Join LaMa Convenience Rewards
            </h2>
            <p className="typography-body-sm mt-1 text-[#1A1A1A]/75">
              Unlock exclusive member-only deals and earn points on every purchase.
            </p>
            <Link
              href="/rewards"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Sign Up Free
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
