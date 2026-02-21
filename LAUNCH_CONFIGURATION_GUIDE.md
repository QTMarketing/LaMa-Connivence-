# 🚀 Launch Configuration Guide

This guide lists **everything** you need to update before launching your website. Only API keys, text content, and images need to be replaced.

---

## 📋 Table of Contents
1. [API Keys & Environment Variables](#1-api-keys--environment-variables)
2. [Brand Text Content](#2-brand-text-content)
3. [Images to Replace](#3-images-to-replace)
4. [Store Data](#4-store-data)
5. [Deal/Product Data](#5-dealproduct-data)
6. [Social Media Links](#6-social-media-links)
7. [Admin Configuration](#7-admin-configuration)

---

## 1. API Keys & Environment Variables

### Required Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Base URL for your production site
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Optional: Google Maps API Key (for enhanced map features)
# Get one at: https://console.cloud.google.com/google/maps-apis
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Optional: Admin Password (recommended for security)
# Currently hardcoded in app/admin/login/page.tsx
ADMIN_PASSWORD=your_secure_password_here
```

**Files that use these:**
- `app/sitemap.xml/route.ts` - Uses `NEXT_PUBLIC_BASE_URL`
- `app/llm.txt/route.ts` - Uses `NEXT_PUBLIC_BASE_URL`
- `app/robots.txt/route.ts` - Uses `NEXT_PUBLIC_BASE_URL`
- `app/stores/page.tsx` - Can use `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (optional)

---

## 2. Brand Text Content

### A. Site Metadata (`app/layout.tsx`)

**File:** `app/layout.tsx` (lines 21-24)

```typescript
export const metadata: Metadata = {
  title: "Lama | Your Neighborhood Convenience",  // ← Change "Lama" to your brand name
  description: "Fresh food, cold drinks, and everyday essentials at Lama.",  // ← Update description
};
```

### B. Homepage Hero Section (`app/page.tsx`)

**File:** `app/page.tsx`

**Line 178:** Main hero title
```typescript
"Fuel Up Fast."  // ← Update to your main tagline
```

**Lines 180-183:** Hero description
```typescript
"Fresh hot dogs and crispy taquitos,\n" +
"hot and ready to fuel your day"  // ← Update to your description
```

**Line 211:** Price badge
```typescript
"$4"  // ← Update to your price
```

**Lines 636-639:** LaMa Rewards section
```typescript
"LaMa Rewards"  // ← Change "LaMa" to your brand name
"Join our rewards program and start earning points on every purchase. Unlock exclusive deals and save more with Lama."  // ← Update description
```

**Line 831:** Store locator section
```typescript
"LaMa Convenience Store"  // ← Change to your brand name
```

### C. LLM.txt Content (`app/llm.txt/route.ts`)

**File:** `app/llm.txt/route.ts` (lines 8-9)

```typescript
const siteName = 'LaMa Convenience Store';  // ← Change to your brand name
const siteDescription = 'Your neighborhood convenience store offering fresh food, cold drinks, hot beverages, snacks, and everyday essentials.';  // ← Update description
```

**Lines 20-25:** Update product categories description
```typescript
// Update the list of services/products you offer
```

### D. Footer (`components/Footer.tsx`)

**File:** `components/Footer.tsx`

**Line 250:** Copyright text
```typescript
© {currentYear} LaMa™. All rights reserved.  // ← Change "LaMa" to your brand name
```

**Line 215:** Newsletter description
```typescript
"Stay updated with our latest deals, promotions, and store news."  // ← Update if needed
```

---

## 3. Images to Replace

### A. Homepage Images (`app/page.tsx`)

**File:** `app/page.tsx`

| Line | Current Path | Description | Replace With |
|------|-------------|-------------|--------------|
| 163 | `/foo/bet.jpg` | Main hero banner | Your hero image |
| 232 | `/foo/coke.jpg` | LaMa Loyalty card background | Your loyalty program image |
| 256 | `/foo/cola1.jpg` | Current Promos card background | Your promos image |
| 494 | `/foo/pizza.jpg` | Pizza deals card | Your pizza/food image |
| 527 | `/foo/coffee.jpg` | Coffee deals card | Your coffee image |
| 556 | `/foo/drink.jpg` | Drinks card | Your drinks image |
| 586 | `/foo/burger.jpg` | Meal deal card | Your meal deal image |
| 680 | `https://images.unsplash.com/...` | LaMa Rewards section | Your rewards app image |
| 750 | `/photos/store1.jpg` | Blog post fallback | Your blog image |
| 801 | `/photos/lama.jpg` | Store locator background | Your store image |

**Also check:** Lines 305, 340, 376, 403 - Fallback Unsplash images for promos

### B. Store Pages (`app/stores/page.tsx`)

**File:** `app/stores/page.tsx`

| Line | Current Path | Description | Replace With |
|------|-------------|-------------|--------------|
| 89 | `https://images.unsplash.com/photo-1556740758-90de374c12ad` | Stores page hero | Your stores hero image |

**File:** `app/stores/[id]/page.tsx`

| Line | Current Path | Description | Replace With |
|------|-------------|-------------|--------------|
| 39 | `https://images.unsplash.com/photo-1556740758-90de374c12ad` | Store detail hero | Your store detail image |

### C. Deals Page (`app/deals/page.tsx`)

**File:** `app/deals/page.tsx`

| Line | Current Path | Description | Replace With |
|------|-------------|-------------|--------------|
| 68 | `https://images.unsplash.com/photo-1551218808-94e220e084d2` | Deals page hero | Your deals hero image |

### D. Drinks Page (`app/drinks/page.tsx`)

**File:** `app/drinks/page.tsx`

| Line | Current Path | Description | Replace With |
|------|-------------|-------------|--------------|
| 45 | `https://images.unsplash.com/photo-1554866585-cd94860890b7` | Drinks page hero | Your drinks hero image |

### E. Services Page (`app/services/page.tsx`)

**File:** `app/services/page.tsx`

| Line | Current Path | Description | Replace With |
|------|-------------|-------------|--------------|
| 82 | `https://images.unsplash.com/photo-1556740758-90de374c12ad` | Services page hero | Your services hero image |

### F. Rewards Page (`app/rewards/page.tsx`)

**File:** `app/rewards/page.tsx`

| Line | Current Path | Description | Replace With |
|------|-------------|-------------|--------------|
| 78 | `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d` | Rewards page hero | Your rewards hero image |
| 292 | `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d` | Rewards section image | Your rewards image |

### G. Product/Deal Images in Data Files

**File:** `lib/dealsData.ts`
- **All deals** use Unsplash URLs (lines 29, 44, 58, 74, 85, 94, 105, 117, 128, 137)
- Replace all `image:` properties with your product images

**File:** `lib/drinksData.ts`
- **All drinks** use Unsplash URLs
- Replace all `image:` properties with your drink images

**File:** `lib/productData.ts`
- **All products** use Unsplash URLs
- Replace all `image:` properties with your product images

**File:** `lib/blogData.ts`
- Blog post images (lines 17, 32, etc.)
- Replace with your blog post images

### H. Logo

**File:** `components/Navbar.tsx` (line 88)

| Current Path | Description | Replace With |
|-------------|-------------|--------------|
| `/Lama.png` | Main logo | Your brand logo |

**Recommended size:** 72x72px or larger (scalable)

---

## 4. Store Data

### File: `lib/storeData.ts`

**Update all store information:**

```typescript
export const stores: Store[] = [
  {
    id: 1,
    name: 'LaMa Downtown',  // ← Change to your store name
    address: '123 Main Street, Downtown, CA 90210',  // ← Update address
    lat: 34.0522,  // ← Update latitude
    lng: -118.2437,  // ← Update longitude
    phone: '(555) 123-4567',  // ← Update phone number
    hours: 'Mon-Sun: 6:00 AM - 11:00 PM',  // ← Update hours
  },
  // Add more stores or remove sample stores
];
```

**To get coordinates (lat/lng):**
1. Go to Google Maps
2. Search for your address
3. Right-click on the location → "What's here?"
4. Copy the coordinates from the popup

---

## 5. Deal/Product Data

### File: `lib/dealsData.ts`

**Update all deal information:**
- Titles (line 27, 42, 56, etc.)
- Descriptions (line 28, 43, 57, etc.)
- Images (replace all Unsplash URLs)
- Prices (lines 36-37, 50-51, 64-65, etc.)
- Categories
- Expiration dates

### File: `lib/drinksData.ts`

**Update all drink information:**
- Titles
- Descriptions
- Images (replace all Unsplash URLs)
- Prices
- Categories

### File: `lib/productData.ts`

**Update all product information:**
- Product names
- Descriptions
- Images (replace all Unsplash URLs)
- Categories

### File: `lib/blogData.ts`

**Update blog posts:**
- Titles (line 5, 24, etc.)
- Descriptions
- Content (HTML)
- Images
- Dates
- Author names

---

## 6. Social Media Links

### File: `components/Footer.tsx` (lines 30-33)

```typescript
const socialLinks = [
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },  // ← Add your Instagram URL
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },  // ← Add your Facebook URL
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },  // ← Add your Twitter URL
];
```

**Update to:**
```typescript
const socialLinks = [
  { href: 'https://instagram.com/your-account', icon: Instagram, label: 'Instagram' },
  { href: 'https://facebook.com/your-page', icon: Facebook, label: 'Facebook' },
  { href: 'https://twitter.com/your-handle', icon: Twitter, label: 'Twitter' },
];
```

---

## 7. Admin Configuration

### File: `app/admin/login/page.tsx` (line 29)

**Current password:** `'admin123'`

**Update to:**
```typescript
if (password === 'your_secure_password_here') {  // ← Change password
```

**OR** (Recommended) Use environment variable:
```typescript
if (password === process.env.ADMIN_PASSWORD || password === 'admin123') {
```

Then set `ADMIN_PASSWORD` in `.env.local`

---

## 📝 Quick Checklist

### Before Launch:

- [ ] Set `NEXT_PUBLIC_BASE_URL` in `.env.local`
- [ ] Update site title and description in `app/layout.tsx`
- [ ] Replace all hero images (homepage, stores, deals, drinks, services, rewards)
- [ ] Replace logo (`/Lama.png` → your logo)
- [ ] Update all store data in `lib/storeData.ts`
- [ ] Replace all deal/product images in data files
- [ ] Update deal/product text content (titles, descriptions, prices)
- [ ] Update social media links in `components/Footer.tsx`
- [ ] Change admin password in `app/admin/login/page.tsx`
- [ ] Update brand name "LaMa" throughout the site
- [ ] Replace all Unsplash placeholder images
- [ ] Update blog post content in `lib/blogData.ts`
- [ ] Test all pages load correctly
- [ ] Verify all images display properly
- [ ] Check all links work

---

## 🎯 Image Organization Tips

### Recommended Folder Structure:
```
public/
  ├── images/
  │   ├── hero/
  │   │   ├── homepage-hero.jpg
  │   │   ├── stores-hero.jpg
  │   │   ├── deals-hero.jpg
  │   │   └── ...
  │   ├── products/
  │   │   ├── product-1.jpg
  │   │   ├── product-2.jpg
  │   │   └── ...
  │   ├── deals/
  │   │   ├── deal-1.jpg
  │   │   └── ...
  │   └── stores/
  │       ├── store-1.jpg
  │       └── ...
  ├── logo.png
  └── favicon.ico
```

### Image Requirements:
- **Hero images:** 1920x1080px (16:9 aspect ratio)
- **Product images:** 800x600px (4:3 aspect ratio)
- **Logo:** 72x72px minimum (SVG preferred for scalability)
- **Format:** JPG for photos, PNG for logos/graphics
- **Optimization:** Compress images before uploading (use tools like TinyPNG)

---

## 🔍 Search & Replace Guide

### Quick Find & Replace (Brand Name):

If your brand name is different from "LaMa", use find & replace:

1. **Find:** `LaMa` (case-sensitive)
2. **Replace:** `YourBrandName`
3. **Files to check:**
   - `app/layout.tsx`
   - `app/page.tsx`
   - `app/llm.txt/route.ts`
   - `components/Footer.tsx`
   - `lib/storeData.ts`
   - `lib/blogData.ts`
   - Any other files with "LaMa"

### Quick Find & Replace (Lama):

1. **Find:** `Lama` (case-sensitive)
2. **Replace:** `YourBrandName`
3. **Note:** Be careful - "Lama" might appear in camelCase variables

---

## ✅ Final Steps

1. **Test locally:**
   ```bash
   npm run build
   npm start
   ```

2. **Verify:**
   - All images load
   - All text is updated
   - All links work
   - Store locator functions
   - Admin panel accessible

3. **Deploy:**
   - Set environment variables in your hosting platform
   - Deploy the site
   - Test in production

---

**You're ready to launch once all items above are updated!** 🚀
