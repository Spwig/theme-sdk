# CSS Overrides Guide

The `overrides.css` file lets you add visual personality that goes beyond what design tokens can express: hover animations, corner shapes, glassmorphism, neon glows, and more.

**Prerequisites:** Read [CSS Load Order](./CSS_LOAD_ORDER.md) and [Component Classes](./COMPONENT_CLASSES.md) first.

---

## Table of Contents

1. [Loading External Fonts](#loading-external-fonts)
2. [Selection Color](#selection-color)
3. [Product Card Hover Effects](#product-card-hover-effects)
4. [Image Zoom on Hover](#image-zoom-on-hover)
5. [Category Card Overlays](#category-card-overlays)
6. [Button Enhancements](#button-enhancements)
7. [Navigation Underlines](#navigation-underlines)
8. [Corner Shapes (Progressive Enhancement)](#corner-shapes)
9. [Glassmorphism](#glassmorphism)
10. [Neon Glow Effects](#neon-glow-effects)
11. [Dark Theme Essentials](#dark-theme-essentials)
12. [Responsive Overrides](#responsive-overrides)
13. [Performance Tips](#performance-tips)

---

## Loading External Fonts

External `@import` URLs are preserved by the platform. Place them at the top of `overrides.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
```

Then set the font in `tokens.json`:
```json
"typography": {
  "font-family-heading": "'Playfair Display', serif"
}
```

Or override directly:
```css
h1, h2, h3 {
  font-family: 'Playfair Display', serif;
}
```

---

## Selection Color

Brand your text highlights:

```css
::selection {
  background-color: rgba(37, 99, 235, 0.15);  /* primary at 15% opacity */
  color: var(--theme-color-text);
}
```

---

## Product Card Hover Effects

### Enhanced lift and shadow

```css
.product-card {
  transition:
    box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.07),
    0 12px 24px -4px rgba(0, 0, 0, 0.1);
}
```

### Subtle border glow (dark themes)

```css
.product-card {
  border: 1px solid rgba(6, 182, 212, 0.15);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.product-card:hover {
  border-color: rgba(6, 182, 212, 0.5);
  box-shadow:
    0 0 1px rgba(6, 182, 212, 0.6),
    0 0 8px rgba(6, 182, 212, 0.2);
}
```

---

## Image Zoom on Hover

Slow cinematic zoom for fashion themes:

```css
.product-card__image img,
.product-card__img {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.product-card:hover .product-card__image img,
.product-card:hover .product-card__img {
  transform: scale(1.06);
}
```

### Color overlay on product images

```css
.product-card__image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(225, 29, 72, 0.08) 0%,   /* rose tint */
    transparent 100%
  );
  pointer-events: none;
}
```

---

## Category Card Overlays

### Dark gradient reveal on hover

```css
.category-card__overlay {
  transition: background 0.3s ease;
}

.category-card:hover .category-card__overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.5) 0%,
    transparent 60%
  );
}
```

### Scan-line effect (tech themes)

```css
.category-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 40%,
    rgba(6, 182, 212, 0.08) 50%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 2;
}

.category-card:hover::after {
  opacity: 1;
}
```

---

## Button Enhancements

### Gradient depth (3D look)

```css
.btn--primary {
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.12) 0%,
    transparent 100%
  );
}

.btn--primary:hover:not(:disabled) {
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.18) 0%,
    transparent 100%
  );
}
```

### Gold shimmer (luxury themes)

```css
.btn--primary {
  background-image: linear-gradient(
    120deg,
    transparent 0%,
    transparent 40%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 60%,
    transparent 100%
  );
  background-size: 250% 100%;
  background-position: 100% center;
  transition: background-position 0.6s ease;
}

.btn--primary:hover:not(:disabled) {
  background-position: 0% center;
}
```

### Uppercase precision (tech themes)

```css
.btn--primary,
.btn--secondary {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: calc(var(--theme-font-size-sm) * 0.95);
}
```

---

## Navigation Underlines

### Slide from left

```css
.site-header__nav-link {
  position: relative;
}

.site-header__nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--theme-color-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s var(--theme-transition-easing-default);
}

.site-header__nav-link:hover::after {
  transform: scaleX(1);
}
```

### Expand from center (with glow)

```css
.site-header__nav-link::after {
  /* ...same positioning... */
  transform-origin: center;
  box-shadow: 0 0 4px var(--theme-color-primary);
}
```

---

## Corner Shapes

CSS `corner-shape` (Chrome 139+) modifies corner geometry while preserving native `box-shadow`, `backdrop-filter`, and `overflow`. Falls back gracefully to standard `border-radius` in other browsers.

### Squircle (modern / fashion)

Super-rounded iOS-style corners:

```css
.product-card,
.category-card,
.card {
  corner-shape: squircle;
}

.btn--primary,
.btn--secondary {
  corner-shape: squircle;
}
```

### Bevel (tech / sci-fi)

Angular diagonal cuts:

```css
.product-card,
.category-card {
  corner-shape: bevel;
}
```

### With @supports fallback

For themes that need a more dramatic fallback:

```css
/* Fallback: clip-path for non-corner-shape browsers */
.product-card {
  clip-path: polygon(
    0 0, 100% 0, 100% calc(100% - 16px),
    calc(100% - 16px) 100%, 0 100%
  );
}

@supports (corner-shape: bevel) {
  .product-card {
    clip-path: none;
    border-radius: 16px;
    corner-shape: bevel;
  }
}
```

---

## Glassmorphism

Frosted glass effect for dark themes:

```css
.product-card {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.product-card:hover {
  background: rgba(31, 41, 55, 0.7);
  box-shadow:
    0 0 1px rgba(96, 165, 250, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.3);
}
```

Apply to search bar for consistency:

```css
.search__input-wrapper {
  background: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-color: rgba(255, 255, 255, 0.06);
}
```

---

## Neon Glow Effects

Multi-layered box-shadow creates neon outlines:

```css
.product-card {
  border: 1px solid rgba(6, 182, 212, 0.15);
}

.product-card:hover {
  border-color: rgba(6, 182, 212, 0.5);
  box-shadow:
    0 0 1px rgba(6, 182, 212, 0.6),   /* tight glow */
    0 0 8px rgba(6, 182, 212, 0.2),   /* medium spread */
    0 4px 16px rgba(0, 0, 0, 0.3);     /* depth shadow */
}
```

Neon button glow:

```css
.btn--primary:hover:not(:disabled) {
  box-shadow:
    0 0 4px rgba(6, 182, 212, 0.4),
    0 0 12px rgba(6, 182, 212, 0.15);
}
```

---

## Dark Theme Essentials

Dark themes need explicit overrides for browser-level elements:

### Body background

```css
html,
body {
  background-color: var(--theme-color-background);
  color: var(--theme-color-text);
}
```

### Scrollbar

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--theme-color-background-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--theme-color-border-dark);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--theme-color-primary);
}
```

### Selection

```css
::selection {
  background-color: rgba(96, 165, 250, 0.25);
  color: var(--theme-color-text);
}
```

---

## Responsive Overrides

Disable hover transforms on touch devices:

```css
@media (max-width: 768px) {
  .product-card:hover {
    transform: none;
  }
}
```

Or use the hover media query:

```css
@media (hover: none) {
  .product-card:hover {
    transform: none;
    box-shadow: var(--theme-element-product-card-shadow);
  }
}
```

---

## Performance Tips

1. **Prefer `transform` and `opacity`** — GPU-accelerated, no layout recalculation
2. **Avoid `filter: drop-shadow()`** — Slower than native `box-shadow`; use `corner-shape` instead of `clip-path` when possible
3. **Use `will-change` sparingly** — Only for elements with complex animations
4. **Keep selectors simple** — `.product-card:hover` is faster than `div.product-card:hover > .product-card__image`
5. **Minimize `backdrop-filter` usage** — Apply to specific elements, not containers
6. **Use CSS custom properties** — `var(--theme-color-primary)` enables runtime theming without duplicate rules

---

## Real-World Examples

The Spwig platform ships with 6 hand-crafted themes demonstrating these techniques:

| Theme | Techniques Used |
|---|---|
| **Modern Shop** | Squircle corners, gradient buttons, nav underline from left |
| **Modern Dark** | Squircle + glassmorphism, blue glow, glass search bar, scrollbar |
| **Elegant Shop** | Gold shimmer buttons, slow transitions, editorial nav, Playfair Display |
| **Apparel Theme** | Squircle, rose overlay, slow image zoom, Cormorant Garamond |
| **Tech Theme** | Bevel corners, cyan neon borders, scan-line hover, Rajdhani |
| **Space Theme** | Bevel + clip-path fallback, green glow, Orbitron font |
