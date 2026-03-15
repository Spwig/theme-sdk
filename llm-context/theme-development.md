# Spwig Theme SDK v2.0 — LLM Context

You are assisting with Spwig eCommerce theme development. This document contains everything you need to know about the theme system.

---

## Architecture

Spwig themes are **token-based configuration** — no templates, no components, no JavaScript. You define design tokens (colors, typography, spacing, element styles) in JSON and the platform renders everything using CSS custom properties.

### Theme Tiers
- **Tier 1** (minimal): `manifest.json` + `tokens.json` + optional `overrides.css`
- **Tier 2** (full): Tier 1 + `presets/` directory with header/footer JSON files

### File Structure
```
my-theme/
├── manifest.json       # Theme metadata (name, version, author, etc.)
├── tokens.json         # Design system values — the primary deliverable
├── overrides.css       # Optional: CSS beyond what tokens cover
├── preview.png         # Optional: Theme preview image
└── presets/            # Optional (Tier 2): Header/footer layout presets
    ├── headers/
    │   └── *.json
    └── footers/
        └── *.json
```

### How Tokens Become CSS
1. Developer writes `tokens.json` with design values
2. Platform converts tokens to CSS custom properties (`--theme-*`)
3. All platform components reference these variables
4. Changing a token changes every component that uses it

---

## Token Categories and CSS Variable Mapping

**IMPORTANT:** The CSS variable prefix is NOT uniform across categories. Use this table:

| Token Category | CSS Variable Prefix | Example Token | Example CSS Variable |
|---|---|---|---|
| `colors` | `--theme-color-` | `colors.primary` | `--theme-color-primary` |
| `dark` | `--theme-dark-` | `dark.background` | `--theme-dark-background` |
| `typography` (fonts) | `--theme-font-` | `typography.font-sans` | `--theme-font-sans` |
| `typography` (sizes) | `--theme-font-size-` | `typography.font-size-lg` | `--theme-font-size-lg` |
| `typography` (weights) | `--theme-font-weight-` | `typography.font-weight-bold` | `--theme-font-weight-bold` |
| `typography` (line-height) | `--theme-line-height-` | `typography.line-height-normal` | `--theme-line-height-normal` |
| `typography` (letter-spacing) | `--theme-letter-spacing-` | `typography.letter-spacing-wide` | `--theme-letter-spacing-wide` |
| `spacing` | `--theme-space-` | `spacing.4` | `--theme-space-4` |
| `borders` (width) | `--theme-border-width-` | `borders.width-1` | `--theme-border-width-1` |
| `borders` (radius) | `--theme-radius-` | `borders.radius-md` | `--theme-radius-md` |
| `shadows` | `--theme-shadow-` | `shadows.lg` | `--theme-shadow-lg` |
| `transitions` (duration) | `--theme-transition-duration-` | `transitions.duration-fast` | `--theme-transition-duration-fast` |
| `transitions` (easing) | `--theme-transition-easing-` | `transitions.easing-default` | `--theme-transition-easing-default` |
| `breakpoints` | `--theme-breakpoint-` | `breakpoints.md` | `--theme-breakpoint-md` |
| `responsive` | `--theme-responsive-` | `responsive.scale-mobile-text` | `--theme-responsive-scale-mobile-text` |
| `z-index` | `--theme-z-` | `z-index.modal` | `--theme-z-modal` |
| `container` | `--theme-container-` | `container.max-width` | `--theme-container-max-width` |
| `menu` | `--theme-menu-` | `menu.text-color` | `--theme-menu-text-color` |
| `header` | `--theme-header-` | `header.background` | `--theme-header-background` |
| `header.zones` | `--theme-header-zones-` | `header.zones.top-bar.background` | `--theme-header-zones-top-bar-background` |
| `footer` | `--theme-footer-` | `footer.background` | `--theme-footer-background` |
| `footer.zones` | `--theme-footer-zones-` | `footer.zones.main.padding-y` | `--theme-footer-zones-main-padding-y` |
| `search` | `--theme-search-` | `search.input-bg` | `--theme-search-input-bg` |
| `button-{variant}` | `--theme-element-button-{variant}-` | `button-primary.solid-bg` | `--theme-element-button-primary-solid-bg` |
| `card-{style}` | `--theme-element-card-{style}-` | `card-elevated.shadow` | `--theme-element-card-elevated-shadow` |
| `elements` | `--theme-element-{type}-` | `elements.button.radius` | `--theme-element-button-radius` |
| `widgets` | `--theme-widget-{type}-` | `widgets.cart.badge-bg` | `--theme-widget-cart-badge-bg` |

### Core Design Tokens
| Category | ~Keys | Description |
|---|---|---|
| `colors` | 37 | primary, secondary, accent (each with hover/light/dark), text variants, backgrounds, surfaces, borders, semantic (success/error/warning/info) |
| `dark` | 24 | Dark mode overrides: backgrounds (3), surfaces (3), text (4), borders (3), primary-light, status -light variants (4), overlay, shadows (5) |
| `typography` | 48 | font-family, font-size xs-5xl, font-weight, line-height, letter-spacing |
| `spacing` | 13 | Scale 0-24 (0 to 6rem) |
| `borders` | 10 | width-0/1/2, radius-none/sm/base/md/lg/xl/full |
| `shadows` | 6 | none, sm, base, md, lg, xl |
| `transitions` | 6 | duration-fast/base/slow, easing-default/in/out |

### Component Tokens
| Category | ~Keys | Description |
|---|---|---|
| `menu` | 19 | text-color, background, dropdown, padding, font, animations |
| `header` | 10+ | background, text-color, border, padding, logo-height, icon-size + zones (top-bar, main-header, bottom-bar, mega-menu-bar) |
| `footer` | 10+ | background, text/link/heading/muted colors, padding + zones (top, main, bottom) |
| `search` | 47 | Desktop: input, button, dropdown, results. Mobile: overlay, backdrop, trigger |

### Button Variant Tokens (4 variants)
Each of `button-primary`, `button-secondary`, `button-neutral`, `button-danger`:
- `solid-bg`, `solid-bg-hover`, `solid-text`, `solid-border`
- `outline-bg`, `outline-bg-hover`, `outline-text`, `outline-border`
- `ghost-bg`, `ghost-bg-hover`, `ghost-text`
- `focus-ring-color`

### Card Style Tokens (4 styles)
Each of `card-default`, `card-elevated`, `card-bordered`, `card-minimal`:
- `bg`, `border-width`, `border-color`, `border-color-hover`, `shadow`, `shadow-hover`

### Element Tokens (`elements.{type}`)
| Element | ~Keys | Description |
|---|---|---|
| `hero` | 10 | bg, min-height, padding, title/subtitle size, subtitle-color, text-color, overlay |
| `button` | 27 | font, sizing (sm/md/lg), padding, radius, border, transitions, focus ring |
| `card` | 25 | bg, border, radius, shadow, padding, gap, transitions, title/text/meta |
| `product` | 86 | Card, image (aspect-ratio, zoom, overlay), content, title, price, badges, button (bg, color, bg-hover), actions, rating |
| `category` | 82 | Banner, header, card, chips, sort, pagination, grid |
| `form` | 50 | input, labels, errors, checkboxes, radios |
| `heading` | 84 | Per-level (h1-h6): font-family, size, weight, transform, color |

### Widget Tokens (`widgets.{type}`)
| Widget | ~Keys | Description |
|---|---|---|
| `account` | 14 | icon-size/color, dropdown, link colors |
| `cart` | 18 | icon, badge, dropdown, panel |
| `announcement` | 28 | bar, link, close-btn, modal |
| `newsletter` | 27 | title, input, button, success/error |
| `social` | 12 | icon size/color/hover/bg |
| `currency` | 48 | Select, button variants, dropdown |

---

## Token Value Rules

- All values **MUST be strings**: `"400"` not `400`, `"0"` not `0`
- Can reference other tokens: `"var(--theme-color-primary)"`
- `var()` references MUST use `--theme-` prefix
- Color formats: hex `#RRGGBB`, `rgb()`, `rgba()`, `hsl()`, `hsla()`
- Spacing: CSS length units (`px`, `rem`, `em`, `%`)

---

## manifest.json

### Required Fields
| Field | Type | Rules |
|---|---|---|
| `name` | string | Lowercase, hyphens only, 2-50 chars, pattern `^[a-z][a-z0-9-]*$` |
| `version` | string | Semver `X.Y.Z` |
| `display_name` | string | 1-100 chars |
| `description` | string | 10-1000 chars |
| `author` | string | 1-100 chars |

### Optional Fields
| Field | Type | Description |
|---|---|---|
| `sdk_version` | string | `"2.0"` |
| `license` | enum | `MIT`, `Apache-2.0`, `GPL-3.0`, `Proprietary` |
| `categories` | array | fashion, electronics, home-garden, sports, beauty, food-beverage, books, toys, jewelry, automotive, general |
| `preview_image` | string | PNG/JPG/WebP filename, 600px wide, max 5MB |
| `screenshots` | array | Max 8 images, 1280x720 to 3840x2160 |
| `tags` | array | Max 10, lowercase with hyphens |
| `features` | object | Feature flags: `responsive` (bool), `mobile_first` (bool), `dark_mode` (bool), `rtl_support` (bool), `accessibility` (string) |
| `min_platform_version` | string | Semver |
| `demo_url` | string | URL |
| `changelog` | array | `{version, date, changes: []}` |

---

## overrides.css

For visual effects beyond what tokens express: hover animations, corner shapes, glassmorphism, neon glows, external fonts.

### External @imports Are Preserved
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');
```
The platform strips relative `@import` (internal CSS files) but preserves external URLs.

### CSS Load Order
All CSS is loaded via `<link>` tags in the `<head>`:

1. **Theme CSS** (`<link>`) — compiled from `tokens.css` + `reset.css` + theme `components.css` + `overrides.css`. This is a single combined file served via URL.
2. **Platform `components.css`** (`<link>`) — core UI components (buttons, cards, product cards, etc.)
3. **`base.css`** (`<link>`) — platform base layout and utilities
4. **`animations.css`** (`<link>`) — global animations
5. **Element CSS** (`<link>`) — form builder, element-specific stylesheets
6. **Brand CSS** (`<link>`) — merchant's branding customizations
7. **Header/Footer CSS** (`<link>`) — zone layouts, presets, widget styles
8. **Widget CSS** (`<link>`) — cart, search, mobile menu, footer extras

Your theme CSS loads first. Since platform `components.css` loads after via a separate `<link>`, for equal-specificity selectors the platform wins by source order. Use `.product-card.product-card` for a specificity bump.

### Key Platform Classes to Target

**Product Cards:**
`.product-card`, `.product-card__image`, `.product-card__image img`, `.product-card__img`, `.product-card__overlay`, `.product-card__content`, `.product-card__title`, `.product-card__price`, `.product-card__badges`, `.product-card__badge--sale`, `.product-card__badge--new`, `.product-card__badge--soldout`, `.product-card__actions`, `.product-card__action-btn`, `.product-card__add-btn`, `.product-card__button`

**Category Cards:**
`.category-card`, `.category-card__image`, `.category-card__overlay`, `.category-card__content`, `.category-card__title`

**Generic Cards:**
`.card`, `.card--default`, `.card--elevated`, `.card--bordered`, `.card--minimal`, `.card__image`, `.card__body`, `.card__title`

**Buttons:**
`.btn`, `.btn--primary`, `.btn--secondary`, `.btn--neutral`, `.btn--danger`, plus `-outline` and `-ghost` variants, `.btn--sm`, `.btn--md`, `.btn--lg`, `.btn--pill`, `.btn--full`

**Header:**
`.site-header`, `.site-header__nav-link`, `.site-header__icon`, `.site-header__logo`

**Footer:**
`.site-footer`, `.site-footer__link`, `.site-footer__social-link`

**Search:**
`.search`, `.search__input-wrapper`, `.search__input`, `.search__button`

**Forms:**
`.form-group`, `.form-label`, `.form-input`, `.form-select`

**Other:**
`.hero`, `.breadcrumb`, `.pagination`, `.newsletter`, `.alert`, `.badge`, `.section`, `.container`

### Common Patterns

**Selection color:**
```css
::selection { background-color: rgba(37, 99, 235, 0.15); color: var(--theme-color-text); }
```

**Card hover lift:**
```css
.product-card { transition: box-shadow 0.25s ease, transform 0.25s ease; }
.product-card:hover { transform: translateY(-6px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.07), 0 12px 24px -4px rgba(0,0,0,0.1); }
```

**Image zoom:**
```css
.product-card__image img { transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.product-card:hover .product-card__image img { transform: scale(1.06); }
```

**Nav underline from left:**
```css
.site-header__nav-link { position: relative; }
.site-header__nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2px; background-color: var(--theme-color-primary); transform: scaleX(0); transform-origin: left; transition: transform 0.2s ease; }
.site-header__nav-link:hover::after { transform: scaleX(1); }
```

**Squircle corners (Chrome 139+, graceful fallback):**
```css
.product-card, .category-card, .card { corner-shape: squircle; }
.btn--primary, .btn--secondary { corner-shape: squircle; }
```

**Bevel corners (tech/sci-fi):**
```css
.product-card, .category-card { corner-shape: bevel; }
```

**Glassmorphism (dark themes):**
```css
.product-card { background: rgba(31, 41, 55, 0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
```

**Dark theme essentials:**
```css
html, body { background-color: var(--theme-color-background); color: var(--theme-color-text); }
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--theme-color-background-secondary); }
::-webkit-scrollbar-thumb { background: var(--theme-color-border-dark); border-radius: 2px; }
::selection { background-color: rgba(96, 165, 250, 0.25); }
```

---

## Dark Mode

To enable dark mode, set `features.dark_mode: true` in `manifest.json` and add a `dark` section to `tokens.json`. Dark token keys use the **same names** as `colors` and `shadows` keys — the platform dynamically maps each dark token to override its light-mode CSS variable.

```json
"dark": {
  "background": "#111827",
  "background-secondary": "#1F2937",
  "background-tertiary": "#374151",
  "surface": "#1F2937",
  "surface-secondary": "#374151",
  "surface-hover": "#4B5563",
  "text": "#F9FAFB",
  "text-light": "#D1D5DB",
  "text-muted": "#9CA3AF",
  "text-inverse": "#1f2937",
  "border": "#374151",
  "border-light": "#4B5563",
  "border-dark": "#1F2937",
  "primary-light": "#1e3a5f",
  "success-light": "#065f46",
  "error-light": "#7f1d1d",
  "warning-light": "#78350f",
  "info-light": "#1e3a5f",
  "overlay": "rgba(0, 0, 0, 0.7)",
  "shadow-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
  "shadow-base": "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
  "shadow-md": "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3)",
  "shadow-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.3)",
  "shadow-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)"
}
```

The platform auto-generates:
- `@media (prefers-color-scheme: dark)` — auto-applies when user's OS has dark mode
- `[data-theme="dark"]` — manual dark mode toggle
- `[data-theme="light"]` — force light mode restoration

**Key rules:**
- Color dark tokens (e.g., `dark.background`) override `--theme-color-background`
- Shadow dark tokens (e.g., `dark.shadow-md`) override `--theme-shadow-md`
- Brand colors (`primary`, `secondary`, `accent`) and status base colors (`success`, `error`) typically don't need dark overrides — only their `-light` variants do
- Inherently dark themes (dark backgrounds by default) should set `features.dark_mode: false`
- When `dark_mode: false`, the platform auto-forces light mode to prevent broken rendering

---

## Preset Structure (Tier 2)

### Header Presets
- **Zones**: `top-bar`, `main-header`, `bottom-bar`
- **Positions per zone**: `left`, `center`, `right`, `full`
- **Zone naming**: `{zone}_{position}` (underscore separator)
- **Widget types**: `logo`, `menu`, `search`, `cart`, `account`, `currency`, `language`, `social`, `newsletter`, `contact`, `text`, `links`, `payment`, `trust_badges`, `announcement`, `loyalty_balance`, `loyalty_tier_badge`, `site_variable`, `custom`
- **Required**: `name`, `layout_type` (standard|centered|minimal), `widget_placements`

### Footer Presets
- **Zones**: `main-footer`, `bottom-bar`
- **Same widget types** as header

### Header Zone Layout Styles
`promotional`, `boutique`, `split`, `classic`, `mega`, `minimal`

Each zone can have per-layout-style token overrides in `tokens.json`:
```json
"header": {
  "zones": {
    "top-bar": {
      "background": "#fff",
      "background-promotional": "#1a1a1a",
      "background-boutique": "#fafafa"
    }
  }
}
```

---

## CLI Commands

```bash
spwig init my-theme                     # Create theme (interactive)
spwig init my-theme --template full     # Templates: blank | minimal | full
spwig dev --shop http://localhost:8000  # Live preview with hot-reload
spwig validate --verbose                # Validate structure and schemas
spwig package                           # Create .zip + .sha256 checksum
```

---

## Common Gotchas

1. Token values MUST be strings — `"400"` not `400`
2. `var()` references MUST include `--theme-` prefix
3. CSS variable prefixes are NOT uniform — check the mapping table
4. `overrides.css` max 1MB
5. Don't include `node_modules/`, `dist/`, `.git/` in packages
6. Preset `zone` format: `{zone-name}_{position}` with underscore
7. Corner-shape requires `border-radius` to be set
8. `backdrop-filter` needs `-webkit-` prefix for Safari
9. External `@import` URLs are preserved; relative ones are stripped
10. Platform `components.css` loads via `<link>` AFTER your inline overrides
