# Design Tokens Reference

Design tokens are the foundation of your theme's visual design. They define colors, typography, spacing, and other design values that get converted to CSS custom properties.

---

## What are Design Tokens?

Design tokens are named values that represent your design decisions. Instead of hardcoding `#3b82f6` throughout your CSS, you define it once as `primary` in your tokens and reference it as `var(--color-primary)`.

### Benefits

- **Consistency** - Same values everywhere
- **Maintainability** - Change once, update everywhere
- **Theming** - Easy to create variations
- **Documentation** - Self-documenting design system

---

## Token File Structure

All tokens live in `design_tokens.json` at your theme root:

```json
{
  "colors": { ... },
  "typography": { ... },
  "spacing": { ... },
  "breakpoints": { ... },
  "borders": { ... },
  "shadows": { ... },
  "transitions": { ... }
}
```

---

## Color Tokens

### Core Colors

```json
{
  "colors": {
    "primary": "#3b82f6",
    "primary_dark": "#2563eb",
    "primary_light": "#60a5fa",
    "secondary": "#8b5cf6",
    "accent": "#f59e0b"
  }
}
```

**Usage in CSS:**
```css
.button-primary {
  background-color: var(--color-primary);
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}
```

### UI Colors

```json
{
  "colors": {
    "background": "#ffffff",
    "surface": "#f9fafb",
    "text": "#111827",
    "text_light": "#6b7280",
    "border": "#e5e7eb"
  }
}
```

**Usage in CSS:**
```css
body {
  background-color: var(--color-background);
  color: var(--color-text);
}

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.caption {
  color: var(--color-text-light);
}
```

### Semantic Colors

```json
{
  "colors": {
    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444",
    "info": "#3b82f6"
  }
}
```

**Usage in CSS:**
```css
.alert-success {
  background-color: var(--color-success);
}

.alert-error {
  background-color: var(--color-error);
}

.sale-badge {
  background-color: var(--color-error);
}
```

### Complete Color Palette

```json
{
  "colors": {
    "primary": "#3b82f6",
    "primary_dark": "#2563eb",
    "primary_light": "#60a5fa",
    "secondary": "#8b5cf6",
    "secondary_dark": "#7c3aed",
    "secondary_light": "#a78bfa",
    "accent": "#f59e0b",
    "accent_dark": "#d97706",
    "accent_light": "#fbbf24",

    "background": "#ffffff",
    "surface": "#f9fafb",
    "surface_dark": "#f3f4f6",

    "text": "#111827",
    "text_light": "#6b7280",
    "text_inverse": "#ffffff",

    "border": "#e5e7eb",
    "border_dark": "#d1d5db",

    "success": "#10b981",
    "success_light": "#d1fae5",
    "warning": "#f59e0b",
    "warning_light": "#fef3c7",
    "error": "#ef4444",
    "error_light": "#fee2e2",
    "info": "#3b82f6",
    "info_light": "#dbeafe"
  }
}
```

### Color Formats

You can use any valid CSS color format:

```json
{
  "colors": {
    "hex": "#3b82f6",
    "hex_short": "#38f",
    "rgb": "rgb(59, 130, 246)",
    "rgba": "rgba(59, 130, 246, 0.5)",
    "hsl": "hsl(217, 91%, 60%)",
    "hsla": "hsla(217, 91%, 60%, 0.5)"
  }
}
```

---

## Typography Tokens

### Font Families

```json
{
  "typography": {
    "heading_font": "Inter, system-ui, sans-serif",
    "body_font": "Inter, system-ui, sans-serif",
    "mono_font": "ui-monospace, SFMono-Regular, monospace"
  }
}
```

**Usage in CSS:**
```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
}

body {
  font-family: var(--font-family-body);
}

code, pre {
  font-family: var(--font-family-mono);
}
```

### Font Sizes

```json
{
  "typography": {
    "base_size": "16px",
    "scale": 1.25
  }
}
```

This generates a type scale:

| Token | Calculation | Result |
|-------|-------------|--------|
| `--font-size-xs` | base / scale^2 | 10.24px |
| `--font-size-sm` | base / scale | 12.8px |
| `--font-size-base` | base | 16px |
| `--font-size-lg` | base * scale | 20px |
| `--font-size-xl` | base * scale^2 | 25px |
| `--font-size-2xl` | base * scale^3 | 31.25px |
| `--font-size-3xl` | base * scale^4 | 39.06px |
| `--font-size-4xl` | base * scale^5 | 48.83px |

**Usage in CSS:**
```css
.heading-xl {
  font-size: var(--font-size-4xl);
}

.body-text {
  font-size: var(--font-size-base);
}

.caption {
  font-size: var(--font-size-sm);
}
```

### Font Weights

```json
{
  "typography": {
    "weights": {
      "light": 300,
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  }
}
```

**Usage in CSS:**
```css
.heading {
  font-weight: var(--font-weight-bold);
}

.subtitle {
  font-weight: var(--font-weight-medium);
}

.body {
  font-weight: var(--font-weight-regular);
}
```

### Complete Typography

```json
{
  "typography": {
    "heading_font": "Inter, system-ui, sans-serif",
    "body_font": "Inter, system-ui, sans-serif",
    "mono_font": "ui-monospace, SFMono-Regular, monospace",
    "base_size": "16px",
    "scale": 1.25,
    "weights": {
      "light": 300,
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    },
    "line_heights": {
      "tight": 1.25,
      "normal": 1.5,
      "relaxed": 1.75
    }
  }
}
```

---

## Spacing Tokens

### Spacing System

```json
{
  "spacing": {
    "unit": "0.25rem",
    "scale": [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64]
  }
}
```

This generates spacing values:

| Token | Calculation | Result |
|-------|-------------|--------|
| `--spacing-0` | 0 * unit | 0 |
| `--spacing-1` | 1 * unit | 0.25rem |
| `--spacing-2` | 2 * unit | 0.5rem |
| `--spacing-3` | 3 * unit | 0.75rem |
| `--spacing-4` | 4 * unit | 1rem |
| `--spacing-6` | 6 * unit | 1.5rem |
| `--spacing-8` | 8 * unit | 2rem |
| `--spacing-12` | 12 * unit | 3rem |
| `--spacing-16` | 16 * unit | 4rem |

### Named Spacing

For convenience, these semantic names are also available:

| Token | Maps To |
|-------|---------|
| `--spacing-xs` | `--spacing-1` (0.25rem) |
| `--spacing-sm` | `--spacing-2` (0.5rem) |
| `--spacing-md` | `--spacing-4` (1rem) |
| `--spacing-lg` | `--spacing-6` (1.5rem) |
| `--spacing-xl` | `--spacing-8` (2rem) |
| `--spacing-2xl` | `--spacing-12` (3rem) |
| `--spacing-3xl` | `--spacing-16` (4rem) |

**Usage in CSS:**
```css
.card {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
}

.section {
  padding: var(--spacing-2xl) 0;
}

.stack > * + * {
  margin-top: var(--spacing-md);
}
```

---

## Border Tokens

### Border Radius

```json
{
  "borders": {
    "radius": {
      "none": "0",
      "sm": "0.125rem",
      "default": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "2xl": "1rem",
      "full": "9999px"
    }
  }
}
```

**Usage in CSS:**
```css
.button {
  border-radius: var(--border-radius-md);
}

.card {
  border-radius: var(--border-radius-lg);
}

.avatar {
  border-radius: var(--border-radius-full);
}

.input {
  border-radius: var(--border-radius-default);
}
```

### Border Width

```json
{
  "borders": {
    "width": {
      "none": "0",
      "default": "1px",
      "2": "2px",
      "4": "4px"
    }
  }
}
```

**Usage in CSS:**
```css
.card {
  border: var(--border-width-default) solid var(--color-border);
}

.button-outlined {
  border: var(--border-width-2) solid var(--color-primary);
}
```

---

## Shadow Tokens

```json
{
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "default": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
    "none": "none"
  }
}
```

**Usage in CSS:**
```css
.card {
  box-shadow: var(--shadow-default);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.dropdown {
  box-shadow: var(--shadow-xl);
}

.button {
  box-shadow: var(--shadow-sm);
}

.input:focus {
  box-shadow: var(--shadow-inner);
}
```

---

## Transition Tokens

```json
{
  "transitions": {
    "fast": "150ms",
    "default": "200ms",
    "slow": "300ms",
    "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
  }
}
```

**Usage in CSS:**
```css
.button {
  transition: all var(--transition-default) var(--transition-easing);
}

.dropdown {
  transition: opacity var(--transition-fast) var(--transition-easing);
}

.modal {
  transition: transform var(--transition-slow) var(--transition-easing);
}

/* Multiple properties */
.card {
  transition:
    transform var(--transition-default) var(--transition-easing),
    box-shadow var(--transition-default) var(--transition-easing);
}
```

---

## Breakpoint Tokens

```json
{
  "breakpoints": {
    "mobile": "640px",
    "tablet": "768px",
    "desktop": "1024px",
    "wide": "1280px"
  }
}
```

**Usage in CSS:**
```css
.container {
  width: 100%;
  padding: 0 var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
    margin: 0 auto;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1200px;
  }
}
```

### Responsive Grid Example

```css
.product-grid {
  display: grid;
  gap: var(--spacing-md);
  grid-template-columns: 1fr;
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Wide: 4 columns */
@media (min-width: 1280px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## Complete Design Tokens Example

```json
{
  "colors": {
    "primary": "#3b82f6",
    "primary_dark": "#2563eb",
    "primary_light": "#60a5fa",
    "secondary": "#8b5cf6",
    "secondary_dark": "#7c3aed",
    "accent": "#f59e0b",

    "background": "#ffffff",
    "surface": "#f9fafb",
    "text": "#111827",
    "text_light": "#6b7280",
    "text_inverse": "#ffffff",
    "border": "#e5e7eb",

    "success": "#10b981",
    "warning": "#f59e0b",
    "error": "#ef4444",
    "info": "#3b82f6"
  },

  "typography": {
    "heading_font": "Inter, system-ui, sans-serif",
    "body_font": "Inter, system-ui, sans-serif",
    "mono_font": "ui-monospace, monospace",
    "base_size": "16px",
    "scale": 1.25,
    "weights": {
      "light": 300,
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  },

  "spacing": {
    "unit": "0.25rem",
    "scale": [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64]
  },

  "breakpoints": {
    "mobile": "640px",
    "tablet": "768px",
    "desktop": "1024px",
    "wide": "1280px"
  },

  "borders": {
    "radius": {
      "none": "0",
      "sm": "0.125rem",
      "default": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "2xl": "1rem",
      "full": "9999px"
    },
    "width": {
      "none": "0",
      "default": "1px",
      "2": "2px"
    }
  },

  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "default": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  },

  "transitions": {
    "fast": "150ms",
    "default": "200ms",
    "slow": "300ms",
    "easing": "cubic-bezier(0.4, 0, 0.2, 1)"
  }
}
```

---

## Using Tokens in Components

### Component Stylesheet

```css
/* components/sections/hero_section/styles.css */

.hero-section {
  position: relative;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
  padding: var(--spacing-2xl) var(--spacing-md);
}

.hero-content {
  text-align: center;
  max-width: 800px;
}

.hero-heading {
  font-family: var(--font-family-heading);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--spacing-md);
  line-height: 1.2;
}

.hero-subheading {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0 0 var(--spacing-xl);
}

.hero-button {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--spacing-sm) var(--spacing-xl);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-default) var(--transition-easing);
}

.hero-button:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    min-height: 400px;
    padding: var(--spacing-xl) var(--spacing-md);
  }

  .hero-heading {
    font-size: var(--font-size-2xl);
  }

  .hero-subheading {
    font-size: var(--font-size-base);
  }
}
```

### Global Stylesheet

```css
/* assets/styles/global.css */

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Base */
html {
  font-size: var(--font-size-base);
  line-height: 1.5;
}

body {
  font-family: var(--font-family-body);
  color: var(--color-text);
  background-color: var(--color-background);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-bold);
  line-height: 1.2;
}

h1 { font-size: var(--font-size-4xl); }
h2 { font-size: var(--font-size-3xl); }
h3 { font-size: var(--font-size-2xl); }
h4 { font-size: var(--font-size-xl); }
h5 { font-size: var(--font-size-lg); }
h6 { font-size: var(--font-size-base); }

/* Links */
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast) var(--transition-easing);
}

a:hover {
  color: var(--color-primary-dark);
}

/* Buttons */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-default) var(--transition-easing);
}

.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.button-primary:hover {
  background-color: var(--color-primary-dark);
}

.button-secondary {
  background-color: var(--color-secondary);
  color: var(--color-text-inverse);
}

.button-outlined {
  background-color: transparent;
  border: var(--border-width-default) solid var(--color-primary);
  color: var(--color-primary);
}

.button-outlined:hover {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

/* Forms */
.input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: var(--border-width-default) solid var(--color-border);
  border-radius: var(--border-radius-default);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast) var(--transition-easing);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Cards */
.card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-default);
  padding: var(--spacing-lg);
}

/* Container */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}
```

---

## Design System Examples

### Minimal System

```json
{
  "colors": {
    "primary": "#000000",
    "secondary": "#6b7280",
    "background": "#ffffff",
    "text": "#111827",
    "border": "#e5e7eb"
  },
  "typography": {
    "heading_font": "system-ui, sans-serif",
    "body_font": "system-ui, sans-serif",
    "base_size": "16px",
    "scale": 1.2
  },
  "spacing": {
    "unit": "0.25rem",
    "scale": [0, 1, 2, 4, 6, 8, 12, 16, 24, 32]
  }
}
```

### Brand-Heavy System

```json
{
  "colors": {
    "primary": "#ff6b35",
    "primary_dark": "#e55a2b",
    "secondary": "#004e89",
    "accent": "#ffd23f",
    "background": "#fffcf9",
    "text": "#1a1a2e"
  },
  "typography": {
    "heading_font": "'Playfair Display', serif",
    "body_font": "'Source Sans Pro', sans-serif",
    "base_size": "18px",
    "scale": 1.333
  }
}
```

### Ecommerce-Optimized

```json
{
  "colors": {
    "primary": "#2563eb",
    "primary_dark": "#1d4ed8",
    "secondary": "#7c3aed",
    "accent": "#f59e0b",
    "success": "#10b981",
    "error": "#ef4444",
    "background": "#ffffff",
    "surface": "#f8fafc",
    "text": "#0f172a",
    "text_light": "#64748b"
  },
  "typography": {
    "heading_font": "Inter, system-ui, sans-serif",
    "body_font": "Inter, system-ui, sans-serif",
    "base_size": "16px",
    "scale": 1.25,
    "weights": {
      "regular": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  }
}
```

---

## Validation

The validator checks your design tokens for:

- Valid JSON structure
- Required sections (colors, typography, spacing)
- Valid color formats
- Valid font stack syntax
- Numeric values where expected

Run validation:

```bash
spwig validate
```

---

## Best Practices

### Naming

- Use clear, semantic names (`primary`, `success`, not `blue`, `green`)
- Use consistent suffixes (`_dark`, `_light`)
- Keep names lowercase with underscores

### Colors

- Ensure sufficient contrast (WCAG AA minimum)
- Provide light/dark variants for primary colors
- Include semantic colors (success, warning, error)

### Typography

- Use system font stacks for performance
- Keep the type scale reasonable (1.2-1.333)
- Define weights you'll actually use

### Spacing

- Use consistent increments
- Follow 4px/8px grid for visual harmony
- Use semantic names in code

### Testing

- Test tokens across all components
- Check responsive behavior
- Verify accessibility (contrast, font sizes)

---

## Next Steps

- [Component Guide](./COMPONENT_GUIDE.md) - Using tokens in components
- [Template Reference](./TEMPLATE_REFERENCE.md) - Page template development
- [Context Variables](./CONTEXT_VARIABLES.md) - Available template data
