# Placeholder data — what is NOT real yet

Everything on this page is data the site currently shows that is incomplete or
unverified. **Nothing here is invented** — where a value was unknown it was left
empty or marked, never guessed. Wrong information about a real store is worse
than absent information.

Last updated 2026-08-24.

---

## 1. Store hours — 96 of 96 unknown  · P1

Every store in `lib/storeData.ts` has `hours: 'Call to confirm'` and
`hoursVerified: false`.

**No hours exist in any recovered source.** The only hours found anywhere were a
single org-level JSON-LD line on the archived corporate site claiming
`Mon-Sun 5am-12am` for the entire company — that is boilerplate, and applying it
to 96 individual stores would be fabrication.

**To fix:** export from the Google Business Profile account (authoritative, and
the business owns those listings), or use the Google Places API with a key.
Google search results are JS-gated and scraping them breaks their ToS — verified
2026-08-24, the search HTML returns an `enablejs` bot wall.

Find them in code: `getStoresNeedingHours()`

---

## 2. Store phone numbers — 88 of 96 missing  · P1

Only 8 phones were recovered, from archived per-store pages. The rest are empty
strings with `phoneVerified: false`.

Recovered and real:

| Store | Phone |
|---|---|
| Quick Track 1 / LP Food Mart | 817-282-3736 |
| Quick Track 2 | 817-282-9496 |
| Quick Track 8 | 972-289-6235 |
| Quick Track 21 | 903-737-8600 |
| Quick Track 51 | 870-286-2911 |
| Quick Track 54 | 903-872-4125 |
| Quick Track 82 | 432-694-9841 |
| Quick Track 93 | 505-292-6586 |
| Quick Track 100 | 903-938-4901 |

**To fix:** same source as hours — GBP export or Places API.

Find them in code: `getStoresNeedingPhone()`

---

## 3. Incomplete addresses — 6 of 96  · P2

Six stores have no street number in the source, so the address string is only a
city/state fragment (for example `Arkansas, USA, AR`). They are flagged
`addressComplete: false`. Coordinates are present for all 96, so they still plot
on a map correctly — but the printed address is not usable for navigation.

Find them in code: `getStoresNeedingAddress()`

---

## 4. The whole dataset is ~2.5 years stale  · P1

Source: a Wayback snapshot dated **2023-03-26** of `quicktrackinc.com/visit-us`,
parsed out of the `wp-google-map-plugin` `places[]` payload.

Stores open, close, and change hands. Every one of the 96 rows needs
confirmation against current records before it is treated as fact.

**What IS real and verified in that data:** store names, street addresses,
city, state, zip, latitude, longitude, and the source's own category label
(`c-store + gas`, `Fuel`, `qt store`, etc).

Coverage by state: TX 80 · NM 10 · AR 2 · LA 1 · MS 1 · OK 1 · unknown 1.

---

## 5. Non-retail properties excluded

The source listed **107** properties. **11 are not customer-facing stores** —
a laundromat, an empty lot, a house, four strip centers, an auto shop and two
restaurants — and they are deliberately excluded from `lib/storeData.ts`, which
holds the **96 retail** locations only. They belong on a real-estate page if
anywhere, not in the store locator.

---

## 6. Product imagery is stock  · P3

`lib/productData.ts` uses 84 `images.unsplash.com` URLs as product photography.
These are placeholders for real product shots. The `design-taste-frontend`
skill also flags raw Unsplash links as an AI tell and prescribes
`picsum.photos/seed/...` or real assets.

---

## 7. Promo banners are in-store POS art  · P2

`public/promos/*.jpg` are 1920x1080 in-store signage boards (Monster, Red Bull,
Celsius and so on). They carry vendor trade dress, QR codes, legal copy
("+ Tax & CRV where applicable") and a third-party agency mark, and **no LaMa
branding at all**. There is no text safe zone, so nothing can be overlaid on
them. They are built for a screen above the cooler, not for a phone.

**To fix:** commission or generate web-native banners with a safe zone. Note our
promos are 16:9 (1.78) while Wawa's full-width web banners measure 1.897 — the
shapes are not interchangeable.

---

## 8. Placeholder company details

`ENV_VARIABLES.md` contains a **live Neon database credential** that should be
rotated — it is committed to git history. It also documents `DATABASE_URL` as
required when nothing in the codebase reads it, and states the wrong dev port.
