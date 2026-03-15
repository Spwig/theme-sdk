# CSS Load Order

Understanding the CSS cascade is essential for writing effective `overrides.css`. Here's the order in which stylesheets are loaded in the `<head>`.

---

## All Stylesheets Load via `<link>` Tags

When a theme is activated, the platform compiles your theme files (`tokens.css`, `reset.css`, theme `components.css`, `overrides.css`) into a **single combined CSS file** served via URL. This compiled file loads as the first `<link>` tag, followed by platform and utility stylesheets.

| Order | File | Description |
|---|---|---|
| 1 | **Theme CSS** | Compiled theme file (tokens + reset + theme components + overrides) |
| 2 | Platform `components.css` | Core UI components (buttons, cards, product cards, search, etc.) |
| 3 | `base.css` | Platform base layout and utilities |
| 4 | `animations.css` | Global CSS animations |
| 5 | Element CSS | Form builder + element-specific stylesheets (loaded per-page) |
| 6 | Brand CSS | Merchant's branding customizations from the Brand Builder |
| 7 | Header/Footer CSS | Zone layouts, header presets, widget-specific styles |
| 8 | Widget CSS | Cart panel, search autocomplete, mobile menu, footer extras |
| 9 | Cookie banner CSS | Conditional: only if cookie consent is enabled |

---

## What This Means for Theme Developers

### Your overrides.css loads BEFORE platform components.css

Since platform `components.css` is a separate `<link>` tag (position 2) and your `overrides.css` is part of the compiled theme CSS (position 1), the platform stylesheet has **higher specificity by source order** when selectors match equally.

### How to win the cascade

**Option A: Use the same selector specificity** — When your selector is identical to the platform's (e.g., `.product-card:hover`), you may need to increase specificity slightly:

```css
/* Platform: .product-card:hover { transform: translateY(-4px); } */

/* Option 1: Repeat class for specificity bump */
.product-card.product-card:hover {
  transform: translateY(-6px);
}

/* Option 2: Use :where() for zero-specificity reset, then restyle */
```

**Option B: Target more specific states** — Many platform styles use fallback patterns like `var(--theme-element-product-*, var(--fallback))`. Setting the token in `tokens.json` is often enough.

**Option C: Use `!important` sparingly** — Last resort for rare edge cases.

### External @imports are preserved

`@import url('https://...')` statements (e.g., Google Fonts) are kept in the compiled output. The platform only strips relative `@import` statements pointing to other CSS files within the package.

```css
/* Preserved (external): */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');

/* Stripped (relative): */
@import url('./reset.css');
```

### Tokens always come first

Your `tokens.json` values are the first thing in the compiled theme CSS. All platform components reference these tokens via `var(--theme-*)`. Changing a token value in `tokens.json` affects every component that uses it — this is always the most efficient approach.

---

## Decision Tree: Tokens vs Overrides

```
Can tokens.json express this?
├── YES → Edit tokens.json (colors, spacing, fonts, shadows, borders, etc.)
└── NO → Use overrides.css
         ├── Hover animations
         ├── Corner shapes (corner-shape, clip-path)
         ├── Glassmorphism (backdrop-filter)
         ├── Neon glows (multi-layered box-shadow)
         ├── Custom ::selection / ::scrollbar
         ├── ::after / ::before pseudo-elements
         ├── @keyframes animations
         └── Responsive layout tweaks beyond token breakpoints
```

---

## Quick Reference

| I want to change... | Use |
|---|---|
| Button background color | `tokens.json` → `button-primary.solid-bg` |
| Product card border radius | `tokens.json` → `elements.product.card-radius` |
| Product card hover animation | `overrides.css` → `.product-card:hover { ... }` |
| Add squircle corners | `overrides.css` → `corner-shape: squircle` |
| Load a Google Font | `overrides.css` → `@import url(...)` |
| Global font family | `tokens.json` → `typography.font-family-body` |
| Navigation underline on hover | `overrides.css` → `.site-header__nav-link::after` |
| Dark theme scrollbar | `overrides.css` → `::-webkit-scrollbar` |
