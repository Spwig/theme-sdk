# Spwig Theme SDK

## What This Is
SDK for building themes for the Spwig eCommerce platform. Themes are **token-based configuration** — no templates, no components, no JavaScript required. You define design tokens (colors, typography, spacing, element styles) in JSON and the platform renders everything using CSS custom properties.

## Monorepo Structure
```
packages/cli/         — @spwig/theme-cli (Node.js CLI tool)
packages/validator/   — @spwig/theme-validator (validation library)
packages/vscode-extension/ — VS Code extension with IntelliSense
examples/starter-theme/    — Complete example Tier 2 theme
docs/                      — Design tokens, presets, getting started guides
```

## Theme Tiers
- **Tier 1** (minimal): `manifest.json` + `tokens.json` + optional `overrides.css`
- **Tier 2** (full): Tier 1 + `presets/` directory with header/footer JSON files

## Required Files
```
my-theme/
├── manifest.json       # Theme metadata (name, version, author, etc.)
├── tokens.json         # Design system values (colors, typography, spacing, etc.)
├── overrides.css       # Optional: CSS beyond what tokens cover
├── preview.png         # Optional: Theme preview image (600px wide, 800-1500px tall, max 5MB)
├── screenshots/        # Optional: Up to 8 marketplace screenshots (WebP/PNG/JPG, 1280x720 to 3840x2160, max 5MB each)
├── videos/             # Optional: Up to 2 demo videos (WebM/MP4, max 30 seconds, max 50MB each)
└── presets/            # Optional (Tier 2): Header/footer layout presets
    ├── headers/
    │   └── *.json      # Header preset definitions
    └── footers/
        └── *.json      # Footer preset definitions
```

## Development Workflow
```bash
spwig init my-theme --template full    # Create new theme (blank | minimal | full)
# Edit tokens.json, manifest.json, presets/
spwig dev --shop http://localhost:8000  # Live preview with token hot-reload
spwig validate --verbose                # Validate structure and schemas
spwig package                           # Create .zip + .sha256 checksum
```

## Token Architecture
Every token becomes a CSS custom property. The mapping varies by category — it is NOT a simple `--theme-{category}-{key}` pattern:

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

## Token Categories

### Core Design Tokens
| Category | Keys | Description |
|---|---|---|
| `colors` | ~37 | primary, secondary, accent (each with hover/light/dark), text variants, backgrounds, surfaces, borders, semantic (success/error/warning/info with -light), overlay |
| `dark` | ~24 | Dark mode overrides (requires `features.dark_mode: true`): backgrounds (3), surfaces (3), text (4), borders (3), primary-light, status -light variants (4), overlay, shadows (5). Keys use same names as `colors`/`shadows` sections. |
| `typography` | ~48 | font-family-body/heading, font-sans/serif/mono, font-size-xs to 5xl, font-weight (4), line-height (3), letter-spacing (3), word-spacing (3), text-indent (4), font-variant (3), text-decoration (3), text-align (4), vertical-align (4), direction (2) |
| `spacing` | ~13 | Scale 0-24 (0 to 6rem) |
| `borders` | ~10 | width-0/1/2, radius-none/sm/base/md/lg/xl/full |
| `shadows` | ~6 | none, sm, base, md, lg, xl |
| `transitions` | ~6 | duration-fast/base/slow, easing-default/in/out |
| `breakpoints` | ~5 | sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) |
| `responsive` | 3 | scale-mobile-text, scale-mobile-space, scale-mobile-padding |
| `z-index` | ~7 | dropdown, sticky, fixed, modal-backdrop, modal, popover, tooltip |
| `container` | 2 | max-width, padding |

### Layout & Navigation Tokens
| Category | Keys | Description |
|---|---|---|
| `menu` | ~19 | text-color, background, dropdown, padding, font, animations, radii |
| `header` | ~10 + zones | background, text-color, border, padding, logo-height, icon-size/color. Nested `zones` object with top-bar, main-header, bottom-bar, mega-menu-bar — each with per-layout-style variants |
| `footer` | ~10 + zones | background, text/link/heading/muted colors, padding, column-gap. Nested `zones` object with top, main, bottom |
| `search` | ~47 | Desktop: input, button, dropdown, results styling. Mobile: overlay, backdrop, close button, trigger styling |

### Button Variant Tokens (4 variants, ~10 keys each)
Each button variant (`button-primary`, `button-secondary`, `button-neutral`, `button-danger`) defines:
- `solid-bg`, `solid-bg-hover`, `solid-text`, `solid-border`
- `outline-bg`, `outline-bg-hover`, `outline-text`, `outline-border`
- `ghost-bg`, `ghost-bg-hover`, `ghost-text`
- `focus-ring-color`

### Card Style Tokens (4 styles, ~5 keys each)
Each card style (`card-default`, `card-elevated`, `card-bordered`, `card-minimal`) defines:
- `bg`, `border-width`, `border-color`, `shadow`, `shadow-hover`

### Element Tokens (`elements.{type}`)
| Element | Keys | Description |
|---|---|---|
| `hero` | ~8 | min-height, padding, title/subtitle size, text-color, overlay, mobile variants |
| `button` | ~27 | font, sizing (sm/md/lg), padding, radius, border, transitions, focus ring, disabled opacity, mobile font sizes |
| `spacer` | 1 | mobile-scale |
| `card` | ~25 | bg, border, radius, shadow, padding, gap, transitions, title/text/meta fonts, image styling |
| `divider` | 3 | color, thickness, spacing |
| `form` | ~50 | input styling, labels, errors, colors, checkboxes, radios, stars, NPS, likert, progress, step circles |
| `accordion` | 6 | header bg/hover, border, content-bg, icon-color, padding |
| `modal` | ~13 | backdrop, bg, radius, shadow, padding, max-width, close button styling |
| `countdown` | 6 | number/label size and color, bg, separator-color |
| `testimonial` | 6 | bg, border, quote-color, author-color, radius, shadow |
| `blog` | 5 | card-radius, card-shadow, meta/title/excerpt colors |
| `product` | ~83 | Card (bg, radius, border, shadow, hover, padding, transitions), image (aspect-ratio, zoom, overlay), content, title, price (sale, original), badges (sale/new/soldout), button, actions (quick-view/wishlist), rating stars, grid columns |
| `category` | ~82 | Banner (height, overlay, title, subtitle), header, card (image, placeholder, content, title, desc), chips, sort controls, pagination, load-more, grid, section, help text |
| `voucher` | 4 | code-bg, code-border, code-font, code-color |
| `heading` | ~84 | Per-level (h1-h6): font-family, size, line-height, letter-spacing, text-transform, color, font-weight, word-spacing, text-indent, font-variant, text-decoration, text-align, vertical-align, direction |
| `body` | ~12 | font-family, size, weight, line-height, letter-spacing, word-spacing, text-indent, font-variant, text-decoration, text-align, vertical-align, direction, color |
| `body-light` | ~12 | Same as body but with lighter color |
| `body-muted` | ~12 | Same as body but with muted color |
| `image` | 2 | radius, shadow |
| `gallery` | 2 | gap, radius |
| `alert` | ~14 | padding, radius, font, icon-size, gap, per-status (success/warning/error/info) bg and text |
| `image-accordion` | ~53 | Heights (sm/md/lg/xl), gap, radius, transitions, expand-ratio, content padding, title/subtitle, overlay, mobile height, per-style tokens (hero-bold, bottom-left, bottom-right, center-left/right/center, top-left, card, minimal) |

### Widget Tokens (`widgets.{type}`)
| Widget | Keys | Description |
|---|---|---|
| `account` | ~14 | icon-size/color, dropdown styling, link colors/padding/radius |
| `cart` | ~18 | icon, badge (bg/color/size/offset), dropdown, panel-width, overlay |
| `language` | ~12 | select styling, flag-size, gap |
| `currency` | ~48 | Select, button variants (solid/outline/ghost), dropdown, options, check/loading/chevron colors |
| `logo` | 7 | max-height, max-width, text-color, font-size, font-weight, letter-spacing |
| `announcement` | ~28 | bar (bg, color, padding, font), link, close-btn, scroll-speed, vertical transitions, modal (max-width, image, title, body, button) |
| `newsletter` | ~27 | title, description, input, button (bg/color/hover/radius/padding), success/error colors |
| `social` | ~12 | title, icon (size/color/hover/bg/padding/radius), gap |
| `links` | ~9 | title, link (color/hover/font-size/padding), gap |
| `text` | ~9 | title, content (color/font-size/line-height), link (color/hover) |
| `payment` | ~11 | title, icon (height/max-width/opacity/hover-opacity/filter), gap |
| `trust-badges` | ~13 | title, badge (bg/border/radius/padding/hover-border), icon, text, gap |
| `contact` | ~14 | title, icon (size/color), label, value, link (color/hover), item-gap |

### Header Zone Structure
The `header.zones` object contains zone sub-objects. Each zone has base properties plus per-layout-style variants:

```json
"header": {
  "zones": {
    "top-bar": {
      "background": "var(--theme-header-background)",
      "background-promotional": "...",    // Layout-style override
      "background-boutique": "...",
      "background-split": "...",
      "background-classic": "...",
      "background-mega": "...",
      "background-minimal": "...",
      "text-color": "...",
      "border-color": "...",
      "height": "70px",
      "padding-y": "...",
      "padding-x": "...",
      "font-size": "..."
    }
  }
}
```

Layout styles: `promotional`, `boutique`, `split`, `classic`, `mega`, `minimal`
Zone properties: `background`, `text-color`, `border-color`, `height`, `padding-y`, `padding-x`, `font-size`
Header zones: `top-bar`, `main-header`, `bottom-bar`, `mega-menu-bar`
Footer zones: `top`, `main`, `bottom`

## Dark Mode Support
To enable dark mode, set `features.dark_mode: true` in `manifest.json` and add a `dark` section to `tokens.json`. Dark token keys use the **same names** as `colors` and `shadows` keys — the platform dynamically maps each to override its light-mode CSS variable.

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

**How it works:** Color tokens (`dark.background`) override `--theme-color-background`. Shadow tokens (`dark.shadow-md`) override `--theme-shadow-md`. The platform generates `@media (prefers-color-scheme: dark)`, `[data-theme="dark"]`, and `[data-theme="light"]` CSS blocks.

**Design rules:** Brand colors (primary, secondary, accent) and status base colors (success, error) don't need dark overrides — only their `-light` variants need dark tints. Inherently dark themes should set `features.dark_mode: false`.

## Token Value Rules
- All values **MUST be strings**, never numbers or booleans
- Can reference other tokens: `"var(--theme-color-primary)"`
- `var()` references MUST use the `--theme-` prefix
- Color formats: hex `#RRGGBB`, `rgb()`, `rgba()`, `hsl()`, `hsla()`
- Spacing: CSS length units (`px`, `rem`, `em`, `%`, `vh`, `vw`) or `"0"`
- Responsive values: object with breakpoint keys `{ "mobile": "1rem", "desktop": "2rem" }`
- Valid breakpoint keys: `mobile`, `tablet`, `desktop`, `sm`, `md`, `lg`, `xl`, `2xl`

## Preset Structure (Tier 2)

### Header Presets
- **Zones**: `top-bar`, `main-header`, `bottom-bar`
- **Positions per zone**: `left`, `center`, `right`, `full`
- **Zone naming**: `{zone}_{position}` (e.g., `main-header_left`)
- **Widget types**: `logo`, `menu`, `search`, `cart`, `account`, `currency`, `language`, `social`, `newsletter`, `contact`, `text`, `links`, `payment`, `trust_badges`, `announcement`, `loyalty_balance`, `loyalty_tier_badge`, `site_variable`, `custom`
- **Required fields**: `name`, `layout_type` (standard|centered|minimal), `widget_placements`
- **Optional**: `is_sticky`, `enable_notification_zone`, `zone_layouts`, `description`

### Footer Presets
- **Zones**: `main-footer`, `bottom-bar`
- **Widget types**: Same 19 types as header

## manifest.json Required Fields
- `name`: human-readable display name, 1-100 chars (e.g., `"Starter Theme"`)
- `slug`: lowercase with hyphens only, pattern `^[a-z][a-z0-9-]*$`, 2-50 chars (e.g., `"starter"`)
- `component_type`: always `"theme"` for theme packages
- `version`: semver `X.Y.Z` (e.g., `2.0.0`)
- `display_name`: same as `name` (kept for backward compatibility), 1-100 chars
- `description`: 10-1000 chars
- `author`: 1-100 chars
- `sdk_version`: `"2.0"` for current SDK

## manifest.json Optional Fields
- `license`: `MIT` | `Apache-2.0` | `GPL-3.0` | `Proprietary`
- `categories`: from enum: fashion, electronics, home-garden, sports, beauty, food-beverage, books, toys, jewelry, automotive, general
- `preview_image`: Filename of theme preview/thumbnail (PNG/JPG/JPEG/WebP, 600px wide × 800-1500px tall, max 5MB). Displayed in marketplace theme cards with auto-scroll to showcase full page layout. Taller images allow more content to be shown.
- `screenshots`: Array of image filenames (max 8, WebP/PNG/JPG, 1280x720 to 3840x2160, max 5MB each). Marketplace gallery images showcasing theme features and layouts.
- `videos`: Array of video filenames (max 2, WebM/MP4, max 30 seconds each, max 50MB each). Demo videos for marketplace showing theme in action.
- `tags`: max 10, lowercase with hyphens
- `features`: object with boolean flags: `responsive` (default true), `mobile_first` (default true), `dark_mode` (default false — set true to enable dark mode CSS generation), `rtl_support` (default false), `accessibility` (string, e.g., "WCAG 2.1 AA")
- `demo_url`: URL to live theme demo
- `documentation_url`: URL to theme documentation
- `support_url`: URL to support/help page
- `min_platform_version`: minimum Spwig version (semver)
- `max_platform_version`: maximum Spwig version (semver)
- `changelog`: array of `{version, date, changes: []}` entries

## JSON Schemas
- **manifest.json**: `packages/validator/schemas/theme_manifest_schema.json`
- **tokens.json**: `packages/validator/schemas/tokens_schema.json`
- **Header presets**: `packages/validator/schemas/header_preset_schema.json`
- **Footer presets**: `packages/validator/schemas/footer_preset_schema.json`

## Common Gotchas
- Token values MUST be strings — `"400"` not `400`, `"0"` not `0`
- `var()` references MUST include `--theme-` prefix — `var(--theme-color-primary)` not `var(--color-primary)`
- CSS variable prefixes are NOT uniform — see Token Architecture table above (e.g., `--theme-space-` not `--theme-spacing-`)
- `overrides.css` max 1MB
- `preview_image` must be 600px wide, 800-1500px tall (taller = more scrollable content), max 5MB
- `screenshots` max 8 files, 5MB each, 1280x720 to 3840x2160 resolution
- `videos` max 2 files, 50MB each, max 30 seconds duration (WebM/MP4)
- Do NOT include `node_modules/`, `dist/`, or `.git/` in theme packages
- Element token CSS vars: `--theme-element-{type}-{key}` (e.g., `--theme-element-button-radius`)
- Widget token CSS vars: `--theme-widget-{type}-{key}` (e.g., `--theme-widget-cart-badge-bg`)
- Menu token CSS vars: `--theme-menu-{key}` (e.g., `--theme-menu-text-color`)
- Header zone tokens nest 2 levels deep — `header.zones.top-bar.background` becomes `--theme-header-zones-top-bar-background`
- Footer zone tokens: `footer.zones.main.padding-y` becomes `--theme-footer-zones-main-padding-y`
- Button variant tokens: `button-primary.solid-bg` becomes `--theme-element-button-primary-solid-bg`
- Card style tokens: `card-elevated.shadow` becomes `--theme-element-card-elevated-shadow`
- Custom token categories are allowed — the schema and validator are permissive
- Preset `zone` field format must be `{zone-name}_{position}` — underscore separator, not hyphen

## overrides.css

### When to Use
Tokens handle colors, fonts, spacing, shadows, borders. Use `overrides.css` for:
- Hover animations (card lift, image zoom, glow effects)
- Corner shapes (`corner-shape: squircle` / `bevel` — CSS Borders Level 4, Chrome 139+)
- Glassmorphism (`backdrop-filter: blur()` + semi-transparent bg)
- Neon glow effects (multi-layered `box-shadow`)
- `::selection` / `::-webkit-scrollbar` styling
- `::after` / `::before` pseudo-elements (nav underlines, scan-lines)
- External font loading (`@import url('https://fonts.googleapis.com/...')`)

### External @import Preservation
The platform strips relative `@import` statements but preserves external URLs (`https://`). Google Fonts and similar CDN imports work correctly.

### CSS Cascade Position
Theme CSS (including `overrides.css`) is compiled into a single file served via `<link>` tag (position 1). Platform `components.css` loads via a separate `<link>` tag (position 2). For equal-specificity selectors, platform wins by source order. Use `.product-card.product-card` for a specificity bump when needed.

### Key Platform Classes
Most commonly targeted in overrides:
- `.product-card`, `.product-card__image`, `.product-card__overlay`, `.product-card__content`
- `.category-card`, `.category-card__overlay`
- `.card`, `.card--default`, `.card--elevated`
- `.btn--primary`, `.btn--secondary`, `.btn--neutral`
- `.site-header__nav-link`
- `.search__input-wrapper`

Full reference: `docs/COMPONENT_CLASSES.md`

## Key Reference Files
- Example theme: `examples/starter-theme/` (complete Tier 2 theme with tokens, presets, overrides)
- Token reference: `docs/DESIGN_TOKENS.md`
- CSS overrides guide: `docs/CSS_OVERRIDES_GUIDE.md`
- Component classes: `docs/COMPONENT_CLASSES.md`
- CSS load order: `docs/CSS_LOAD_ORDER.md`
- Preset guide: `docs/PRESETS.md`
- Getting started: `docs/GETTING_STARTED.md`
- LLM context files: `llm-context/` (drop into AI assistants)
- CLI README: `packages/cli/README.md`
- Validator source: `packages/validator/src/validators/`
