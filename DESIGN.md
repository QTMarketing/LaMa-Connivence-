---
name: LaMa Convenience
description: Neighborhood convenience — orange strike, ink type, 6px corners.
colors:
  orange: "#FF6B35"
  orange-hover: "#E55A2B"
  ink: "#1A1A1A"
  white: "#FFFFFF"
  body: "#444444"
  muted: "#4A5568"
  wash: "#F7F7F7"
  cream: "#FAFAF5"
  page-gray: "#F1F1F1"
  border: "#E2E8F0"
typography:
  display:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "clamp(3.5rem, 7vw, 4.5rem)"
    fontWeight: 900
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  h1:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "clamp(2.75rem, 4.5vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "clamp(2.25rem, 3.8vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.15
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  nav:
    fontFamily: "Rajdhani, sans-serif"
    fontSize: "18px"
    fontWeight: 700
rounded:
  card: "6px"
  control: "6px"
  pill: "9999px"
  full: "9999px"
spacing:
  section-sm: "3rem"
  section-md: "4rem"
  section-lg: "5rem"
  nav-mobile: "4rem"
  nav-desktop: "5rem"
  card: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.orange-hover}"
  card:
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
---

# LaMa Convenience — design system (as shipped)

Honest record of the live site. Not a wishlist. Do not import Stripe, Nike, or Linear DNA.

Grammar extracted from awesome-design.md (mechanic only, not visual identity):

- **Vodafone:** one accent reserved for CTA; cards ~6px; primary buttons are **pills** (~60px / full), not the same radius as cards. Putting 6px on buttons AND cards is why the UI looked rigid.
- **Nike:** photography-first, crop with headroom; chrome stays quiet.

## Overview

LaMa is a neighborhood convenience brand. Type is Rajdhani for nav and headlines, Inter for body. Color is ink, white, and one orange used as a strike — never as a reading field. **Cards are 6px. Primary CTAs are pills (`rounded-full`).** The header is sticky in-flow (`h-16` / `lg:h-20`); page content does not add extra `pt-24` to clear it.

## Colors

| Token | Hex | Role |
| --- | --- | --- |
| Orange | `#FF6B35` | CTA fill, sale strike, short lockups. **Not** a body/headline field. |
| Orange hover | `#E55A2B` | Primary button hover only. |
| Ink | `#1A1A1A` | Headlines, reading surfaces, dark bands. |
| White | `#FFFFFF` | Page ground and text on ink or on photos with a dark overlay. |
| Body | `#444444` | Default paragraph color in `globals.css`. |
| Muted | `#4A5568` | Secondary UI text. |
| Wash / cream / page-gray | `#F7F7F7` / `#FAFAF5` / `#F1F1F1` | Section grounds. |
| Border | `#E2E8F0` | Hairlines, secondary button border. |

**Contrast fact:** white `#FFFFFF` on `#FF6B35` is **2.84:1**. WCAG AA needs 4.5:1 body and 3:1 large. Ink `#1A1A1A` on orange is ~6.4:1 (passes). White on ink is ~16:1 (passes).

Primary buttons still ship white-on-orange (short CTA lockup). Do not use that pair for body copy or headlines. Do not “fix” contrast with `text-shadow`.

## Typography

- **Rajdhani** (`--font-rajdhani`): navbar (`.nav-link-premium`), all headings.
- **Inter** (`--font-inter`): body, buttons, links, captions.

Named scale in `app/globals.css`:

| Class | Size |
| --- | --- |
| `.typography-display` | `clamp(3.5rem, 7vw, 4.5rem)` |
| `.typography-h1` | `clamp(2.75rem, 4.5vw, 3.5rem)` |
| `.typography-h2` | `clamp(2.25rem, 3.8vw, 3rem)` |
| `.typography-h3` | `clamp(1.75rem, 3vw, 2.25rem)` |
| `.typography-h4` | `clamp(1.375rem, 2.5vw, 1.75rem)` |
| `.typography-body` | `1rem` / 1.6 |
| `.typography-body-lg` | `1.125rem` / 1.6 |
| `.typography-body-sm` | `0.875rem` / 1.5 |
| `.typography-caption` | `0.75rem` / 1.4 |

`tailwind.config.ts` also lists `display`–`caption` sizes; prefer the CSS utility classes so both stay in sync.

## Layout

- Container: `.container-standard` = `max-width: 80rem` (1280px), centered.
- Section padding: `.section` = 3rem / 4rem (md) / 5rem (lg) vertical; 1–2rem horizontal.
- Navbar: `sticky top-0`, **4rem** mobile (`h-16`), **5rem** desktop (`lg:h-20`). In document flow. Do not add `pt-24` / `pt-28` to compensate as if it were `fixed`.
- Spacing scale also includes Tailwind `section-xs`–`section-xl` (2–6rem).

## Shapes

- **Cards / images / inputs: 6px** (`0.375rem`). Do not balloon to 16–24px.
- **Primary CTAs (`.btn-primary`): pill** (`9999px` / `rounded-full`). Find a Store, Redeem Now, Get The App inherit this.
- **Filter chips: pills** so they sit in the same language as CTAs.
- **Full** radius also for circular icon buttons (FAQ plus, step numbers).
- Do not put the card radius on primary buttons — that is the rigid look.

## Components

- `.btn-primary`: orange fill, white label, **pill**, Inter bold. Hover darkens to `#E55A2B`. No `scale(1.05)`.
- `.btn-secondary`: transparent, ink label, 2px `#E2E8F0` border, **pill** (same chrome as primary). Hover tints border/label orange. No `scale(1.05)`.
- `.card`: white, **6px**, 1px border, light shadow; hover lifts `translateY(-2px)`.
- `.card-body`: **24px padding on all sides** (padding-bottom ≥ padding-x). CTA must not kiss the card edge.
- Navbar: white bar, Rajdhani links, orange underline on hover. Do not restyle the nav unless asked. Leave the unused “Delivery” span in place.
- Inner photo heroes use `.hero-photo-band` (**280 / 320 / 360 / 400px**, not 600). Type-on-photo contrast is **tight to the copy**: `.hero-copy-glow` (radial `closest-side` on the type block) plus `.hero-type-shadow` (0 1px 2px / 0 2px 8px / 0 8px 24px). Do not flatten the whole hero with `bg-black/40` or a giant 85% radial.
- Homepage first screen stays `100svh − nav`.
- Blog “Most Recent Post”: medium cards (~440px) in a slow 48s linear marquee; pause on hover and `prefers-reduced-motion`.

## Do's and Don'ts

**Do**

- Put reading (body and headlines) on `#1A1A1A` or `#FFFFFF`.
- Keep orange for buttons, price strikes, and short lockups; if type sits on orange, use ink not white.
- Use **6px on cards** and **pills on primary CTAs**.
- Deduplicate tokens in `globals.css` — one `.btn-primary`, one type block.

**Don't**

- White body or headline on `#FF6B35` (2.84:1, fails AA).
- Duplicate CSS blocks in `globals.css`.
- `scale(1.05)` as the default button hover.
- A second accent (no green, no gold system, no purple).
- Text-shadow as a contrast “fix”.
- Extra `pt-24` / `pt-28` under the in-flow sticky header.
- Foreign brand DNA (Stripe / Nike / Linear).
- The same 6px radius on buttons and cards (that is the rigid look).
