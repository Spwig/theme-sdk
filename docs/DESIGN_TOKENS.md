# Design Tokens Reference

Design tokens are the foundation of your theme. They define colors, typography, spacing, and other design values that the platform converts to CSS custom properties with the `--theme-` prefix.

---

## How Tokens Work

1. You define values in `tokens.json`
2. The platform converts them to CSS variables when the theme is activated
3. All platform templates reference these CSS variables
4. Changing a token value changes every element that uses it

### Naming Convention

Token keys use underscores or hyphens. The platform maps them to CSS variables:

| Token Category | Token Key | CSS Variable |
|---------------|-----------|-------------|
| `colors` | `primary` | `--theme-color-primary` |
| `colors` | `primary_hover` | `--theme-color-primary-hover` |
| `typography` | `font_family_body` | `--theme-typo-font-family-body` |
| `spacing` | `md` | `--theme-space-md` |
| `borders` | `radius_md` | `--theme-border-radius-md` |
| `shadows` | `lg` | `--theme-shadow-lg` |
| `transitions` | `normal` | `--theme-transition-normal` |
| `breakpoints` | `md` | `--theme-breakpoint-md` |
| `container` | `max_width` | `--theme-container-max-width` |
| `elements.button` | `radius` | `--theme-element-button-radius` |
| `menu` | `text-color` | `--theme-menu-text-color` |
| `search` | `bg` | `--theme-search-bg` |

---

## Token Categories

### colors

Brand colors, backgrounds, text colors, semantic colors, and utility colors.

```json
{
  "colors": {
    "primary": "#2563eb",
    "primary_hover": "#1d4ed8",
    "primary_light": "#dbeafe",
    "primary_dark": "#1e40af",
    "secondary": "#64748b",
    "secondary_hover": "#475569",
    "accent": "#10b981",
    "accent_hover": "#059669",
    "background": "#ffffff",
    "surface": "#f9fafb",
    "surface_hover": "#f3f4f6",
    "text": "#1f2937",
    "text_secondary": "#6b7280",
    "text_muted": "#9ca3af",
    "text_inverted": "#ffffff",
    "border": "#e5e7eb",
    "border_dark": "#d1d5db",
    "error": "#ef4444",
    "error_bg": "#fef2f2",
    "success": "#22c55e",
    "success_bg": "#f0fdf4",
    "warning": "#f59e0b",
    "warning_bg": "#fffbeb",
    "info": "#3b82f6",
    "info_bg": "#eff6ff",
    "overlay": "rgba(0, 0, 0, 0.5)",
    "shadow_color": "rgba(0, 0, 0, 0.1)"
  }
}
```

Supported color formats: hex (`#RRGGBB`), `rgb()`, `rgba()`, `hsl()`, `hsla()`.

---

### typography

Font families, sizes, weights, line heights, and letter spacing.

```json
{
  "typography": {
    "font_family_heading": "system-ui, -apple-system, sans-serif",
    "font_family_body": "system-ui, -apple-system, sans-serif",
    "font_family_mono": "'SF Mono', 'Fira Code', monospace",
    "font_size_xs": "0.75rem",
    "font_size_sm": "0.875rem",
    "font_size_base": "1rem",
    "font_size_lg": "1.125rem",
    "font_size_xl": "1.25rem",
    "font_size_2xl": "1.5rem",
    "font_size_3xl": "2rem",
    "font_size_4xl": "2.5rem",
    "font_weight_normal": "400",
    "font_weight_medium": "500",
    "font_weight_semibold": "600",
    "font_weight_bold": "700",
    "line_height_tight": "1.25",
    "line_height_normal": "1.5",
    "line_height_relaxed": "1.75",
    "letter_spacing_tight": "-0.025em",
    "letter_spacing_normal": "0",
    "letter_spacing_wide": "0.05em"
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
    "section_y": "4rem",
    "section_x": "1.5rem"
  }
}
```

---

### borders

Border radius and width values.

```json
{
  "borders": {
    "radius_none": "0",
    "radius_sm": "0.25rem",
    "radius_md": "0.5rem",
    "radius_lg": "0.75rem",
    "radius_xl": "1rem",
    "radius_full": "9999px",
    "width_thin": "1px",
    "width_medium": "2px",
    "width_thick": "3px"
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
    "max_width": "1280px",
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
      "radius": "var(--theme-border-radius-md)",
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
      "radius": "var(--theme-border-radius-lg)",
      "shadow": "var(--theme-shadow-sm)",
      "shadow-hover": "var(--theme-shadow-md)",
      "padding": "1.5rem"
    },
    "hero": {
      "min-height": "500px",
      "padding-y": "4rem",
      "padding-x": "2rem",
      "title-size": "3rem",
      "subtitle-size": "1.25rem",
      "overlay-color": "rgba(0, 0, 0, 0.4)"
    },
    "form": {
      "input-bg": "var(--theme-color-background)",
      "input-border": "var(--theme-color-border)",
      "input-focus-border": "var(--theme-color-primary)",
      "input-radius": "var(--theme-border-radius-md)",
      "input-padding": "0.625rem 0.875rem",
      "label-color": "var(--theme-color-text)",
      "label-size": "0.875rem",
      "error-color": "var(--theme-color-error)"
    },
    "product": {
      "card-radius": "var(--theme-border-radius-lg)",
      "card-shadow": "var(--theme-shadow-sm)",
      "card-shadow-hover": "var(--theme-shadow-md)",
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
    "border-radius": "var(--theme-border-radius-md)",
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
    "radius": "var(--theme-border-radius-md)",
    "height": "2.5rem",
    "font-size": "0.9375rem",
    "icon-color": "var(--theme-color-text-muted)"
  }
}
```

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
