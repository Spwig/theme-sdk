# Starter Theme Design Guidelines

This document establishes the design principles and e-commerce best practices for the Starter Theme. All components should follow these guidelines to create a cohesive, conversion-optimized shopping experience.

## Design Philosophy

The Starter Theme follows a **"confident simplicity"** approach:
- Clean, uncluttered layouts that let products shine
- Strategic use of color to guide customer actions
- Trust-building elements that reduce purchase anxiety
- Mobile-first responsive design
- Accessibility as a core feature, not an afterthought

---

## Color Psychology for E-Commerce

### Primary Color - Trust Blue (#2563eb)

Blue is the most universally trusted color across cultures. We use it for:
- Primary navigation and links
- Brand elements
- Secondary action buttons
- Information highlights

**Why:** Blue reduces anxiety and creates confidence, essential for online purchases.

### Call-to-Action - Warm Amber (#f59e0b)

Amber/orange creates urgency without aggression. We use it for:
- "Add to Cart" buttons
- Primary CTA buttons
- Important highlights
- Sale badges and promotions

**Why:** Warm colors drive action. Amber is inviting rather than alarming.

### Success - Confident Green (#10b981)

Green signals positive outcomes. We use it for:
- Purchase confirmations
- In-stock indicators
- Success messages
- Discount amounts

**Why:** Green universally represents "go" and positive outcomes.

### Sale/Promotional - Vibrant Orange (#f97316)

For promotional content (NOT error red):
- Sale badges
- Limited time offers
- Promotional banners
- Discount percentages

**Why:** Red triggers alarm; orange conveys excitement and opportunity.

### Text Colors

- **Primary text:** #0f172a (near-black for maximum readability)
- **Secondary text:** #475569 (meets WCAG AA contrast)
- **Muted text:** #64748b (for less important info, still accessible)

### Background Colors

- **Page background:** #ffffff (clean, products pop)
- **Section background:** #f8fafc (subtle separation)
- **Card background:** #ffffff (elevated on colored sections)

### The 60-30-10 Rule

Apply colors in these proportions:
- **60% Neutral** (whites, grays) - backgrounds, containers
- **30% Primary** (blues) - headers, navigation, secondary elements
- **10% Accent** (amber) - CTAs, highlights, important actions

---

## Typography

### Font Choices

- **Headings:** System font stack (clean, performant)
  ```css
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  ```

- **Body:** Same stack for consistency

### Type Scale (1.25 ratio)

| Name | Size | Use |
|------|------|-----|
| xs | 0.75rem | Fine print, badges |
| sm | 0.875rem | Secondary text, metadata |
| base | 1rem | Body text, product info |
| lg | 1.125rem | Lead text, important info |
| xl | 1.25rem | Section subheadings |
| 2xl | 1.5rem | Card headings |
| 3xl | 1.875rem | Section headings |
| 4xl | 2.25rem | Page titles, hero text |

### Line Height

- **Headings:** 1.2 (tight, impactful)
- **Body text:** 1.6 (comfortable reading)
- **UI text:** 1.4 (balanced)

### Maximum Line Width

Keep body text at **65-75 characters** per line for optimal readability:
```css
max-width: 65ch;
```

---

## Layout Principles

### F-Pattern Hierarchy

Users scan in an F-pattern. Place key elements accordingly:
- **Top-left:** Logo/brand (first fixation point)
- **Top-right:** Cart, account, search (expected location)
- **Left side:** Navigation, filters
- **Center:** Main content, products

### Visual Hierarchy

Create clear hierarchy using:
1. **Size** - Larger elements are more important
2. **Color** - Accent color draws attention
3. **Spacing** - More space = more importance
4. **Position** - Top and left are scanned first

### Spacing System

Use consistent spacing multipliers:
- **Base unit:** 4px
- **Scale:** 4, 8, 12, 16, 24, 32, 48, 64, 96px

Relationship between elements:
- **Related items:** 8-16px apart
- **Grouped sections:** 24-32px apart
- **Major sections:** 48-96px apart

### Container Widths

- **Max content width:** 1200px
- **Narrow content:** 800px (for text-heavy pages)
- **Full width:** 100% (for heroes, banners)

### Grid System

- **Product grids:** 4 columns (desktop) → 3 → 2 → 1 (mobile)
- **Content grids:** 12-column base
- **Gutters:** 24px (desktop), 16px (mobile)

---

## Component Patterns

### Buttons

**Primary (CTA):**
- Background: Amber (#f59e0b)
- Text: White
- Use: Add to Cart, Checkout, Subscribe

**Secondary:**
- Background: Transparent
- Border: Primary blue
- Text: Primary blue
- Use: Continue Shopping, View Details

**States:**
- Hover: Darken 10%, slight lift (translateY -1px)
- Active: Darken 15%, no lift
- Disabled: 50% opacity, no pointer events
- Loading: Show spinner, disable

### Cards

**Product cards must include:**
1. Product image (aspect ratio 1:1 or 4:5)
2. Product title
3. Price (sale price in accent color)
4. Rating stars (if reviews exist)
5. Hover state with quick-add option

**Styling:**
- Subtle shadow on hover
- Border-radius: 8px
- Padding: 16px on content area

### Forms

**Input fields:**
- Height: 44px minimum (touch-friendly)
- Border: 1px solid #d1d5db
- Focus: Primary blue border, subtle shadow
- Error: Red border, error message below

**Labels:**
- Above input, not floating
- Font-weight: medium
- Required indicator: red asterisk

### Trust Signals

Place near purchase actions:
- Security badges (SSL, payment)
- Shipping information
- Return policy highlights
- Customer service contact

---

## Conversion Optimization

### Above the Fold

Critical elements for homepage above fold:
1. Value proposition (what makes you different)
2. Primary CTA
3. Trust indicator
4. Navigation to key categories

### Product Pages

Must include:
1. High-quality images (multiple angles)
2. Clear price and availability
3. Prominent Add to Cart
4. Trust badges near CTA
5. Shipping/return info
6. Social proof (reviews, ratings)

### Reduce Friction

- Minimize form fields
- Show progress in checkout
- Offer guest checkout
- Display security indicators
- Provide multiple payment options
- Show shipping costs early

### Create Urgency (Authentically)

- Low stock indicators
- Sale end dates
- Limited edition labels
- Recently purchased notifications

---

## Mobile-First Design

### Touch Targets

Minimum touch target: **44x44px**

Apply to:
- Buttons
- Links in navigation
- Form inputs
- Quantity selectors
- Close buttons

### Mobile Navigation

- Hamburger menu icon (3 horizontal lines)
- Full-screen or drawer navigation
- Large touch targets for menu items
- Clear close button
- Search prominently accessible

### Mobile Product Experience

- Swipeable image galleries
- Sticky add-to-cart bar
- Collapsible description sections
- Easy quantity adjustment
- Thumb-zone optimization

### Responsive Breakpoints

```css
/* Mobile first */
/* Small (640px) */
@media (min-width: 640px) { }
/* Medium (768px) */
@media (min-width: 768px) { }
/* Large (1024px) */
@media (min-width: 1024px) { }
/* Extra large (1280px) */
@media (min-width: 1280px) { }
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast:**
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- UI components: 3:1 minimum

**Keyboard Navigation:**
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip links for main content

**Screen Readers:**
- Semantic HTML structure
- ARIA labels for icons
- Alt text for images
- Form labels and error messages

**Motion:**
- Respect prefers-reduced-motion
- No auto-playing video/audio
- Pausable animations

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### ARIA Patterns

- `aria-expanded` for toggles
- `aria-current="page"` for navigation
- `aria-live="polite"` for updates
- `role="alert"` for errors
- `aria-label` for icon buttons

---

## Performance Guidelines

### Images

- Use WebP with JPEG fallback
- Lazy load below-fold images
- Provide width/height to prevent layout shift
- Use responsive images (srcset)
- Compress to < 200KB for heroes

### CSS

- Use CSS custom properties for theming
- Minimize specificity
- Use logical properties for RTL support
- Avoid expensive properties (box-shadow, filter) in animations
- Use transform and opacity for animations

### JavaScript

- Minimal, progressive enhancement
- Defer non-critical scripts
- Use event delegation
- Debounce scroll/resize handlers
- Lazy load components below fold

### Critical Rendering Path

- Inline critical CSS
- Preload key assets (fonts, hero image)
- Defer non-critical CSS
- Minimize render-blocking resources

---

## Component Checklist

When creating or updating a component, verify:

### Design
- [ ] Follows color palette
- [ ] Uses spacing system
- [ ] Maintains visual hierarchy
- [ ] Works with 60-30-10 rule

### Responsive
- [ ] Mobile-first CSS
- [ ] Touch-friendly targets (44px)
- [ ] Readable on all screen sizes
- [ ] No horizontal scroll

### Accessibility
- [ ] Semantic HTML
- [ ] ARIA labels where needed
- [ ] Keyboard navigable
- [ ] Sufficient color contrast
- [ ] Focus states visible

### Conversion
- [ ] Clear CTAs
- [ ] Trust signals present
- [ ] Minimal friction
- [ ] Error states handled

### Performance
- [ ] Lazy loading for images
- [ ] Efficient CSS selectors
- [ ] Minimal JavaScript
- [ ] No layout shift

### Internationalization
- [ ] Translatable fields marked
- [ ] Text expansion considered
- [ ] RTL-compatible layout
- [ ] No hardcoded strings

---

## File Organization

```
starter-theme/
├── manifest.json           # Theme metadata
├── design_tokens.json      # Design system values
├── DESIGN_GUIDELINES.md    # This document
├── README.md               # Developer getting started
├── assets/
│   ├── theme.js           # Main JavaScript
│   └── styles/
│       └── global.css     # Global styles
├── components/
│   ├── headers/           # Header components
│   ├── footers/           # Footer components
│   └── sections/          # Page sections
├── templates/             # Page templates
└── pages/                 # Page configurations
```

---

## Summary

The Starter Theme should:

1. **Build trust** through professional design and clear communication
2. **Drive action** with strategic color use and clear CTAs
3. **Remove friction** with intuitive layouts and helpful feedback
4. **Be accessible** to all users regardless of ability
5. **Perform fast** with optimized assets and efficient code
6. **Scale globally** with translation support and RTL compatibility

Every design decision should answer: "Does this help customers confidently complete their purchase?"
