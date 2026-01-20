# Yo Quiero Brands - "The star of Your Kitchen" Section Deep Analysis

## Overview
This document provides a comprehensive analysis of the recipe/deal card section styling, animations, and color schemes from Yo Quiero Brands website (https://yoquierobrands.com/).

## Section Structure

### Section Header
- **Two-line Header Pattern:**
  - First line: `"The star of"` - Italic, lighter weight, smaller size
  - Second line: `"Your Kitchen"` - Bold/black, larger size
- **Description Text:** Below header, gray body text
- **CTA Button:** "Get Cookin'" button (white background, black text, rounded corners)

### Card Container
- **Layout Type:** Horizontal scrolling carousel (on mobile/tablet) or grid (desktop)
- **Container:** `overflow-x-auto` with `scrollbar-hide` class
- **Spacing:** Cards have consistent gap between them (approximately `gap-6` or `gap-8`)

---

## Card Structure (Individual Recipe/Deal Card)

### Card Dimensions
- **Width:** Approximately `350px` to `400px` (fixed width for carousel)
- **Aspect Ratio:** Image section maintains aspect ratio (likely `aspect-video` or `4:3`)
- **Border Radius:** `rounded-xl` or `rounded-2xl` for the card container
- **Background:** White (`#FFFFFF`) for card body

### Card Layout Components (Top to Bottom)

#### 1. Image Section
- **Position:** Top of card
- **Height:** Approximately `aspect-video` or `h-64` to `h-80`
- **Overflow:** `overflow-hidden` on container
- **Image Style:**
  - `object-cover` to fill container
  - Full width of card
  - Border radius on top corners only: `rounded-t-xl` or `rounded-t-2xl`
- **Hover Effect:** Image scales slightly on hover (`scale-110` or `scale-105`)
- **Transition:** Smooth transition (`transition-transform duration-300` or `duration-500`)

#### 2. Title Section (Below Image)
- **Background:** White (`#FFFFFF`)
- **Padding:** `p-6` or `p-8`
- **Typography:**
  - Font: Sans-serif, bold
  - Size: `text-xl` to `text-2xl`
  - Color: Black (`#1A1A1A` or `#000000`)
  - Weight: `font-bold` or `font-black`
- **Position:** First element in white card body

#### 3. Metadata Section (Prep Time / Cook Time)
- **Background:** Dark gray (`#2D2D2D` or `#1A1A1A`) - matches dark theme
- **Padding:** `px-4 py-3` or `p-4`
- **Typography:**
  - Font: Sans-serif
  - Size: `text-sm` or `text-xs`
  - Color: Light gray (`#9CA3AF` or `rgba(255, 255, 255, 0.8)`)
  - Format: "Prep Time: X min | Cook Time: Y min"
  - Style: Uppercase or mixed case with pipe separator

#### 4. CTA Button (Bottom of Card)
- **Background:** Dark gray/black (`#1A1A1A` or `#2D2D2D`)
- **Text Color:** White (`#FFFFFF`)
- **Shape:** Rectangle with slightly rounded corners (`rounded-lg`)
- **Padding:** `px-6 py-3` or `px-8 py-4`
- **Typography:**
  - Font: Sans-serif, bold
  - Size: `text-sm` to `text-base`
  - Style: "View Full Recipe" or "View Details"
- **Hover Effect:** 
  - Background may lighten slightly
  - Possible scale effect (`hover:scale-105`)

---

## Color Scheme

### Primary Colors
- **Background (Dark Sections):** `#1A1A1A` (pure black) or `#2D2D2D` (dark gray)
- **Background (Card):** `#FFFFFF` (pure white)
- **Background (Section):** White or light gray (`#F7F7F7`)
- **Text (Primary):** `#1A1A1A` or `#000000` (black)
- **Text (Secondary):** `#4A5568` or `#6B7280` (gray-600)
- **Text (Light on Dark):** `#FFFFFF` (white) or `rgba(255, 255, 255, 0.9)` (white/90)
- **Text (Metadata):** `#9CA3AF` (gray-400) or `rgba(255, 255, 255, 0.7)` (white/70)

### Accent Colors (Yo Quiero uses Green, LaMa uses Orange)
- **Primary Accent:** `#2E7D32` (Yo Quiero green) → `#FF6B35` (LaMa orange)
- **Hover Accent:** Slightly darker/lighter variant

---

## Typography

### Section Header
```css
/* First Line (Italic) */
font-style: italic;
font-weight: 300-400 (light);
font-size: 2rem - 3rem (text-3xl to text-4xl);
color: #1A1A1A or #FFFFFF (depending on background);

/* Second Line (Bold) */
font-weight: 900 (black);
font-size: 3rem - 4rem (text-4xl to text-5xl);
color: #1A1A1A or brand accent color;
```

### Card Title
```css
font-weight: 700-900 (bold to black);
font-size: 1.25rem - 1.5rem (text-xl to text-2xl);
color: #1A1A1A (black);
line-height: 1.2;
```

### Metadata Text
```css
font-weight: 400-500 (regular to medium);
font-size: 0.75rem - 0.875rem (text-xs to text-sm);
color: #9CA3AF (gray-400) or rgba(255, 255, 255, 0.8);
text-transform: uppercase (optional);
```

### Button Text
```css
font-weight: 700 (bold);
font-size: 0.875rem - 1rem (text-sm to text-base);
color: #FFFFFF (white);
text-transform: uppercase (optional);
```

---

## Animations & Transitions

### Card Hover Effects
1. **Image Zoom:**
   ```css
   transform: scale(1.05) or scale(1.1);
   transition: transform 300ms ease or 500ms ease;
   ```
2. **Card Shadow Lift:**
   ```css
   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
   transition: box-shadow 300ms ease;
   ```
3. **Border Color Change:**
   ```css
   border-color: #FF6B35 (brand accent);
   transition: border-color 300ms ease;
   ```

### Scroll-Triggered Animations (Framer Motion)
- **Entry Animation:**
  ```javascript
  initial={{ opacity: 0, x: 50 }} // Slide in from right
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
  ```
- **Staggered Delay:** Each card has incremental delay (`index * 0.1`)

### Carousel Navigation
- **Prev/Next Buttons:** Square buttons with rounded corners, white background, black chevron icons
- **Button Hover:** Slight scale or background color change
- **Progress Indicators:** Horizontal lines or dots below carousel

---

## Spacing & Layout

### Section Padding
- **Vertical:** `py-12 md:py-16 lg:py-20` (48px mobile, 64px tablet, 80px desktop)
- **Horizontal:** `px-6 md:px-8` (24px mobile, 32px tablet)

### Card Spacing
- **Gap Between Cards:** `gap-6` (24px) or `gap-8` (32px)
- **Internal Card Padding:** `p-6` (24px) or `p-8` (32px)
- **Image to Title Gap:** Inherited from padding
- **Title to Metadata Gap:** `mb-2` or `mb-3` (8px-12px)
- **Metadata to Button Gap:** `mt-4` or `mt-6` (16px-24px)

### Container Max Width
- **Max Width:** `max-w-7xl` (1280px) centered with `mx-auto`

---

## Button Styles

### "View Full Recipe" / CTA Button
```css
/* Base Styles */
background-color: #1A1A1A (dark gray/black);
color: #FFFFFF (white);
border-radius: 0.5rem (rounded-lg);
padding: 0.75rem 1.5rem (px-6 py-3);
font-weight: 700 (bold);
font-size: 0.875rem (text-sm);
text-transform: uppercase (optional);
width: 100% (full width of card);
transition: all 300ms ease;

/* Hover States */
:hover {
  background-color: #2D2D2D (slightly lighter);
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

### "Get Cookin'" Section Button
```css
/* Base Styles */
background-color: #FFFFFF (white);
color: #1A1A1A (black);
border: 2px solid #E5E7EB (gray-200);
border-radius: 0.5rem (rounded-lg);
padding: 0.75rem 1.5rem (px-6 py-3);
font-weight: 700 (bold);
transition: all 300ms ease;

/* Hover States */
:hover {
  border-color: #FF6B35 (brand accent);
  color: #FF6B35;
  transform: scale(1.05);
}
```

---

## Responsive Behavior

### Mobile (< 768px)
- Cards in horizontal scroll container
- Fixed card width: `350px`
- Touch-friendly scrolling
- Reduced padding: `py-12 px-6`
- Smaller font sizes

### Tablet (768px - 1024px)
- Cards may show 2 per row or remain horizontal scroll
- Card width: `400px`
- Medium padding: `py-16 px-8`

### Desktop (> 1024px)
- Cards may show in grid (3 columns) or remain carousel
- Full padding: `py-20`
- Larger font sizes

---

## Implementation Notes for LaMa

### Adaptations Needed
1. **Replace "Recipes" with "Deals":** Update copy and metadata structure
2. **Metadata Format:** Change "Prep Time | Cook Time" to "Savings | Expiration Date"
3. **Color Accents:** Use orange (`#FF6B35`) instead of green
4. **Button Text:** "View Full Recipe" → "View Deal" or "Get Deal"
5. **Card Content:** Recipe images → Deal/promo images

### Code Structure Example (React/Next.js + Framer Motion)
```tsx
<motion.div
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
  className="flex-shrink-0 w-[350px] md:w-[400px]"
>
  <Link
    href="/deals/[id]"
    className="block bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary transition-all group"
  >
    {/* Image Section */}
    <div className="relative w-full aspect-video overflow-hidden">
      <Image
        src={deal.image}
        alt={deal.title}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    
    {/* Title Section */}
    <div className="p-6">
      <h3 className="text-xl md:text-2xl font-black text-secondary mb-4">
        {deal.title}
      </h3>
    </div>
    
    {/* Metadata Section */}
    <div className="px-6 pb-4">
      <div className="bg-secondary text-white/90 px-4 py-3 rounded-lg">
        <p className="text-xs uppercase tracking-wide">
          {deal.savings} | Expires {deal.expirationDate}
        </p>
      </div>
    </div>
    
    {/* CTA Button */}
    <div className="px-6 pb-6">
      <button className="w-full bg-secondary hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-bold text-sm uppercase transition-all duration-300 hover:scale-105">
        View Deal
      </button>
    </div>
  </Link>
</motion.div>
```

---

## Key Takeaways

1. **Card Structure:** Image → Title → Metadata (dark bg) → CTA Button (dark bg)
2. **Color Contrast:** White cards on light background, dark metadata/buttons for contrast
3. **Hover Effects:** Subtle image zoom, shadow lift, border color change
4. **Animation:** Slide in from right with staggered delays
5. **Typography:** Bold titles, light metadata, uppercase buttons
6. **Spacing:** Generous padding, consistent gaps, clear hierarchy
7. **Buttons:** Dark background with rounded corners (not fully rounded)
8. **Responsive:** Horizontal scroll on mobile, grid/carousel on desktop

---

## References
- Source: https://yoquierobrands.com/
- Section: "The star of Your Kitchen"
- Date Analyzed: January 2025




