# Complete Yo Quiero Brands Design System Analysis
## Ultra Deep Dive - Every Section, Pattern, and Detail

This document contains a comprehensive analysis of the Yo Quiero Brands website (https://yoquierobrands.com/) to enable perfect replication for LaMa convenience store website.

---

## 1. NAVIGATION BAR (Header)

### Structure
- **Fixed/Sticky**: Header appears fixed at top
- **Background**: Dark brown/black solid color (`#1A1A1A` or darker)
- **Height**: Medium height, approximately 64-80px

### Logo
- **Position**: Left-aligned
- **Design**: 
  - "¡YO" in bright green (`#66CC33` or similar vibrant green)
  - "QUIERO!" in white, bold, uppercase
  - Speech bubble inside 'O' with "I WANT" in black text
  - ™ symbol next to brand name
- **Size**: Large, prominent
- **Clickable**: Links to homepage

### Navigation Links
- **Layout**: Horizontal list on desktop
- **Links**: About, Products (dropdown), Recipes, Media (dropdown)
- **Typography**: Sans-serif, medium weight, white/light color
- **Hover State**: Color changes (likely to green/brand color)
- **Spacing**: Evenly distributed, adequate gap between items

### "Find a Store" Button
- **Position**: Right side of navigation, separate from links
- **Style**: Distinct button design
- **Background**: Different from regular links (likely dark or brand color)
- **Text**: "Find a Store" - bold, white
- **Shape**: Rounded (`rounded-full` or `rounded-lg`)
- **Size**: Medium, stands out

### Mobile Menu (Hamburger Icon)
- **Position**: Right side
- **Container**: Light beige/off-white square or rectangle (`#F5F5DC` or similar)
- **Icon**: Three thick horizontal black lines
- **Behavior**: Expands to full menu on click
- **Responsive**: Shows on smaller screens, hides on desktop

### Dropdowns
- **Products Dropdown**: 
  - Hover/click reveals menu
  - Lists all product categories: Avocado, Guacamole, Salsa, Queso, White Dip, Bean Dip, Veggie Dips, Grab & Go, All Products
  - Includes product images in dropdown
  - Two-column layout for categories
- **Media Dropdown**:
  - Blog
  - Press Room

---

## 2. HOMEPAGE SECTIONS (In Order)

### Section 1: Split-Screen Hero

**Left Panel (Dark Background)**
- **Background**: Dark brown/black (`#1A1A1A`)
- **Width**: 50% on desktop, full width on mobile
- **Height**: Full viewport height (`min-h-screen`)
- **Padding**: `px-6 md:px-12 lg:px-16`, vertical center
- **Content Layout**:
  1. **Brand Name/Logo** (if shown again)
  2. **Two-Line Headline**:
     - First line: "Dip It" - italic, light weight, white/light color (`text-white/80`, `italic`, `font-light`)
     - Second line: "Like You Mean It" - bold, black, brand color accent (`font-black`, brand color like green `#66CC33`)
     - Responsive sizes: First `text-2xl md:text-3xl lg:text-4xl`, Second `text-5xl md:text-6xl lg:text-7xl`
  3. **Body Text**: 
     - Conversational tone: "We go all in on our dip game. ¡Yo Quiero! dips are full of flavor, freshness and spunk..."
     - Font: `text-base md:text-lg`, `text-white/90`, `leading-relaxed`
     - Max width constrained
  4. **Quality Badge**: 
     - Small text: "High-quality, great tasting ingredients"
     - `text-sm`, `text-white/80`, `font-medium`
  5. **CTA Button**: "Find a Store" or similar
     - Dark background with brand color border
     - White text, bold, uppercase or title case
     - Rounded corners (`rounded-lg` or `rounded-xl`)
     - Generous padding

**Right Panel (Image)**
- **Width**: 50% on desktop, full width on mobile
- **Height**: Full viewport height
- **Image**: Large product photography, full bleed
- **Object Fit**: `object-cover`
- **Stacking**: Stacks below left panel on mobile (`flex-col md:flex-row`)

**Animation**:
- Left panel: Fade + slide from left (`x: -20`)
- Right panel: Fade + slide from right (`x: 20`)
- Staggered text animations (0.2s, 0.3s, 0.4s, 0.5s, 0.6s delays)

---

### Section 2: "Do it all, dip it all"

**Layout**:
- **Background**: White
- **Container**: Max-width container (`max-w-7xl mx-auto`)
- **Padding**: `py-12 md:py-16 lg:py-20`, `px-6 md:px-8`
- **Text Alignment**: Centered

**Header**:
- **Title**: "Do it all, dip it all"
- **Font**: `text-4xl md:text-5xl lg:text-6xl`, `font-black`, `text-secondary` (black)
- **Pattern**: Lowercase "it all", capitalized main words
- **Margin**: `mb-4` or `mb-6`

**Subtitle**:
- **Text**: "If you're dip-curious, you're in the right place — we've got a flavor for every occasion."
- **Font**: `text-xl`, `text-gray-600`, centered, max-width constrained
- **Margin**: `mb-12`

**Product Category Grid**:
- **Layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Gap**: `gap-6` or `gap-8`
- **Cards**:
  - Background: White
  - Border: `border border-gray-100`
  - Rounded: `rounded-2xl`
  - Padding: `p-6` or `p-8`
  - Hover: `hover:shadow-lg`, `hover:border-primary` (or brand color)
  - Content:
    - Icon (optional, colored)
    - Title: `text-xl font-bold text-secondary`, `mb-2`
    - Description: `text-gray-600 text-sm`

**CTA Button**:
- **Text**: "Our Products"
- **Style**: Secondary/outline style
- **Border**: `border-2 border-gray-300` or `border-primary`
- **Background**: Transparent or white
- **Shape**: `rounded-full`
- **Padding**: `px-8 py-4`
- **Text**: `text-gray-900` or `text-primary`, `font-bold`
- **Icon**: ArrowRight on right side
- **Hover**: Border color changes, background may fill
- **Position**: Centered below grid, `mt-12`

**Animation**:
- Header: Fade + slide up (`y: 20`)
- Cards: Staggered fade + slide up (`delay: index * 0.1`)
- Button: Fade + slide up with delay

---

### Section 3: "Locate the Yo"

**Layout**:
- **Background**: Light gray (`bg-gray-50` or `#F7F7F7`)
- **Container**: Max-width container
- **Padding**: `py-12 md:py-16 lg:py-20`, `px-6 md:px-8`
- **Text Alignment**: Centered

**Header**:
- **Title**: "Locate the Yo"
- **Font**: `text-4xl md:text-5xl lg:text-6xl`, `font-black`, `text-secondary`
- **Margin**: `mb-4`

**Body Text**:
- **Text**: "Satisfy your cravings with spice, bite and a name worth shouting. Our store locator shows you where you can buy ¡Yo Quiero! in your neighborhood."
- **Font**: `text-xl`, `text-gray-600`, centered, max-width constrained
- **Margin**: `mb-12`

**CTA Button**:
- **Text**: "Where to Buy"
- **Style**: Primary style (dark background with brand color border)
- **Background**: Dark (`bg-secondary` / `#1A1A1A`)
- **Border**: Brand color border (`border-2 border-primary` or green `#66CC33`)
- **Text**: White, bold, uppercase
- **Shape**: `rounded-lg` or `rounded-xl`
- **Padding**: `px-8 py-4` or `px-10 py-5`
- **Icon**: MapPin or ArrowRight
- **Hover**: Border/background intensifies

**Animation**:
- Fade + slide up on scroll

---

### Section 4: "The star of Your Kitchen" (Recipes/Deals Section)

**Layout**:
- **Background**: White
- **Container**: Max-width container
- **Padding**: `py-12 md:py-16 lg:py-20`, `px-6 md:px-8`

**Header**:
- **Title**: Two-line treatment
  - First line: "The star of" - italic, light weight, smaller (`italic font-light text-3xl md:text-4xl`)
  - Second line: "Your Kitchen" - bold, larger (`font-black text-4xl md:text-5xl lg:text-6xl text-secondary`)
- **Alignment**: Left-aligned or centered

**Description**:
- **Text**: "We'll let you in on a little secret: You can do more with your dip. Broaden your palate with some of our featured recipes."
- **Font**: `text-lg`, `text-gray-600`
- **Margin**: `mb-8`

**CTA Button** (Above or beside grid):
- **Text**: "Get Cookin'"
- **Style**: Primary or secondary
- **Position**: Left-aligned or beside header

**Cards Grid**:
- **Layout**: Horizontal scrollable carousel OR grid
- **Grid**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (if grid)
- **Gap**: `gap-6`
- **Card Structure**:
  - Image: Top, full width, `aspect-video` or `aspect-square`, `rounded-t-xl`
  - Content: Bottom section with padding
  - Title: `font-bold text-xl`, `mb-2`
  - Metadata: "Prep Time: X min, Cook Time: X min" (for recipes) OR "Save $X, Expires: Date" (for deals)
  - "View Full Recipe" link (for recipes) OR "View Deal" (for deals)
  - Rounded corners: `rounded-xl`
  - Hover: Subtle scale or shadow

**Animation**:
- Scroll-triggered, staggered card animations

---

### Section 5: "Find your fave" (Featured Products)

**Layout**:
- **Background**: Light gray or white
- **Container**: Max-width container
- **Padding**: `py-12 md:py-16 lg:py-20`

**Header**:
- **Title**: "Find your fave"
- **Font**: `text-4xl md:text-5xl lg:text-6xl`, `font-black`, `text-secondary`
- **Alignment**: Left-aligned or centered

**Description** (Optional):
- **Text**: "We both know you get your best recs from your friends. So take it from us, these are some products we think you'll love."
- **Font**: `text-lg`, `text-gray-600`

**CTA Button** (Above grid):
- **Text**: "Dip In"
- **Style**: Primary or secondary

**Product Cards Grid**:
- **Layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Gap**: `gap-6` or `gap-8`
- **Card Structure**:
  - Image: Product photo, `aspect-square` or `aspect-[3/4]`
  - Badges: Small rounded badges (Vegan, Gluten Free, Vegetarian) - positioned top-left or top-right
    - Badge style: Small, rounded, colored background with white text
  - Product Name: `font-bold text-lg`, centered or left-aligned
  - Size/Price: `text-sm text-gray-600`
  - "View Details" link
  - Rounded: `rounded-xl`
  - Hover: Shadow lift, scale slight

---

### Section 6: "Dip Goes Digital" (Social Media)

**Layout**:
- **Background**: Dark (`bg-secondary` / `#1A1A1A`) or light
- **Container**: Max-width container
- **Padding**: `py-12 md:py-16 lg:py-20`

**Header**:
- **Title**: "Dip Goes Digital"
- **Font**: `text-4xl md:text-5xl lg:text-6xl`, `font-black`, white if on dark bg, black if on light

**Subtitle**:
- **Text**: "If you have a heart eyes emoji for our dip, wait till you see our selfies."
- **Font**: `text-lg`, light color

**Sub-header**:
- **Text**: "Like us wherever you like"
- **Font**: Smaller, `text-xl` or `text-2xl`

**Social Icons**:
- **Layout**: Horizontal row or grid
- **Icons**: Instagram, Facebook, Pinterest (common)
- **Size**: Medium-large
- **Spacing**: Even gap between icons
- **Hover**: Color change or scale

---

## 3. PRODUCTS PAGE

### Hero Section
- **Background**: Full-width image with overlay
- **Title**: "PRODUCTS" in large white text on dark overlay
- **Height**: Large hero section
- **Image**: Product photography, `object-cover`

### Category Grid
- **Layout**: Grid of category cards
- **Cards**: 
  - Large background image
  - Category name overlay (dark background with white text)
  - Rounded corners
  - Hover: Slight scale or overlay change
- **Grid**: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- **Aspect Ratio**: Cards are roughly square or wide rectangles

### Individual Product Cards (Within Categories)
- **Image**: Product photo
- **Title**: Product name
- **Badges**: Dietary labels (Vegan, Gluten Free, etc.)
- **Size**: Product size info
- **"View Details"** link

---

## 4. RECIPES PAGE (Will be DEALS for LaMa)

### Hero Section
- Similar to products page hero
- Title: "RECIPES" (or "DEALS" for LaMa)

### Filters/Categories
- **Layout**: Horizontal list or buttons
- **Categories**: Breakfast, Snacks, Dinner, etc. (for recipes) OR Meal Deals, Daily Specials, Weekly Promotions, Combo Offers (for deals)

### Recipe/Deal Cards Grid
- **Layout**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Card Structure**:
  - Image: Top, `aspect-video`
  - Title: Bold, large
  - Metadata: Prep/Cook time (recipes) OR Savings/Expiration (deals)
  - "View Full Recipe" / "View Deal" button or link
  - Rounded: `rounded-xl`
  - Hover: Shadow or scale

---

## 5. BLOG PAGE (Under Media)

### Layout
- Similar to recipes page structure
- **Hero**: Blog title
- **Post Cards Grid**: 
  - Image
  - Title
  - Date
  - Excerpt
  - "Read More" link

---

## 6. FOOTER

### Structure
- **Background**: Dark (`bg-secondary` / `#1A1A1A`)
- **Layout**: Multi-column on desktop, stacked on mobile
- **Padding**: `py-12 md:py-16`, `px-6 md:px-8`

### Columns

**Column 1: Products**
- **Title**: "Products" (if shown)
- **Links**: All product categories listed vertically

**Column 2: About**
- **Links**: About, Fresh Innovations, Find a Store

**Column 3: Media/Support**
- **Links**: Recipes, Blog, Contact Us, Store Request, Broker Assets, Press Room

### Social Media Section
- **Title**: "Like us wherever you like"
- **Icons**: Instagram, Facebook, Pinterest
- **Layout**: Horizontal row

### Bottom Section
- **Copyright**: "Copyright © 2026, ¡Yo Quiero!™ Brands"
- **Legal Links**: Terms & Conditions, Privacy Policy
- **Layout**: Horizontal, space between

### Logo
- **Position**: Left side or top
- **Size**: Medium

---

## 7. BUTTON STYLES - COMPLETE SPECIFICATION

### Primary CTA Buttons
- **Examples**: "Find a Store" (in hero), "Where to Buy"
- **Background**: Dark (`bg-secondary` / `#1A1A1A`)
- **Border**: Brand color border, 2px (`border-2 border-primary` - green `#66CC33` for Yo Quiero, orange `#FF6B35` for LaMa)
- **Text**: White, bold, uppercase (`text-white font-bold uppercase`)
- **Padding**: `px-8 py-4` or `px-10 py-5`
- **Shape**: `rounded-lg` or `rounded-xl` (NOT fully rounded)
- **Hover**: Border/background intensifies, slight scale optional
- **Size**: Large, prominent

### Secondary CTA Buttons
- **Examples**: "Our Products"
- **Background**: Transparent or white (`bg-transparent` or `bg-white`)
- **Border**: Colored border (`border-2 border-gray-300` or `border-primary`)
- **Text**: Dark or brand color (`text-gray-900` or `text-primary`), bold
- **Padding**: `px-8 py-4`
- **Shape**: `rounded-full` (fully rounded)
- **Icons**: ArrowRight icon on right side (`inline-flex items-center gap-2`)
- **Hover**: Border changes to primary, background may fill, text color changes

### Navigation "Find a Store" Button
- **Background**: Dark or brand color
- **Text**: White, bold
- **Shape**: `rounded-full` or `rounded-lg`
- **Size**: Medium
- **Position**: Right side of nav, separate from links

---

## 8. TYPOGRAPHY SYSTEM

### Hero Headlines
- **Two-Line Pattern**:
  - First line: Italic, light weight, white/80 (`italic font-light text-white/80`)
  - Second line: Bold/black, brand color (`font-black text-primary`)
  - Sizes: First `text-2xl md:text-3xl lg:text-4xl`, Second `text-5xl md:text-6xl lg:text-7xl`

### Section Headers
- **Single Line**: `text-4xl md:text-5xl lg:text-6xl font-black text-secondary`
- **Two-Line** (e.g., "The star of Your Kitchen"):
  - First: `italic font-light text-3xl md:text-4xl`
  - Second: `font-black text-4xl md:text-5xl lg:text-6xl text-secondary`

### Body Text
- **Large**: `text-lg md:text-xl text-gray-600`
- **Regular**: `text-base md:text-lg text-gray-600` or `text-white/90` on dark
- **Leading**: `leading-relaxed`

### Small Text/Badges
- **Quality Badge**: `text-sm font-medium text-white/80`
- **Product Badges**: Small, rounded, colored background with white text

---

## 9. COLOR PALETTE (Yo Quiero → LaMa Mapping)

### Yo Quiero Colors
- **Primary Green**: `#66CC33` (bright vibrant green)
- **Secondary/Dark**: `#1A1A1A` (black/dark brown)
- **Background Light**: `#F7F7F7` or `#F5F5DC` (light gray/beige)
- **Text**: Black, white, gray-600

### LaMa Colors (To Use)
- **Primary Orange**: `#FF6B35` (replaces green)
- **Primary Dark**: `#E55A2B` (hover states)
- **Secondary/Dark**: `#1A1A1A` (same)
- **Background Light**: `#F7F7F7` or `gray-50`
- **Text**: Black, white, gray-600

---

## 10. SPACING SYSTEM

### Section Spacing
- **Vertical**: `py-12 md:py-16 lg:py-20`
- **Horizontal**: `px-6 md:px-8 lg:px-12`

### Container
- **Max Width**: `max-w-7xl mx-auto`
- **Padding**: Responsive horizontal padding

### Gap Between Elements
- **Grid Gap**: `gap-6` or `gap-8`
- **Margin Between Sections**: Handled by section padding

---

## 11. ANIMATION PATTERNS

### Scroll-Triggered
- **Pattern**: Fade + Slide Up
- **Initial**: `opacity: 0, y: 20`
- **Animate**: `opacity: 1, y: 0`
- **Trigger**: `whileInView` with `viewport={{ once: true }}`
- **Duration**: `0.6s` for main elements, `0.5s` for cards

### Staggered Animations
- **Delay**: `delay: index * 0.1`
- **Use**: Grid items, list items

### Hover Effects
- **Cards**: Shadow lift (`hover:shadow-lg`), border color change
- **Buttons**: Background/border color change, optional scale
- **Icons**: Scale (`hover:scale-110`)

### Hero Animations
- **Left Panel**: Fade + slide from left (`x: -20`)
- **Right Panel**: Fade + slide from right (`x: 20`)
- **Text Elements**: Staggered (0.2s, 0.3s, 0.4s, 0.5s, 0.6s)

---

## 12. RESPONSIVE BREAKPOINTS

### Tailwind Standard
- **Mobile**: Base (320px+)
- **Tablet**: `md:` (768px+)
- **Desktop**: `lg:` (1024px+)
- **Large Desktop**: `xl:` (1280px+) if needed

### Key Responsive Patterns
- **Split-screen → Stacked**: `flex-col md:flex-row`
- **Grid Columns**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Font Sizes**: `text-base md:text-lg lg:text-xl`
- **Padding**: `px-4 md:px-6 lg:px-8`
- **Spacing**: `py-12 md:py-16 lg:py-20`

---

## 13. IMAGE SPECIFICATIONS

### Hero Images
- **Aspect Ratio**: Full viewport height
- **Object Fit**: `object-cover`
- **Quality**: High resolution

### Product/Deal Cards
- **Aspect Ratio**: `aspect-video` (16:9) or `aspect-square` (1:1)
- **Object Fit**: `object-cover`
- **Rounded**: Top corners only or all corners

### Category Cards
- **Aspect Ratio**: Square or wide rectangle
- **Overlay**: Dark overlay with text

---

## 14. COMPONENT PATTERNS

### Cards
- **Border**: `border border-gray-100`
- **Rounded**: `rounded-xl` or `rounded-2xl`
- **Padding**: `p-6` or `p-8`
- **Background**: White
- **Hover**: Shadow, border color change, optional scale

### Badges
- **Size**: Small
- **Shape**: Rounded (`rounded-full` or `rounded-md`)
- **Background**: Colored (green for Yo Quiero, orange for LaMa)
- **Text**: White, small, bold
- **Position**: Top-left or top-right of card

### Icons
- **Size**: Medium (`w-6 h-6` or `w-8 h-8`)
- **Color**: Brand color or gray
- **Hover**: Scale or color change

---

## 15. PAGE-SPECIFIC DETAILS

### About Page
- Hero section with title
- Content sections with text and images
- Similar spacing and typography patterns

### Contact Page
- Form elements
- Contact information
- Map integration (if applicable)

### Individual Product Pages
- Large product image
- Product details
- Badges
- "Find a Store" CTA

---

## IMPLEMENTATION NOTES FOR LAMA

1. **Replace Recipes with Deals**: All recipe references become deals/promotions
2. **Color Mapping**: Green → Orange (`#FF6B35`)
3. **Content Adaptation**: Maintain structure, adapt content for convenience store
4. **All Sections Responsive**: Mobile-first approach, test all breakpoints
5. **Animation Consistency**: Use Framer Motion, maintain timing patterns
6. **Button Styles**: Match exactly, adapt colors
7. **Typography**: Match sizes, weights, and styles exactly
8. **Spacing**: Use exact spacing patterns

---

*This analysis was completed on [Date] by analyzing https://yoquierobrands.com/ comprehensively.*


