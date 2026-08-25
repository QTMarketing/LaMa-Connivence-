# LaMa Convenience — art direction for banners & product imagery

**Status: supersedes the dark-studio direction used for `public/campaign/*` (2026-08-25).**
Those frames are rejected. Do not generate more in that style.

Derived from **20 live convenience-store and QSR sites** inspected 2026-08-25, not from
taste. Counts below are what was actually observed, not estimates.

---

## 1. What the reference set actually does

Sites loaded and inspected: 7-Eleven, Wawa, RaceTrac, Dutch Bros, McDonald's, Burger King,
Starbucks, Little Caesars, Jack in the Box, Arby's, Chipotle, Panera, Love's, Stewart's
Shops, GetGo, Rutter's, Shake Shack, Del Taco, ampm, Allsup's.

### Hero ground treatment

| Treatment | Count | Examples |
|---|---|---|
| Flat brand colour | 11 | 7-Eleven, Wawa, RaceTrac, Little Caesars, Love's, Del Taco, ampm, Allsup's |
| Light neutral (white / cream / greige) | 6 | McDonald's, Burger King, Jack in the Box, GetGo, Shake Shack, Panera |
| Full-bleed macro food | 2 | Chipotle, Stewart's |
| Split panel (photo + flat colour) | 1 | Starbucks |
| **Dark studio void** | **0** | — |

**Zero of twenty** put an unbranded product in a moody dark studio. That is product-mockup
language, not marketing language. It is the single clearest tell.

### Three further patterns

1. **Product is cut out and bright-lit** — 13 of 20. Even the dark-ground brands
   (Arby's, Rutter's) light the product bright and hot; the dark is their *brand colour*,
   not an empty room.
2. **Price/offer is a graphic overlay, never baked into the photo** — 9+ of 20.
   7-Eleven `$3 MEAL DEAL`, RaceTrac angled `2 FOR $5` starburst, McDonald's red `FREE`
   ribbon, Little Caesars `$4.99` cream card, Allsup's circular `6c/10c/20c per GAL`
   badges, Love's `10c OFF`. Keeping it as an overlay means the price can change without
   regenerating the image.
3. **Packaging carries branding** — Stewart's own cups, 7-Eleven's Big Gulp and Big Bite
   tray, ampm's cluster of real Lay's / Red Bull / Gatorade. Generic unbranded packaging is
   what makes an image read as a template.

### The two closest references for us

- **Little Caesars** — flat brand orange almost identical to our `#FF6B35`, cream price
  card, huge numeral, black CTA. Our exact palette doing marketing work.
- **ampm** — a c-store hero built from real branded packaging with a store-locator bar
  directly beneath. We already own that imagery in `public/brands/` (Monster, Red Bull,
  Celsius, C4, Pepsi, Gatorade, Ghost, Alani Nu).

**Shake Shack** solves type-on-image contrast structurally: warm greige ground, big product
cutout, and a **dark copy card** behind the type — instead of dimming the whole photo.

---

## 2. Rules for LaMa

### Ground
- Default: cream `#FAFAF5` or white `#FFFFFF`.
- Promo bands: flat brand orange `#FF6B35`.
- Dark `#1A1A1A` is allowed only as a deliberate brand band (Arby's/Rutter's model) —
  never as the default backdrop for a product shot.
- Never a black studio void with a vignette.

### Product
- Bright, evenly lit, cut out, with a soft contact shadow.
- No moody single-key lighting, no heavy vignette, no smoke-filled dark rooms.
- Steam is fine on hot items; it must not be the subject.

### Packaging
- Prefer LaMa-branded cups / bags / trays. This is the biggest single lever on whether the
  site reads as a real 96-store chain.
- Third-party branded product (Monster, Red Bull, Gatorade) is legitimate and matches ampm.
- Generic unbranded kraft cups are banned. That is the mockup look.

### Graphic devices — REQUIRED, not optional

A product on a plain ground is still half a mockup. 10 of the 20 reference sites carry a
deliberate graphic element on the image:

| Site | Device |
|---|---|
| Wawa | Vector confetti — squiggles, triangles, dots |
| Del Taco | Giant tonal star shape behind the product |
| Allsup's | Star field + circular badge emblems |
| Rutter's | Halftone dot pattern across the brand field |
| Dutch Bros | Seasonal patchwork / plaid pattern |
| RaceTrac | Angled starburst price tag |
| McDonald's | Red ribbon / banner shape |
| 7-Eleven | Oversized `$3` numeral lockup |
| Love's | 3D mascot character |
| Burger King | Retro display type + big red `NEW` |

**Bake in** (image model renders these reliably, and they never need editing):
starbursts, rays, halftone dots, confetti, tonal brand shapes, texture, angled tags and
badges as *shapes*, the LaMa llama mark, seasonal patterns.

**Keep in the DOM** (these change, and baked text cannot be edited, translated, indexed,
or read by a screen reader):
the actual price digits, the headline, the CTA label. Put them ON the baked starburst or
tag — that is the hybrid the chains effectively ship.

**Exception:** when a campaign genuinely needs a typographic lockup baked in (e.g. a
seasonal "FALL FLAVORS" wordmark), generate that with `nano_banana_pro`, which is the
text-capable model. Do not ask the general marketing model for legible type — it garbles
letterforms.

### Price / offer colour
- Type in the lockup: ink on orange, or orange on cream. Never white on orange
  (2.84:1, fails AA — see DESIGN.md).

### Contrast for type over imagery
- Use a copy card (Shake Shack model) or place type on the flat-colour half of a split.
- Do **not** flatten the photo with `bg-black/40`. DESIGN.md already bans this.

### Placement
- The image must match its section's subject. Coffee cups do not illustrate a Rewards
  section — Rewards gets the app, the card, or the points UI.

---

## 3. Format

- Deliver **webp**, max width 1920 for full-bleed bands, 1200 for cards, 800 for 1:1 tiles.
- Measured on the current campaign set: 8.6 MB JPG -> 1.9 MB webp at 1920px, a 78% cut.
- `public/` is not gitignored; anything committed is permanent. Convert before committing.

---

## 4. Rejected

`public/campaign/*` as generated on 2026-08-24: dark charcoal backdrop, warm upper-left key,
heavy vignette, unbranded packaging, no offer lockup. Rejected by the owner:
*"all look mock up images not marketing images... i also dont like the dark asthetic, it
should be something that goes well with our pages."*
