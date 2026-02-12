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
├── preview.png         # Optional: Theme preview image (600x800px, max 5MB)
├── screenshots/        # Optional: Up to 8 marketplace screenshots (max 5MB each)
└── presets/            # Optional (Tier 2): Header/footer layout presets
    ├── headers/
    │   └── *.json      # Header preset definitions
    └── footers/
        └── *.json      # Footer preset definitions
```

## Development Workflow
```bash
spwig init my-theme --template full    # Create new theme (blank|minimal|full)
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
| `dark` | `--theme-dark-` | `dark.bg-primary` | `--theme-dark-bg-primary` |
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
| `button-{variant}` | `--theme-button-{variant}-` | `button-primary.solid-bg` | `--theme-button-primary-solid-bg` |
| `card-{style}` | `--theme-card-{style}-` | `card-elevated.shadow` | `--theme-card-elevated-shadow` |
| `elements` | `--theme-element-{type}-` | `elements.button.radius` | `--theme-element-button-radius` |
| `widgets` | `--theme-widget-{type}-` | `widgets.cart.badge-bg` | `--theme-widget-cart-badge-bg` |

## Token Categories

### Core Design Tokens
| Category | Keys | Description |
|---|---|---|
| `colors` | ~37 | primary, secondary, accent (each with hover/light/dark), text variants, backgrounds, surfaces, borders, semantic (success/error/warning/info with -light), overlay |
| `dark` | ~12 | Dark mode overrides: bg-primary/secondary/tertiary, surface-primary/secondary/hover, text-primary/secondary/muted, border-primary/secondary, overlay |
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
The `dark` category provides color overrides applied when the merchant enables dark mode. These tokens map to `--theme-dark-*` CSS variables. The platform uses these to swap colors at runtime.

```json
"dark": {
  "bg-primary": "#111827",
  "bg-secondary": "#1F2937",
  "surface-primary": "#1F2937",
  "text-primary": "#F9FAFB",
  "text-secondary": "#D1D5DB",
  "text-muted": "#9CA3AF",
  "border-primary": "#374151",
  "overlay": "rgba(0, 0, 0, 0.7)"
}
```

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
- `name`: lowercase with hyphens only, pattern `^[a-z][a-z0-9-]*$`, 2-50 chars
- `version`: semver `X.Y.Z` (e.g., `2.0.0`)
- `display_name`: human-readable, 1-100 chars
- `description`: 10-1000 chars
- `author`: 1-100 chars
- `sdk_version`: `"2.0"` for current SDK

## manifest.json Optional Fields
- `license`: `MIT` | `Apache-2.0` | `GPL-3.0` | `Proprietary`
- `categories`: from enum: fashion, electronics, home-garden, sports, beauty, food-beverage, books, toys, jewelry, automotive, general
- `preview_image`: png/jpg/jpeg/webp, recommended 600x800px, max 5MB
- `screenshots`: array of image filenames (max 8, marketplace gallery)
- `tags`: max 10, lowercase with hyphens
- `color_schemes`: array of color scheme names (e.g., `["light", "dark"]`)
- `features`: array of feature flags (e.g., `["sticky-header", "mega-menu"]`)
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
- `preview_image` max 5MB, screenshots max 5MB each
- Do NOT include `node_modules/`, `dist/`, or `.git/` in theme packages
- Element token CSS vars: `--theme-element-{type}-{key}` (e.g., `--theme-element-button-radius`)
- Widget token CSS vars: `--theme-widget-{type}-{key}` (e.g., `--theme-widget-cart-badge-bg`)
- Menu token CSS vars: `--theme-menu-{key}` (e.g., `--theme-menu-text-color`)
- Header zone tokens nest 2 levels deep — `header.zones.top-bar.background` becomes `--theme-header-zones-top-bar-background`
- Footer zone tokens: `footer.zones.main.padding-y` becomes `--theme-footer-zones-main-padding-y`
- Button variant tokens: `button-primary.solid-bg` becomes `--theme-button-primary-solid-bg`
- Card style tokens: `card-elevated.shadow` becomes `--theme-card-elevated-shadow`
- Custom token categories are allowed — the schema and validator are permissive
- Preset `zone` field format must be `{zone-name}_{position}` — underscore separator, not hyphen

## Key Reference Files
- Example theme: `examples/starter-theme/` (complete Tier 2 theme with tokens, presets)
- Token reference: `docs/DESIGN_TOKENS.md`
- Preset guide: `docs/PRESETS.md`
- Getting started: `docs/GETTING_STARTED.md`
- CLI README: `packages/cli/README.md`
- Validator source: `packages/validator/src/validators/`
