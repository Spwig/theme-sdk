# Design Tokens Reference

Design tokens are the foundation of your theme. They define colors, typography, spacing, and other design values that the platform converts to CSS custom properties with the `--theme-` prefix.

---

## How Tokens Work

1. You define values in `tokens.json`
2. The platform converts them to CSS variables when the theme is activated
3. All platform components reference these CSS variables
4. Changing a token value changes every element that uses it

For effects beyond what tokens can express (hover animations, corner shapes, glassmorphism), use [`overrides.css`](./CSS_OVERRIDES_GUIDE.md). See [CSS Load Order](./CSS_LOAD_ORDER.md) for how tokens and overrides interact in the cascade.

### Naming Convention

Token keys use hyphens (kebab-case). The platform maps them to CSS variables — note that prefixes are NOT uniform across categories:

| Token Category | Token Key | CSS Variable |
|---------------|-----------|-------------|
| `colors` | `primary` | `--theme-color-primary` |
| `colors` | `primary-hover` | `--theme-color-primary-hover` |
| `dark` | `background` | `--theme-dark-background` (overrides `--theme-color-background` in dark mode) |
| `typography` | `font-family-body` | `--theme-font-family-body` |
| `typography` | `font-size-lg` | `--theme-font-size-lg` |
| `spacing` | `md` | `--theme-space-md` |
| `borders` | `radius-md` | `--theme-radius-md` |
| `shadows` | `lg` | `--theme-shadow-lg` |
| `transitions` | `duration-fast` | `--theme-transition-duration-fast` |
| `breakpoints` | `md` | `--theme-breakpoint-md` |
| `container` | `max-width` | `--theme-container-max-width` |
| `menu` | `text-color` | `--theme-menu-text-color` |
| `header` | `background` | `--theme-header-background` |
| `footer` | `background` | `--theme-footer-background` |
| `search` | `bg` | `--theme-search-bg` |
| `button-primary` | `solid-bg` | `--theme-element-button-primary-solid-bg` |
| `card-elevated` | `shadow` | `--theme-element-card-elevated-shadow` |
| `elements.button` | `radius` | `--theme-element-button-radius` |
| `widgets.cart` | `badge-bg` | `--theme-widget-cart-badge-bg` |

---

## Token Categories

### colors

Brand colors, backgrounds, text colors, semantic colors, and utility colors.

```json
{
  "colors": {
    "primary": "#2563eb",
    "primary-hover": "#1d4ed8",
    "primary-light": "#dbeafe",
    "primary-dark": "#1e40af",
    "secondary": "#64748b",
    "secondary-hover": "#475569",
    "accent": "#10b981",
    "accent-hover": "#059669",
    "background": "#ffffff",
    "background-secondary": "#f9fafb",
    "background-tertiary": "#f3f4f6",
    "surface": "#f9fafb",
    "surface-secondary": "#f3f4f6",
    "surface-hover": "#e5e7eb",
    "text": "#1f2937",
    "text-light": "#6b7280",
    "text-muted": "#9ca3af",
    "text-inverse": "#ffffff",
    "border": "#e5e7eb",
    "border-light": "#f3f4f6",
    "border-dark": "#d1d5db",
    "error": "#ef4444",
    "error-light": "#fef2f2",
    "success": "#22c55e",
    "success-light": "#f0fdf4",
    "warning": "#f59e0b",
    "warning-light": "#fffbeb",
    "info": "#3b82f6",
    "info-light": "#eff6ff",
    "overlay": "rgba(0, 0, 0, 0.5)"
  }
}
```

Supported color formats: hex (`#RRGGBB`), `rgb()`, `rgba()`, `hsl()`, `hsla()`.

---

### dark

Dark mode overrides for system dark mode support (`@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`). Dark tokens use the **same key names** as the `colors` and `shadows` sections. When the user's OS has dark mode enabled, each dark token value replaces its corresponding light-mode CSS variable.

Set `features.dark_mode: true` in your manifest to enable dark mode generation. Themes without dark mode support should set this to `false` — the platform will auto-force light mode to prevent broken rendering.

```json
{
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
}
```

#### Token Categories

| Category | Keys | Purpose |
|----------|------|---------|
| Backgrounds | `background`, `background-secondary`, `background-tertiary` | Page and section backgrounds |
| Surfaces | `surface`, `surface-secondary`, `surface-hover` | Card and panel backgrounds |
| Text | `text`, `text-light`, `text-muted`, `text-inverse` | Text color overrides |
| Borders | `border`, `border-light`, `border-dark` | Border color overrides |
| Primary | `primary-light` | Focus rings and outline button hover backgrounds |
| Status | `success-light`, `error-light`, `warning-light`, `info-light` | Alert and status backgrounds (darker tints for dark backgrounds) |
| Overlay | `overlay` | Modal/overlay backdrop |
| Shadows | `shadow-sm`, `shadow-base`, `shadow-md`, `shadow-lg`, `shadow-xl` | Higher opacity shadows for visibility on dark backgrounds |

#### How It Works

Dark token keys map directly to CSS variables:
- Color tokens (e.g., `dark.background`) override `--theme-color-background`
- Shadow tokens (e.g., `dark.shadow-md`) override `--theme-shadow-md`

The platform generates:
1. `@media (prefers-color-scheme: dark)` — auto-applies when user's OS has dark mode
2. `[data-theme="dark"]` — manual dark mode toggle
3. `[data-theme="light"]` — force light mode (restores original values)

#### Design Guidelines

- **Brand colors stay unchanged** — `primary`, `secondary`, `accent` and their hover variants don't need dark overrides
- **Status base colors stay unchanged** — `success`, `error`, `warning`, `info` don't need overrides
- **Only override `-light` variants** — status `-light` colors need dark tints instead of pastels (e.g., `#065f46` instead of `#d1fae5`)
- **Increase shadow opacity** — shadows need 3-4x opacity on dark backgrounds to be visible
- **Invert text-inverse** — on dark backgrounds, `text-inverse` should be the dark text color

#### When NOT to Use Dark Mode

Themes that are inherently dark (dark backgrounds by default) should set `features.dark_mode: false`. They don't need a toggle — they ARE the dark mode. Only themes with light backgrounds that want to offer a dark alternative should enable dark mode.

---

### typography

Font families, sizes, weights, line heights, and letter spacing.

```json
{
  "typography": {
    "font-family-heading": "system-ui, -apple-system, sans-serif",
    "font-family-body": "system-ui, -apple-system, sans-serif",
    "font-sans": "system-ui, -apple-system, sans-serif",
    "font-serif": "Georgia, 'Times New Roman', serif",
    "font-mono": "'SF Mono', 'Fira Code', monospace",
    "font-size-xs": "0.75rem",
    "font-size-sm": "0.875rem",
    "font-size-base": "1rem",
    "font-size-lg": "1.125rem",
    "font-size-xl": "1.25rem",
    "font-size-2xl": "1.5rem",
    "font-size-3xl": "2rem",
    "font-size-4xl": "2.5rem",
    "font-weight-normal": "400",
    "font-weight-medium": "500",
    "font-weight-semibold": "600",
    "font-weight-bold": "700",
    "line-height-tight": "1.25",
    "line-height-normal": "1.5",
    "line-height-relaxed": "1.75",
    "letter-spacing-tight": "-0.025em",
    "letter-spacing-normal": "0",
    "letter-spacing-wide": "0.05em"
  }
}
```

---

### spacing

Margin and padding scale. Used throughout the platform for consistent spacing.

```json
{
  "spacing": {
    "xs": "0.25rem",
    "sm": "0.5rem",
    "md": "1rem",
    "lg": "1.5rem",
    "xl": "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
    "4xl": "6rem",
    "section-y": "4rem",
    "section-x": "1.5rem"
  }
}
```

---

### borders

Border radius and width values.

```json
{
  "borders": {
    "radius-none": "0",
    "radius-sm": "0.25rem",
    "radius-md": "0.5rem",
    "radius-lg": "0.75rem",
    "radius-xl": "1rem",
    "radius-full": "9999px",
    "width-thin": "1px",
    "width-medium": "2px",
    "width-thick": "3px"
  }
}
```

---

### shadows

Box shadow definitions.

```json
{
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  }
}
```

---

### transitions

Animation duration and easing for interactive elements.

```json
{
  "transitions": {
    "fast": "150ms ease",
    "normal": "250ms ease",
    "slow": "350ms ease"
  }
}
```

---

### breakpoints

Responsive breakpoint values used by the platform's media queries.

```json
{
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  }
}
```

---

### container

Page container settings.

```json
{
  "container": {
    "max-width": "1280px",
    "padding": "1.5rem"
  }
}
```

---

### elements

Default styling for page builder elements. Each element category is a nested object.

```json
{
  "elements": {
    "button": {
      "radius": "var(--theme-radius-md)",
      "padding-x-sm": "0.75rem",
      "padding-y-sm": "0.375rem",
      "padding-x-md": "1.25rem",
      "padding-y-md": "0.625rem",
      "padding-x-lg": "1.75rem",
      "padding-y-lg": "0.875rem",
      "font-weight": "600"
    },
    "card": {
      "bg": "var(--theme-color-background)",
      "border": "var(--theme-color-border)",
      "radius": "var(--theme-radius-lg)",
      "shadow": "var(--theme-shadow-sm)",
      "shadow-hover": "var(--theme-shadow-md)",
      "padding": "1.5rem"
    },
    "hero": {
      "bg": "var(--theme-color-primary)",
      "min-height": "500px",
      "padding-y": "4rem",
      "padding-x": "2rem",
      "title-size": "3rem",
      "subtitle-size": "1.25rem",
      "subtitle-color": "var(--theme-element-hero-text-color)",
      "overlay-color": "rgba(0, 0, 0, 0.4)"
    },
    "form": {
      "input-bg": "var(--theme-color-background)",
      "input-border": "var(--theme-color-border)",
      "input-focus-border": "var(--theme-color-primary)",
      "input-radius": "var(--theme-radius-md)",
      "input-padding": "0.625rem 0.875rem",
      "label-color": "var(--theme-color-text)",
      "label-size": "0.875rem",
      "error-color": "var(--theme-color-error)"
    },
    "product": {
      "card-radius": "var(--theme-radius-lg)",
      "card-shadow": "var(--theme-shadow-sm)",
      "card-shadow-hover": "var(--theme-shadow-md)",
      "button-bg": "var(--theme-color-primary)",
      "button-color": "var(--theme-color-text-inverse)",
      "button-bg-hover": "var(--theme-color-primary-hover)",
      "price-color": "var(--theme-color-text)",
      "sale-price-color": "var(--theme-color-error)",
      "grid-gap": "1.5rem"
    }
  }
}
```

Element tokens become CSS variables with the pattern `--theme-element-{category}-{key}`.

#### Known Element Categories

| Category | Purpose |
|----------|---------|
| `button` | Button sizing, radius, font weight |
| `card` | Card background, border, shadow, padding |
| `hero` | Hero section height, padding, text sizing |
| `form` | Input styling, labels, error states |
| `product` | Product card and grid styling |
| `divider` | Divider color, thickness, spacing |
| `accordion` | FAQ/accordion panel styling |
| `modal` | Modal backdrop, background, sizing |
| `countdown` | Countdown timer styling |
| `testimonial` | Testimonial card styling |
| `blog` | Blog card and listing styling |
| `heading` | Heading sizes and colors |
| `image` | Image radius and shadow |
| `gallery` | Gallery gap and radius |
| `voucher` | Voucher/coupon code styling |

---

### menu

Navigation menu styling tokens.

```json
{
  "menu": {
    "text-color": "var(--theme-color-text)",
    "text-hover-color": "var(--theme-color-primary)",
    "background-hover": "var(--theme-color-surface)",
    "dropdown-background": "var(--theme-color-background)",
    "dropdown-shadow": "var(--theme-shadow-lg)",
    "item-gap": "0.5rem",
    "link-padding-x": "0.75rem",
    "link-padding-y": "0.5rem",
    "font-size": "0.9375rem",
    "font-weight": "500",
    "border-radius": "var(--theme-radius-md)",
    "animation-duration": "200ms"
  }
}
```

---

### search

Search component styling tokens.

```json
{
  "search": {
    "bg": "var(--theme-color-surface)",
    "border": "var(--theme-color-border)",
    "focus-border": "var(--theme-color-primary)",
    "radius": "var(--theme-radius-md)",
    "height": "2.5rem",
    "font-size": "0.9375rem",
    "icon-color": "var(--theme-color-text-muted)"
  }
}
```

---

### button variants

Button color variant tokens define colors for all button styles (solid, outline, ghost) across four color variants. These are top-level token categories (not nested under `elements`).

**Variants:** `button-primary`, `button-secondary`, `button-neutral`, `button-danger`

**CSS prefix:** `--theme-element-button-{variant}-{key}`

```json
{
  "button-primary": {
    "solid-bg": "var(--theme-color-primary)",
    "solid-bg-hover": "var(--theme-color-primary-hover)",
    "solid-text": "#ffffff",
    "solid-border": "transparent",
    "outline-bg": "transparent",
    "outline-bg-hover": "var(--theme-color-primary-light)",
    "outline-text": "var(--theme-color-primary)",
    "outline-border": "var(--theme-color-primary)",
    "ghost-bg": "transparent",
    "ghost-bg-hover": "var(--theme-color-primary-light)",
    "ghost-text": "var(--theme-color-primary)",
    "focus-ring-color": "var(--theme-color-primary-light)"
  }
}
```

Each variant follows the same key structure. In CSS, `button-primary.solid-bg` becomes `--theme-element-button-primary-solid-bg`.

---

### card variants

Card style variant tokens define visual treatment for four card styles. These are top-level token categories (not nested under `elements`).

**Styles:** `card-default`, `card-elevated`, `card-bordered`, `card-minimal`

**CSS prefix:** `--theme-element-card-{style}-{key}`

```json
{
  "card-default": {
    "bg": "var(--theme-color-background)",
    "border-width": "1px",
    "border-color": "var(--theme-color-border)",
    "border-color-hover": "var(--theme-color-primary)",
    "shadow": "var(--theme-shadow-sm)",
    "shadow-hover": "var(--theme-shadow-md)"
  },
  "card-elevated": {
    "bg": "var(--theme-color-background)",
    "border-width": "0",
    "border-color": "transparent",
    "shadow": "var(--theme-shadow-md)",
    "shadow-hover": "var(--theme-shadow-lg)"
  }
}
```

In CSS, `card-elevated.shadow` becomes `--theme-element-card-elevated-shadow`.

---

## Cross-referencing Tokens

Use `var()` references to link tokens together. This ensures consistency when merchants customize values in the Brand Builder:

```json
{
  "elements": {
    "card": {
      "border": "var(--theme-color-border)",
      "shadow": "var(--theme-shadow-sm)"
    }
  }
}
```

When the merchant changes `colors.border`, the card border updates automatically.

---

## Responsive Tokens

Some tokens support responsive values using breakpoint objects instead of strings:

```json
{
  "elements": {
    "hero": {
      "min-height": {
        "mobile": "300px",
        "tablet": "400px",
        "desktop": "500px"
      },
      "title-size": {
        "mobile": "1.75rem",
        "tablet": "2.5rem",
        "desktop": "3rem"
      }
    }
  }
}
```

Valid breakpoint keys: `mobile`, `tablet`, `desktop`, `sm`, `md`, `lg`, `xl`, `2xl`.

---

## Validation

Run `spwig validate` to check your tokens:

- Token structure must be valid JSON
- Colors must use valid CSS color formats
- Responsive tokens must use valid breakpoint keys
- `var()` references should use the `--theme-` prefix
- Missing recommended categories (colors, typography, spacing) produce warnings
