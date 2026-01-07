<!-- 304a6a09-fe32-491a-976f-b5f528b53914 6e0b6ad0-9ac4-4f5a-a8c0-7b69e13a83c3 -->
# Complete Yo Quiero Brands Design Implementation for LaMa

## Complete Yo Quiero Brands Design System Analysis

**Comprehensive Analysis Document**: See `.cursor/plans/yo-quiero-complete-design-system-analysis.md` for ultra-detailed specifications of every section, component, typography, spacing, animation, button style, and layout pattern.

This plan implements the Yo Quiero Brands design system for LaMa, with all details documented from exhaustive analysis of https://yoquierobrands.com/ including:

- Every homepage section in exact order
- Complete navigation structure and dropdowns
- All page types (Products, Recipes/Deals, About, Blog/Media)
- Button styles (Primary, Secondary, Navigation buttons)
- Typography system (Headlines, Body, Badges)
- Color palette and usage
- Spacing and layout patterns
- Animation specifications
- Responsive breakpoints and patterns
- Footer structure
- Component specifications

## Analysis of Yo Quiero Brands Website Structure

Based on comprehensive analysis of [yoquierobrands.com](https://yoquierobrands.com/), adapted for LaMa convenience store:

### Navigation Structure

**CRITICAL SPECIFICATION (Fixed):**

- **Background**: `#1A1A1A` (pure black) - NOT light beige/white, same as Yo Quiero
- **Logo**: Left-aligned, white text with orange accent (replaces Yo Quiero's green)
- **Links**: About, Products (dropdown), Deals, Rewards, Media (dropdown: Blog, Press Room)
- Text color: White (`#FFFFFF`)
- Hover: Orange (`#FF6B35`) - replaces Yo Quiero's green hover
- Typography: Sans-serif, medium weight
- **"Find a Store" button**: 
- Position: Right side, separate from links
- Background: Orange (`#FF6B35`) or dark with orange border
- Text: White, bold
- Shape: `rounded-full` or `rounded-lg`
- Size: Medium, stands out from text links
- **Mobile Menu**: 
- Hamburger icon in light beige container (`#F5F5DC`) - this is the ONLY light element
- Icon: Three horizontal black lines
- Position: Top right
- **All navigation must be responsive with mobile menu**
- **Fixed/Sticky**: Header should be fixed at top with `fixed top-0 z-50`

### Homepage Sections (in order)

1. ✅ **Split-Screen Hero** - Dark left panel with brand, two-line headline, body text; large image on right
2. ✅ **"Do it all, shop it all" Section** - Product categories grid
3. ✅ **"Locate the Lama" Section** - Store locator CTA
4. **ADD:** "The star of Your Deals" - Deals showcase section

- Deal cards with images, titles, savings info, expiration dates
- Categories: Meal Deals, Daily Specials, Weekly Promotions, Combo Offers
- "View All Deals" CTA linking to /deals page

5. **ADD:** "Find your fave" - Featured products section

- Showcase 3-4 featured products from productData
- Product cards with images, badges, sizes/prices
- "Shop Now" / "View All Products" CTA

6. **ADD:** "Lama Goes Digital" - Social media section

- Social media links/icons

### Footer Structure

- Multi-column layout with Products, About, Support columns
- Social media icons
- Legal links (Privacy, Terms, etc.)

## Implementation Plan for LaMa

### Phase 1: Update Navigation (Navbar)

**File:** `components/Navbar.tsx`

Updates (all responsive from the start):

- **Background**: Dark `#1A1A1A` (pure black) - same as Yo Quiero, NOT light
- **Links**: White text, hover to orange (`#FF6B35`)
- Add Products dropdown menu with all categories (with product images in dropdown)
- Add "Deals" link
- Add "Rewards" link
- Add Media dropdown with "Blog" and "Press Room" options
- Style "Find a Store" button: Orange background or dark with orange border, rounded, distinct
- Ensure mobile menu includes dropdowns with proper z-index and positioning
- Mobile-first responsive breakpoints (sm, md, lg)
- Fixed/sticky positioning: `fixed top-0 z-50`

### Phase 2: Complete Homepage Redesign

**File:** `app/page.tsx`

Add missing sections (all responsive):

1. ✅ Split-screen hero (already done, verify responsiveness)
2. ✅ "Do it all, shop it all" section (already done, verify responsiveness)
3. ✅ "Locate the Lama" section (already done, verify responsiveness)
4. **ADD:** "The star of Your Deals" section

- Grid: 3-4 featured deals
- Responsive grid: 1 col mobile, 2 col tablet, 3-4 col desktop
- Deal cards with images, savings badges, expiration dates
- "View All Deals" CTA button

5. **ADD:** "Find your fave" - Featured products section

- Responsive grid matching deals section
- 3-4 featured products from productData
- Product cards with hover effects
- "View All Products" CTA

6. **ADD:** "Lama Goes Digital" - Social media section

- Social icons in responsive grid
- Mobile: stacked, Desktop: horizontal

### Phase 3: Deals Page Creation

**File:** `app/deals/page.tsx` (currently empty)

Create deals listing page matching Yo Quiero recipes page style:

- Responsive hero section
- Category filters (Meal Deals, Daily Specials, Weekly Promotions, Combo Offers)
- Featured deal section at top
- Grid layout: 1 col mobile, 2 col tablet, 3 col desktop
- Deal cards with images, titles, savings, expiration dates
- Match Yo Quiero card styling exactly
- Create `lib/dealsData.ts` for deal data structure

### Phase 4: Media Page with Blog

**Files:** `app/services/media/page.tsx` OR `app/media/page.tsx` (create new structure)

Structure:

- Media landing page with sections for Blog and Press Room
- Blog section using existing `lib/blogData.ts`
- Responsive blog card grid matching Yo Quiero style
- Category filters if needed
- Press Room section (placeholder or future content)
- Ensure existing `/blog` routes redirect or are restructured

### Phase 5: Services Page Enhancement

**File:** `app/services/page.tsx` (currently empty)

Create comprehensive services display:

- Hero section with services overview
- All services from productData (services category)
- Service cards in responsive grid
- Descriptions, icons, CTAs for each service
- Match Yo Quiero card-based layout style
- Mobile: 1 col, Tablet: 2 col, Desktop: 3 col

### Phase 6: Products Page Enhancement

**File:** `app/products/page.tsx`

Update to match Yo Quiero's product listing:

- Verify responsive category cards
- Ensure mobile-first grid (1 col → 2 col → 3 col)
- Match card styling exactly
- Add hover effects consistent with other pages

### Phase 7: Footer Enhancement

**File:** `components/Footer.tsx`

Update to match Yo Quiero's multi-column footer:

- Responsive columns: stacked on mobile, multi-column on desktop
- Products column (all categories)
- About column (About, Careers, Franchise, etc.)
- Support column (Contact, Feedback, Vendors, etc.)
- Social media icons row
- Legal links (Privacy, Terms, etc.)
- Mobile: single column, Desktop: 3-4 columns

### Phase 8: Rewards Page Creation

**File:** `app/rewards/page.tsx` (check if exists, update or create)

Create comprehensive rewards page:

- Hero section with rewards program branding
- Mobile app showcase section with screenshots/mockups
- Features grid: Points system, Exclusive deals, Special offers, Rewards tiers
- How it works section (step-by-step)
- Download section with App Store and Google Play buttons
- FAQ section (optional)
- All sections responsive (mobile-first)
- Match Yo Quiero design language

### Phase 9: Additional Pages Styling

Update remaining pages to match Yo Quiero design language (all responsive):

- `app/about/page.tsx` - Match Yo Quiero's about style
- `app/contact/page.tsx` - Enhanced contact page
- Other utility pages (careers, franchise, etc.)

## Detailed Design System - Matching Yo Quiero Brands Exactly

### Typography & Text Style

**Hero Headline Pattern (Exact Match):**

- Two-line treatment: First line italic/light in white/light color, Second line bold/black in brand color
- Example Yo Quiero: "Dip It Like You Mean It" → LaMa: "Convenience LIKE YOU MEAN IT"
- First line: `italic font-light text-white/80` (smaller, lighter weight)
- Second line: `font-black text-primary` (larger, bold, brand color)
- Responsive sizes: `text-2xl md:text-3xl lg:text-4xl` (first line), `text-5xl md:text-6xl lg:text-7xl` (second line)

**Section Headers:**

- Large, bold, left-aligned or centered
- Pattern: "Do it all, shop it all" (lowercase "it all", capitalized main words)
- Font: `font-black text-4xl md:text-5xl lg:text-6xl text-secondary`
- No italics, straight and bold

**Body Text Style:**

- Conversational, playful tone: "Hungry yet? We thought so." → "Ready yet? We thought so."
- Short paragraphs, easy to scan
- Font: `text-base md:text-lg text-gray-600` or `text-white/90` on dark backgrounds
- Leading: `leading-relaxed` for readability

**Small Text/Badges:**

- Quality badges: "High-quality, great tasting ingredients" (small, subtle)
- Badge text: `text-sm font-medium text-white/80` or `text-gray-500`
- Product badges (Vegan, Gluten Free): Small rounded badges with background colors

### Layout Patterns (Exact Match)

**Split-Screen Hero:**

- 50/50 split on desktop: Left dark panel (`bg-secondary`, `#1A1A1A`), Right image panel
- Full viewport height: `min-h-screen`
- Stacked on mobile: `flex-col md:flex-row`
- Left panel: Padding `px-6 md:px-12 lg:px-16`, vertical center with `justify-center`
- Right panel: Full height image with `object-cover`, `h-96 md:h-screen`
- Max content width on left: `max-w-xl` or `max-w-2xl`

**Section Spacing:**

- Consistent vertical spacing: `py-12 md:py-16 lg:py-20`
- Horizontal padding: `px-6 md:px-8 lg:px-12`
- Container max-width: `max-w-7xl mx-auto`
- Background alternation: White → Gray-50 → White pattern

**Product Category Grid:**

- Desktop: 3 columns `lg:grid-cols-3`
- Tablet: 2 columns `md:grid-cols-2`
- Mobile: 1 column `grid-cols-1`
- Gap: `gap-6` or `gap-8`
- Cards: White background, border `border-gray-100`, rounded `rounded-2xl`
- Hover: Shadow `hover:shadow-lg`, border color change `hover:border-primary`

**Deal/Recipe Cards:**

- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Card structure: Image on top, title, metadata (prep time/cook time for recipes → savings/expiration for deals)
- Rounded corners: `rounded-xl` or `rounded-2xl`
- Hover: Subtle scale or shadow effect
- Image: `aspect-video` or `aspect-square`, `object-cover`

**CTA Buttons (Detailed Analysis from Yo Quiero):**

**Primary CTA Buttons** (e.g., "Find a Store" in hero, "Where to Buy"):

- **Style**: Dark background (`bg-secondary` / `#1A1A1A`) with vibrant border (brand color)
- **Border**: Prominent border in brand color (green for Yo Quiero → orange `#FF6B35` for LaMa)
- **Border width**: Thin but visible (`border-2` or `border-[2px]`)
- **Text**: White, bold, uppercase (`text-white font-bold uppercase`)
- **Shape**: Rounded corners (`rounded-lg` or `rounded-xl`, not fully rounded)
- **Padding**: Generous (`px-8 py-4` or `px-10 py-5`)
- **Size**: Large and prominent for visibility
- **Layout**: Centered within section, full-width on mobile (`w-full md:w-auto`)
- **Hover**: Background or border color intensifies, subtle scale or shadow

**Secondary CTA Buttons** (e.g., "Our Products"):

- **Style**: Outline/border style with transparent or white background
- **Border**: Colored border (`border-2 border-gray-300` or `border-primary`)
- **Background**: Transparent or white (`bg-transparent` or `bg-white`)
- **Text**: Dark text or brand color (`text-gray-900` or `text-primary`)
- **Shape**: Rounded-full (`rounded-full`) for softer, friendlier feel
- **Padding**: Similar to primary (`px-8 py-4`)
- **Icons**: ArrowRight icon on right side of text (`inline-flex items-center gap-2`)
- **Hover**: Border color changes to primary, background may fill, text color changes

**Navigation "Find a Store" Button** (in navbar):

- **Style**: Distinct from regular nav links
- **Background**: Orange (`#FF6B35`) or dark with orange border
- **Text**: White, bold
- **Shape**: Rounded (`rounded-full` or `rounded-lg`)
- **Size**: Medium, stands out from text links
- **Position**: Right side of navigation, separate from menu items

**Button Layout & Placement:**

- Buttons are centered within their sections when standalone
- Buttons follow content flow and don't break layout rhythm
- Mobile: Full-width or constrained to container
- Desktop: Auto-width or max-width constrained
- Spacing: Adequate margin above/below (`mt-8`, `mb-8`, or `mt-12`)
- Grouped buttons: Horizontal layout with gap (`flex gap-4`)

**Button Text Styles:**

- Primary buttons: Uppercase, bold, large (`text-lg font-bold uppercase`)
- Secondary buttons: Mixed case or title case, bold (`font-bold`)
- All buttons: Clear, action-oriented language ("Find a Store", "Where to Buy", "Get Cookin'", "Dip In")
- Responsive text: `text-base md:text-lg`

### Animation Patterns (Framer Motion)

**Scroll-Triggered Animations:**

- All sections use `whileInView` with `viewport={{ once: true }}`
- Fade + Slide Up: `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}`
- Staggered children: Delay based on index `delay: index * 0.1`
- Duration: `duration: 0.6` for main elements, `duration: 0.5` for cards

**Hero Animations:**

- Left panel: Fade + Slide from left `x: -20`
- Right panel: Fade + Slide from right `x: 20`
- Staggered text elements: Logo (0.2s), Headline (0.3s), Body (0.4s), Badge (0.5s), CTA (0.6s)

**Card Hover Effects:**

- Scale on icon: `group-hover:scale-110 transition-transform`
- Color change: `group-hover:text-primary transition-colors`
- Shadow lift: `hover:shadow-lg transition-shadow`

**Button Animations:**

- Hover: Background color change `hover:bg-primary-dark`
- Optional scale: `hover:scale-105 transition-transform`

### Colors (LaMa Brand - Matching Yo Quiero Vibe with Orange)

**CRITICAL**: Orange (#FF6B35) is the PRIMARY color replacing Yo Quiero's green. All neutral colors match Yo Quiero exactly to maintain the same clean, high-contrast aesthetic.

**Primary Colors (LaMa Brand - Orange):**

- **Primary:** `#FF6B35` (orange) - CTAs, second line of hero headline, accents, hover states, replaces Yo Quiero's green
- **Primary Dark:** `#E55A2B` - Hover states for primary buttons, pressed states

**Secondary/Neutral Colors (Same as Yo Quiero - Pure Neutrals):**

- **Secondary:** `#1A1A1A` (pure black) - Dark panels, navigation background, section headers, main text
- **Keep EXACTLY like Yo Quiero** - maintains clean, high-contrast, modern vibe

**Background Colors (Same as Yo Quiero - Pure Neutrals):**

- **Background White:** `#FFFFFF` (pure white) - Main content sections
- **Background Light:** `#F7F7F7` (cool gray-50) - Alternating sections
- **Background Dark:** `#1A1A1A` (pure black) - Hero left panel, navigation bar
- **Keep EXACTLY like Yo Quiero** - no warm tones

**Text Colors (Same as Yo Quiero - Pure Neutrals):**

- **Text Primary:** `#1A1A1A` (pure black) - Headlines, main text
- **Text Secondary:** `#4A5568` (gray-600) - Body text, descriptions, secondary info
- **Text Light:** `#FFFFFF` (white) - Text on dark backgrounds (navigation, hero)
- **Text Muted (on dark):** `rgba(255, 255, 255, 0.9)` or `white/90` - Subtle text on dark
- **Text Muted (on light):** `rgba(255, 255, 255, 0.8)` or `white/80` - Quality badges
- **Keep EXACTLY like Yo Quiero** - cool grays, not warm

**Border/Divider Colors (Same as Yo Quiero):**

- **Border Light:** `#E2E8F0` (gray-200) or `#F1F5F9` (gray-100) - Card borders, dividers
- **Border Hover:** `#FF6B35` (orange) - Card hover border color, replaces green
- **Navigation Border:** `border-gray-100` - Bottom border on nav (if using light nav variant)

**Color Usage Patterns (Matching Yo Quiero Exactly):**

**Navigation Bar:**

- Background: `#1A1A1A` (pure black) - same as Yo Quiero
- Links: `#FFFFFF` (white) - same as Yo Quiero
- Links hover: `#FF6B35` (orange) - replaces Yo Quiero's green hover
- "Find a Store" button: `#FF6B35` (orange background) or dark with orange border

**Hero Section:**

- Left panel background: `#1A1A1A` (pure black) - same as Yo Quiero
- Headline first line: `rgba(255, 255, 255, 0.8)` (white/80, italic, light) - same as Yo Quiero
- Headline second line: `#FF6B35` (orange, bold) - replaces Yo Quiero's green
- Body text: `rgba(255, 255, 255, 0.9)` (white/90) - same as Yo Quiero
- CTA button: Dark `#1A1A1A` with `#FF6B35` (orange) border - replaces green border

**Content Sections:**

- Backgrounds: Pure white `#FFFFFF` alternating with `#F7F7F7` (cool gray) - same as Yo Quiero
- Section headers: `#1A1A1A` (pure black) or `#FF6B35` (orange) - orange replaces green
- Body text: `#4A5568` (gray-600) - same as Yo Quiero
- Card backgrounds: `#FFFFFF` (pure white) - same as Yo Quiero
- Card borders: `#E2E8F0` or `#F1F5F9` (gray-100/200) - same as Yo Quiero
- Card hover border: `#FF6B35` (orange) - replaces green

**Buttons:**

- Primary CTAs: Dark `#1A1A1A` background with `#FF6B35` (orange) border - replaces green border
- Secondary CTAs: Transparent/white with gray or orange border
- All styling same as Yo Quiero, orange replaces green

**Vibe Matching Checklist:**
✅ Pure black (#1A1A1A) - EXACT same as Yo Quiero
✅ Pure white (#FFFFFF) - EXACT same as Yo Quiero
✅ Cool grays (#F7F7F7, #4A5568) - EXACT same as Yo Quiero
✅ Orange replaces green in all accent positions
✅ High contrast maintained
✅ Clean, bold, modern aesthetic preserved

### Component Specifications

**Navigation Bar:**

- Background: `#1A1A1A` (pure black) - same as Yo Quiero, NOT white/light
- Border: Bottom border `border-b border-gray-100` (optional, subtle)
- Links: White (`#FFFFFF`), medium weight, hover to orange (`#FF6B35`)
- "Find a Store" button: Orange background (`#FF6B35`) or dark with orange border, rounded, stands out from links
- Fixed/Sticky: `fixed top-0 z-50` - header stays at top on scroll

**Product/Deal Cards:**

- Border: `border border-gray-100`
- Padding: `p-6` or `p-8`
- Rounded: `rounded-2xl`
- Image: Full width, rounded top corners, aspect ratio maintained
- Title: Bold, large, `font-bold text-xl md:text-2xl`
- Description/Metadata: Smaller, gray text `text-gray-600 text-sm`

**Section Headers:**

- Large and bold: `text-4xl md:text-5xl lg:text-6xl font-black`
- Centered or left-aligned based on section
- Margin bottom: `mb-4` or `mb-6`
- Subtitle: Smaller, gray, centered below header

### Responsive Breakpoints (Tailwind)

- Mobile: Base styles (320px+)
- Tablet: `md:` prefix (768px+)
- Desktop: `lg:` prefix (1024px+)
- Large Desktop: `xl:` prefix (1280px+) if needed

**Responsive Patterns:**

- Split-screen → Stacked: `flex-col md:flex-row`
- Grid columns: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Font sizes: `text-base md:text-lg lg:text-xl`
- Spacing: `py-12 md:py-16 lg:py-20`
- Padding: `px-4 md:px-6 lg:px-8`

### Specific Section Patterns (Matching Yo Quiero)

**"The star of Your Kitchen" / "The star of Your Deals":**

- Two-line header: "The star of" (italic/light) + "Your Kitchen" (bold)
- Grid of cards with images
- Each card: Image, title, metadata (prep/cook time or savings/expiration)
- CTA button below grid: "Get Cookin'" → "View All Deals"

**"Find your fave":**

- Simple header, left-aligned or centered
- Product cards with badges (Vegan, Gluten Free, etc.)
- Card shows: Image, badges, product name, size/price info
- CTA: "Dip In" → "Shop Now" or "View All Products"

**"Dip Goes Digital" / "Lama Goes Digital":**

- Simple header
- Social media icons in grid or row
- Text: "Like us wherever you like" or similar
- Icon links to social platforms

## Files to Update/Create

1. `components/Navbar.tsx` - Add dropdowns, Deals link, Rewards link, Media dropdown with Blog, style "Find a Store" button
2. `app/page.tsx` - Add deals showcase, rewards section, featured products, social sections (all responsive)
3. `components/Footer.tsx` - Multi-column responsive footer layout (include Rewards link)
4. `app/deals/page.tsx` - Deals/promotions listing page (create, Yo Quiero recipes-style)
5. `lib/dealsData.ts` (NEW) - Deals/promotions data structure
6. `app/services/page.tsx` - Comprehensive responsive services display page
7. `app/media/page.tsx` (NEW) - Media landing page with Blog section
8. `app/rewards/page.tsx` - Rewards page with mobile app showcase (create or update)
9. OR restructure `app/blog/page.tsx` to be under Media
10. Update all existing pages for responsive consistency

## Responsive Design Requirements

All updates must be mobile-first and responsive:

- Test all components at mobile (320px+), tablet (768px+), desktop (1024px+)
- Use Tailwind responsive prefixes: `base` (mobile), `md:` (768px+), `lg:` (1024px+)
- Ensure touch-friendly targets (min 44x44px on mobile)
- Images must be responsive with `next/image`
- Grid layouts must adapt: 1 col → 2 col → 3+ cols
- Text sizes must scale appropriately
- Navigation must work on mobile with dropdown support
- All interactive elements must be accessible on touch devices

## Success Criteria

- Homepage matches Yo Quiero structure exactly (deals instead of recipes)
- Homepage includes LaMa Rewards section with app showcase
- Navigation includes dropdowns, Rewards link, and styled CTAs (responsive)
- Rewards page displays mobile app information comprehensively
- Media page includes Blog section
- Services page is comprehensive and displays all services
- Footer is comprehensive and multi-column (responsive, includes Rewards link)
- All pages use consistent design language
- Fully responsive from the start (mobile-first)
- LaMa brand colors throughout (orange primary, pure neutrals)
- Smooth animations and interactions
- All components update responsively with each change

### To-dos

- [ ] Update Navbar with Products dropdown, Deals link, Rewards link, Media dropdown (Blog, Press Room), and styled Find a Store button - all responsive
- [ ] Add 'The star of Your Deals' section to homepage with responsive deal cards grid
- [ ] Add LaMa Rewards section to homepage with app showcase, benefits, and download buttons - responsive
- [ ] Add 'Find your fave' featured products section to homepage with responsive grid
- [ ] Add 'Lama Goes Digital' social media section to homepage - responsive
- [ ] Create lib/dealsData.ts with deal data structure (Meal Deals, Daily Specials, Weekly Promotions, Combo Offers)
- [ ] Create app/deals/page.tsx with Yo Quiero recipes-style layout, category filters, and responsive grid
- [ ] Create app/media/page.tsx with Blog section using blogData and Press Room placeholder - responsive
- [ ] Create comprehensive app/services/page.tsx with all services in responsive card grid
- [ ] Create or update app/rewards/page.tsx with mobile app showcase, features, how it works, and download buttons - responsive
- [ ] Update Footer.tsx to multi-column responsive layout matching Yo Quiero style (include Rewards link)
- [ ] Verify all pages are responsive (mobile, tablet, desktop) and update any missing breakpoints