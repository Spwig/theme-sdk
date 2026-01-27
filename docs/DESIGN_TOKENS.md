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

All tokens live in `tokens.json` at your theme root:

```json
{
  "colors": { ... },
  "typography": { ... },
  "spacing": { ... },
  "borders": { ... },
  "shadows": { ... },
  "transitions": { ... },
  "breakpoints": { ... },
  "z-index": { ... },
  "container": { ... },
  "menu": { ... }
}
```

> **Note:** Token keys use hyphens (kebab-case), e.g., `primary-dark`, `text-light`, `font-size-lg`.

---

## Color Tokens

### Core Colors

Every theme should define primary, secondary, and accent colors with their variants:

```json
{
  "colors": {
    "primary": "#2563eb",
    "primary-light": "#dbeafe",
    "primary-dark": "#1e40af",
    "primary-hover": "#1d4ed8",

    "secondary": "#8b5cf6",
    "secondary-light": "#a78bfa",
    "secondary-dark": "#7c3aed",
    "secondary-hover": "#6d28d9",

    "accent": "#10b981",
    "accent-light": "#d1fae5",
    "accent-dark": "#059669",
    "accent-hover": "#047857"
  }
}
```

**Usage in CSS:**
```css
.button-primary {
  background-color: var(--color-primary);
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}
```

### Text Colors

```json
{
  "colors": {
    "text": "#1f2937",
    "text-light": "#374151",
    "text-muted": "#6b7280",
    "text-inverse": "#ffffff"
  }
}
```

**Usage in CSS:**
```css
body {
  color: var(--color-text);
}

.subtitle {
  color: var(--color-text-light);
}

.caption {
  color: var(--color-text-muted);
}

.button-primary {
  color: var(--color-text-inverse);
}
```

### Background & Surface Colors

```json
{
  "colors": {
    "background": "#ffffff",
    "background-secondary": "#f9fafb",
    "background-tertiary": "#f3f4f6",
    "background-alt": "#f9fafb",

    "surface": "#ffffff",
    "surface-secondary": "#fafafa",
    "surface-variant": "#f3f4f6",
    "surface-hover": "#f3f4f6",
    "surface-dark": "#e5e7eb",

    "header-bg": "#ffffff",
    "footer-bg": "#f9fafb"
  }
}
```

**Usage in CSS:**
```css
body {
  background-color: var(--color-background);
}

.card {
  background-color: var(--color-surface);
}

.card:hover {
  background-color: var(--color-surface-hover);
}

header {
  background-color: var(--color-header-bg);
}

footer {
  background-color: var(--color-footer-bg);
}
```

### Border Colors

```json
{
  "colors": {
    "border": "#e5e7eb",
    "border-light": "#f3f4f6",
    "border-dark": "#d1d5db"
  }
}
```

**Usage in CSS:**
```css
.card {
  border: 1px solid var(--color-border);
}

.divider-subtle {
  border-color: var(--color-border-light);
}

.input:focus {
  border-color: var(--color-border-dark);
}
```

### Semantic Colors

```json
{
  "colors": {
    "success": "#10b981",
    "success-light": "#d1fae5",
    "success-dark": "#059669",

    "warning": "#f59e0b",
    "warning-light": "#fef3c7",
    "warning-dark": "#d97706",

    "error": "#ef4444",
    "error-light": "#fee2e2",
    "error-dark": "#dc2626",

    "info": "#3b82f6",
    "info-light": "#dbeafe",
    "info-dark": "#2563eb"
  }
}
```

**Usage in CSS:**
```css
.alert-success {
  background-color: var(--color-success-light);
  border-color: var(--color-success);
  color: var(--color-success-dark);
}

.sale-badge {
  background-color: var(--color-error);
}
```

### Utility Colors

```json
{
  "colors": {
    "shadow": "rgba(0, 0, 0, 0.1)",
    "overlay": "rgba(0, 0, 0, 0.5)"
  }
}
```

**Usage in CSS:**
```css
.modal-backdrop {
  background-color: var(--color-overlay);
}

.card {
  box-shadow: 0 4px 6px var(--color-shadow);
}
```

### Complete Color Palette Example

```json
{
  "colors": {
    "primary": "#2563eb",
    "primary-light": "#dbeafe",
    "primary-dark": "#1e40af",
    "primary-hover": "#1d4ed8",

    "secondary": "#64748b",
    "secondary-light": "#94a3b8",
    "secondary-dark": "#475569",
    "secondary-hover": "#475569",

    "accent": "#10b981",
    "accent-light": "#d1fae5",
    "accent-dark": "#059669",
    "accent-hover": "#059669",

    "text": "#1f2937",
    "text-light": "#374151",
    "text-muted": "#6b7280",
    "text-inverse": "#ffffff",

    "background": "#ffffff",
    "background-secondary": "#f9fafb",
    "background-tertiary": "#f3f4f6",
    "background-alt": "#f9fafb",

    "surface": "#ffffff",
    "surface-secondary": "#fafafa",
    "surface-variant": "#f3f4f6",
    "surface-hover": "#f3f4f6",
    "surface-dark": "#e5e7eb",

    "header-bg": "#ffffff",
    "footer-bg": "#f9fafb",

    "border": "#e5e7eb",
    "border-light": "#f3f4f6",
    "border-dark": "#d1d5db",

    "success": "#10b981",
    "success-light": "#d1fae5",
    "success-dark": "#059669",

    "warning": "#f59e0b",
    "warning-light": "#fef3c7",
    "warning-dark": "#d97706",

    "error": "#ef4444",
    "error-light": "#fee2e2",
    "error-dark": "#dc2626",

    "info": "#3b82f6",
    "info-light": "#dbeafe",
    "info-dark": "#2563eb",

    "shadow": "rgba(0, 0, 0, 0.1)",
    "overlay": "rgba(0, 0, 0, 0.5)"
  }
}
```

### Color Formats

You can use any valid CSS color format:

```json
{
  "colors": {
    "hex": "#3b82f6",
    "hex-short": "#38f",
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

There are two approaches to defining font families:

**Approach 1: Generic font stacks**
```json
{
  "typography": {
    "font-sans": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    "font-serif": "Georgia, 'Times New Roman', serif",
    "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace"
  }
}
```

**Approach 2: Semantic font assignments with per-heading fonts**
```json
{
  "typography": {
    "font-family-body": "Inter, system-ui, sans-serif",
    "font-family-h1": "Inter, system-ui, sans-serif",
    "font-family-h2": "Inter, system-ui, sans-serif",
    "font-family-h3": "Inter, system-ui, sans-serif",
    "font-family-h4": "Inter, system-ui, sans-serif",
    "font-family-h5": "Inter, system-ui, sans-serif",
    "font-family-h6": "Inter, system-ui, sans-serif"
  }
}
```

This allows for mixed typography, such as serif headings with sans-serif body:
```json
{
  "typography": {
    "font-family-body": "Inter, system-ui, sans-serif",
    "font-family-h1": "'Playfair Display', serif",
    "font-family-h2": "'Playfair Display', serif"
  }
}
```

**Usage in CSS:**
```css
body {
  font-family: var(--font-family-body);
}

h1 {
  font-family: var(--font-family-h1);
}

code, pre {
  font-family: var(--font-mono);
}
```

### Font Sizes

**T-Shirt sizing scale:**
```json
{
  "typography": {
    "font-size-xs": "0.75rem",
    "font-size-sm": "0.875rem",
    "font-size-base": "1rem",
    "font-size-lg": "1.125rem",
    "font-size-xl": "1.25rem",
    "font-size-2xl": "1.5rem",
    "font-size-3xl": "1.875rem",
    "font-size-4xl": "2.25rem",
    "font-size-5xl": "3rem"
  }
}
```

**Per-heading sizes (alternative):**
```json
{
  "typography": {
    "font-size-body": "1rem",
    "font-size-h1": "2.5rem",
    "font-size-h2": "2rem",
    "font-size-h3": "1.75rem",
    "font-size-h4": "1.5rem",
    "font-size-h5": "1.25rem",
    "font-size-h6": "1rem"
  }
}
```

| Token | Size | Pixels (at 16px base) |
|-------|------|----------------------|
| `font-size-xs` | 0.75rem | 12px |
| `font-size-sm` | 0.875rem | 14px |
| `font-size-base` | 1rem | 16px |
| `font-size-lg` | 1.125rem | 18px |
| `font-size-xl` | 1.25rem | 20px |
| `font-size-2xl` | 1.5rem | 24px |
| `font-size-3xl` | 1.875rem | 30px |
| `font-size-4xl` | 2.25rem | 36px |
| `font-size-5xl` | 3rem | 48px |

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

**Generic weights:**
```json
{
  "typography": {
    "font-weight-normal": "400",
    "font-weight-medium": "500",
    "font-weight-semibold": "600",
    "font-weight-bold": "700"
  }
}
```

**Per-heading weights (optional, for fine control):**
```json
{
  "typography": {
    "font-weight-body": "400",
    "font-weight-h1": "700",
    "font-weight-h2": "600",
    "font-weight-h3": "600",
    "font-weight-h4": "500",
    "font-weight-h5": "500",
    "font-weight-h6": "500"
  }
}
```

**Usage in CSS:**
```css
h1 {
  font-weight: var(--font-weight-h1);
}

.subtitle {
  font-weight: var(--font-weight-medium);
}
```

### Line Heights

**Generic scale:**
```json
{
  "typography": {
    "line-height-tight": "1.25",
    "line-height-normal": "1.5",
    "line-height-relaxed": "1.625",
    "line-height-base": "1.5"
  }
}
```

**Per-heading line heights (optional):**
```json
{
  "typography": {
    "line-height-body": "1.5",
    "line-height-h1": "1.2",
    "line-height-h2": "1.3",
    "line-height-h3": "1.3",
    "line-height-h4": "1.4",
    "line-height-h5": "1.4",
    "line-height-h6": "1.4"
  }
}
```

**Usage in CSS:**
```css
h1 {
  line-height: var(--line-height-h1);
}

p {
  line-height: var(--line-height-normal);
}
```

### Letter Spacing

```json
{
  "typography": {
    "letter-spacing-tight": "-0.025em",
    "letter-spacing-normal": "0",
    "letter-spacing-wide": "0.025em"
  }
}
```

**Usage in CSS:**
```css
.heading {
  letter-spacing: var(--letter-spacing-tight);
}

.uppercase-label {
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
}
```

### Complete Typography Example

```json
{
  "typography": {
    "font-sans": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    "font-serif": "Georgia, 'Times New Roman', serif",
    "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",

    "font-family-body": "Inter, system-ui, sans-serif",
    "font-family-h1": "Inter, system-ui, sans-serif",
    "font-family-h2": "Inter, system-ui, sans-serif",
    "font-family-h3": "Inter, system-ui, sans-serif",
    "font-family-h4": "Inter, system-ui, sans-serif",
    "font-family-h5": "Inter, system-ui, sans-serif",
    "font-family-h6": "Inter, system-ui, sans-serif",

    "font-size-xs": "0.75rem",
    "font-size-sm": "0.875rem",
    "font-size-base": "1rem",
    "font-size-lg": "1.125rem",
    "font-size-xl": "1.25rem",
    "font-size-2xl": "1.5rem",
    "font-size-3xl": "1.875rem",
    "font-size-4xl": "2.25rem",
    "font-size-5xl": "3rem",

    "font-size-body": "1rem",
    "font-size-h1": "2.5rem",
    "font-size-h2": "2rem",
    "font-size-h3": "1.75rem",
    "font-size-h4": "1.5rem",
    "font-size-h5": "1.25rem",
    "font-size-h6": "1rem",

    "font-weight-normal": "400",
    "font-weight-medium": "500",
    "font-weight-semibold": "600",
    "font-weight-bold": "700",

    "font-weight-body": "400",
    "font-weight-h1": "700",
    "font-weight-h2": "600",
    "font-weight-h3": "600",
    "font-weight-h4": "500",
    "font-weight-h5": "500",
    "font-weight-h6": "500",

    "line-height-tight": "1.25",
    "line-height-normal": "1.5",
    "line-height-relaxed": "1.625",
    "line-height-base": "1.5",

    "line-height-body": "1.5",
    "line-height-h1": "1.2",
    "line-height-h2": "1.3",
    "line-height-h3": "1.3",
    "line-height-h4": "1.4",
    "line-height-h5": "1.4",
    "line-height-h6": "1.4",

    "letter-spacing-tight": "-0.025em",
    "letter-spacing-normal": "0",
    "letter-spacing-wide": "0.025em"
  }
}
```

---

## Spacing Tokens

### Spacing Scale

```json
{
  "spacing": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem"
  }
}
```

| Token | Value | Pixels (at 16px base) |
|-------|-------|----------------------|
| `--space-0` | 0 | 0px |
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-5` | 1.25rem | 20px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-10` | 2.5rem | 40px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-20` | 5rem | 80px |
| `--space-24` | 6rem | 96px |

**Usage in CSS:**
```css
.card {
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.button {
  padding: var(--space-2) var(--space-4);
}

.section {
  padding: var(--space-12) 0;
}

.stack > * + * {
  margin-top: var(--space-4);
}
```

---

## Border Tokens

### Border Width

```json
{
  "borders": {
    "width-0": "0",
    "width-1": "1px",
    "width-2": "2px"
  }
}
```

**Usage in CSS:**
```css
.card {
  border: var(--border-width-1) solid var(--color-border);
}

.button-outlined {
  border: var(--border-width-2) solid var(--color-primary);
}
```

### Border Radius

```json
{
  "borders": {
    "radius-none": "0",
    "radius-sm": "0.25rem",
    "radius-base": "0.375rem",
    "radius-md": "0.5rem",
    "radius-lg": "0.75rem",
    "radius-xl": "1rem",
    "radius-full": "9999px"
  }
}
```

| Token | Value | Use Case |
|-------|-------|----------|
| `radius-none` | 0 | Sharp corners |
| `radius-sm` | 0.25rem (4px) | Subtle rounding |
| `radius-base` | 0.375rem (6px) | Default elements |
| `radius-md` | 0.5rem (8px) | Buttons, inputs |
| `radius-lg` | 0.75rem (12px) | Cards, panels |
| `radius-xl` | 1rem (16px) | Large containers |
| `radius-full` | 9999px | Circles, pills |

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
  border-radius: var(--border-radius-base);
}
```

### Complete Borders Example

```json
{
  "borders": {
    "width-0": "0",
    "width-1": "1px",
    "width-2": "2px",
    "radius-none": "0",
    "radius-sm": "0.25rem",
    "radius-base": "0.375rem",
    "radius-md": "0.5rem",
    "radius-lg": "0.75rem",
    "radius-xl": "1rem",
    "radius-full": "9999px"
  }
}
```

---

## Shadow Tokens

```json
{
  "shadows": {
    "none": "none",
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "base": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  }
}
```

| Token | Use Case |
|-------|----------|
| `shadow-none` | Remove shadow |
| `shadow-sm` | Subtle depth |
| `shadow-base` | Default cards |
| `shadow-md` | Elevated cards |
| `shadow-lg` | Dropdowns, modals |
| `shadow-xl` | Floating elements |

**Usage in CSS:**
```css
.card {
  box-shadow: var(--shadow-base);
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
```

---

## Transition Tokens

```json
{
  "transitions": {
    "duration-fast": "150ms",
    "duration-base": "200ms",
    "duration-slow": "300ms",
    "easing-default": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easing-in": "cubic-bezier(0.4, 0, 1, 1)",
    "easing-out": "cubic-bezier(0, 0, 0.2, 1)"
  }
}
```

| Token | Value | Use Case |
|-------|-------|----------|
| `duration-fast` | 150ms | Quick feedback |
| `duration-base` | 200ms | Standard transitions |
| `duration-slow` | 300ms | Deliberate animations |
| `easing-default` | ease-in-out | General purpose |
| `easing-in` | ease-in | Enter animations |
| `easing-out` | ease-out | Exit animations |

**Usage in CSS:**
```css
.button {
  transition: all var(--transition-duration-base) var(--transition-easing-default);
}

.dropdown {
  transition: opacity var(--transition-duration-fast) var(--transition-easing-out);
}

.modal {
  transition: transform var(--transition-duration-slow) var(--transition-easing-default);
}

/* Multiple properties */
.card {
  transition:
    transform var(--transition-duration-base) var(--transition-easing-default),
    box-shadow var(--transition-duration-base) var(--transition-easing-default);
}
```

### Alternative: Animations Category

Some themes use `animations` instead of `transitions`:

```json
{
  "animations": {
    "duration-150": "150ms",
    "duration-300": "300ms",
    "easing-in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
  }
}
```

---

## Breakpoint Tokens

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

| Token | Value | Typical Use |
|-------|-------|-------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large displays |

**Usage in CSS:**
```css
.container {
  width: 100%;
  padding: 0 var(--space-4);
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

@media (min-width: 1536px) {
  .container {
    max-width: 1400px;
  }
}
```

### Responsive Grid Example

```css
.product-grid {
  display: grid;
  gap: var(--space-4);
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

## Z-Index Tokens

The z-index scale ensures consistent stacking across your theme:

```json
{
  "z-index": {
    "dropdown": "1000",
    "sticky": "1020",
    "fixed": "1030",
    "modal-backdrop": "1040",
    "modal": "1050",
    "popover": "1060",
    "tooltip": "1070"
  }
}
```

| Token | Value | Use Case |
|-------|-------|----------|
| `dropdown` | 1000 | Dropdown menus |
| `sticky` | 1020 | Sticky headers, navs |
| `fixed` | 1030 | Fixed position elements |
| `modal-backdrop` | 1040 | Modal overlay/backdrop |
| `modal` | 1050 | Modal dialogs |
| `popover` | 1060 | Popovers, tooltips anchored |
| `tooltip` | 1070 | Tooltip content |

**Usage in CSS:**
```css
.dropdown-menu {
  position: absolute;
  z-index: var(--z-index-dropdown);
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: var(--z-index-sticky);
}

.modal-backdrop {
  position: fixed;
  z-index: var(--z-index-modal-backdrop);
}

.modal {
  position: fixed;
  z-index: var(--z-index-modal);
}

.tooltip {
  z-index: var(--z-index-tooltip);
}
```

---

## Container Tokens

Container tokens define the main content width and padding:

```json
{
  "container": {
    "max-width": "1280px",
    "padding": "1rem"
  }
}
```

**Usage in CSS:**
```css
.container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
}
```

---

## Menu Tokens

Menu tokens control the appearance and behavior of navigation menus throughout the storefront. These tokens allow comprehensive customization of colors, spacing, typography, and animations for menu components.

```json
{
  "menu": {
    "text-color": "var(--color-text)",
    "text-hover-color": "var(--color-text-inverse)",
    "background": "transparent",
    "background-hover": "var(--color-primary)",
    "dropdown-background": "var(--color-surface)",
    "dropdown-shadow": "var(--shadow-lg)",
    "border-color": "var(--color-border)",
    "active-indicator-color": "var(--color-primary)",
    "item-gap": "var(--space-1)",
    "link-padding-x": "var(--space-4)",
    "link-padding-y": "var(--space-2)",
    "dropdown-padding": "var(--space-2)",
    "dropdown-offset": "var(--space-2)",
    "font-size": "var(--font-size-base)",
    "font-weight": "var(--font-weight-medium)",
    "font-weight-active": "var(--font-weight-semibold)",
    "border-radius": "var(--radius-md)",
    "dropdown-border-radius": "var(--radius-lg)",
    "animation-duration": "var(--duration-fast)",
    "animation-timing": "var(--easing-default)",
    "slide-duration": "var(--duration-slow)"
  }
}
```

### Menu Token Reference

| Token | Description | Typical Value |
|-------|-------------|---------------|
| `text-color` | Default text color for menu items | `var(--color-text)` |
| `text-hover-color` | Text color when hovered | `var(--color-text-inverse)` |
| `background` | Default menu item background | `transparent` |
| `background-hover` | Background color on hover | `var(--color-primary)` |
| `dropdown-background` | Dropdown panel background | `var(--color-surface)` |
| `dropdown-shadow` | Shadow for dropdown menus | `var(--shadow-lg)` |
| `border-color` | Border color for separators | `var(--color-border)` |
| `active-indicator-color` | Color for active page indicator | `var(--color-primary)` |
| `item-gap` | Space between menu items | `var(--space-1)` |
| `link-padding-x` | Horizontal padding for links | `var(--space-4)` |
| `link-padding-y` | Vertical padding for links | `var(--space-2)` |
| `dropdown-padding` | Padding inside dropdown panels | `var(--space-2)` |
| `dropdown-offset` | Gap between parent and dropdown | `var(--space-2)` |
| `font-size` | Menu item font size | `var(--font-size-base)` |
| `font-weight` | Default font weight | `var(--font-weight-medium)` |
| `font-weight-active` | Font weight for active items | `var(--font-weight-semibold)` |
| `border-radius` | Border radius for menu items | `var(--radius-md)` |
| `dropdown-border-radius` | Border radius for dropdowns | `var(--radius-lg)` |
| `animation-duration` | Duration for hover animations | `var(--duration-fast)` |
| `animation-timing` | Easing function for animations | `var(--easing-default)` |
| `slide-duration` | Duration for mobile slide animations | `var(--duration-slow)` |

**Usage in CSS:**
```css
.widget-menu .menu-link {
  color: var(--menu-text-color);
  padding: var(--menu-link-padding-y) var(--menu-link-padding-x);
  font-size: var(--menu-font-size);
  font-weight: var(--menu-font-weight);
  border-radius: var(--menu-border-radius);
  transition: all var(--menu-animation-duration) var(--menu-animation-timing);
}

.widget-menu .menu-link:hover {
  color: var(--menu-text-hover-color);
  background: var(--menu-background-hover);
}

.widget-menu .dropdown-menu {
  background: var(--menu-dropdown-background);
  box-shadow: var(--menu-dropdown-shadow);
  border-radius: var(--menu-dropdown-border-radius);
  padding: var(--menu-dropdown-padding);
}
```

### Mobile Menu Modes

Themes should support these mobile menu mode classes:

| Class | Description |
|-------|-------------|
| `.mobile-mode-hamburger` | Traditional hamburger toggle menu (default) |
| `.mobile-mode-bottom-nav` | Fixed bottom navigation bar |
| `.mobile-mode-slide` | Off-canvas slide-in menu |
| `.mobile-mode-fullscreen` | Fullscreen overlay menu |

---

## Complete Design Tokens Example

```json
{
  "colors": {
    "primary": "#2563eb",
    "primary-light": "#dbeafe",
    "primary-dark": "#1e40af",
    "primary-hover": "#1d4ed8",

    "secondary": "#64748b",
    "secondary-light": "#94a3b8",
    "secondary-dark": "#475569",
    "secondary-hover": "#475569",

    "accent": "#10b981",
    "accent-light": "#d1fae5",
    "accent-dark": "#059669",
    "accent-hover": "#059669",

    "text": "#1f2937",
    "text-light": "#374151",
    "text-muted": "#6b7280",
    "text-inverse": "#ffffff",

    "background": "#ffffff",
    "background-secondary": "#f9fafb",
    "background-tertiary": "#f3f4f6",
    "background-alt": "#f9fafb",

    "surface": "#ffffff",
    "surface-secondary": "#fafafa",
    "surface-variant": "#f3f4f6",
    "surface-hover": "#f3f4f6",
    "surface-dark": "#e5e7eb",

    "header-bg": "#ffffff",
    "footer-bg": "#f9fafb",

    "border": "#e5e7eb",
    "border-light": "#f3f4f6",
    "border-dark": "#d1d5db",

    "success": "#10b981",
    "success-light": "#d1fae5",
    "success-dark": "#059669",

    "warning": "#f59e0b",
    "warning-light": "#fef3c7",
    "warning-dark": "#d97706",

    "error": "#ef4444",
    "error-light": "#fee2e2",
    "error-dark": "#dc2626",

    "info": "#3b82f6",
    "info-light": "#dbeafe",
    "info-dark": "#2563eb",

    "shadow": "rgba(0, 0, 0, 0.1)",
    "overlay": "rgba(0, 0, 0, 0.5)"
  },

  "typography": {
    "font-sans": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    "font-serif": "Georgia, 'Times New Roman', serif",
    "font-mono": "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",

    "font-size-xs": "0.75rem",
    "font-size-sm": "0.875rem",
    "font-size-base": "1rem",
    "font-size-lg": "1.125rem",
    "font-size-xl": "1.25rem",
    "font-size-2xl": "1.5rem",
    "font-size-3xl": "1.875rem",
    "font-size-4xl": "2.25rem",
    "font-size-5xl": "3rem",

    "font-weight-normal": "400",
    "font-weight-medium": "500",
    "font-weight-semibold": "600",
    "font-weight-bold": "700",

    "line-height-tight": "1.25",
    "line-height-normal": "1.5",
    "line-height-relaxed": "1.625",

    "letter-spacing-tight": "-0.025em",
    "letter-spacing-normal": "0",
    "letter-spacing-wide": "0.025em"
  },

  "spacing": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "5": "1.25rem",
    "6": "1.5rem",
    "8": "2rem",
    "10": "2.5rem",
    "12": "3rem",
    "16": "4rem",
    "20": "5rem",
    "24": "6rem"
  },

  "borders": {
    "width-0": "0",
    "width-1": "1px",
    "width-2": "2px",
    "radius-none": "0",
    "radius-sm": "0.25rem",
    "radius-base": "0.375rem",
    "radius-md": "0.5rem",
    "radius-lg": "0.75rem",
    "radius-xl": "1rem",
    "radius-full": "9999px"
  },

  "shadows": {
    "none": "none",
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "base": "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
  },

  "transitions": {
    "duration-fast": "150ms",
    "duration-base": "200ms",
    "duration-slow": "300ms",
    "easing-default": "cubic-bezier(0.4, 0, 0.2, 1)",
    "easing-in": "cubic-bezier(0.4, 0, 1, 1)",
    "easing-out": "cubic-bezier(0, 0, 0.2, 1)"
  },

  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px",
    "2xl": "1536px"
  },

  "z-index": {
    "dropdown": "1000",
    "sticky": "1020",
    "fixed": "1030",
    "modal-backdrop": "1040",
    "modal": "1050",
    "popover": "1060",
    "tooltip": "1070"
  },

  "container": {
    "max-width": "1280px",
    "padding": "1rem"
  },

  "menu": {
    "text-color": "var(--color-text)",
    "text-hover-color": "var(--color-text-inverse)",
    "background": "transparent",
    "background-hover": "var(--color-primary)",
    "dropdown-background": "var(--color-surface)",
    "dropdown-shadow": "var(--shadow-lg)",
    "border-color": "var(--color-border)",
    "active-indicator-color": "var(--color-primary)",
    "item-gap": "var(--space-1)",
    "link-padding-x": "var(--space-4)",
    "link-padding-y": "var(--space-2)",
    "dropdown-padding": "var(--space-2)",
    "dropdown-offset": "var(--space-2)",
    "font-size": "var(--font-size-base)",
    "font-weight": "var(--font-weight-medium)",
    "font-weight-active": "var(--font-weight-semibold)",
    "border-radius": "var(--radius-md)",
    "dropdown-border-radius": "var(--radius-lg)",
    "animation-duration": "var(--duration-fast)",
    "animation-timing": "var(--easing-default)",
    "slide-duration": "var(--duration-slow)"
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
  padding: var(--space-12) var(--space-4);
}

.hero-content {
  text-align: center;
  max-width: 800px;
}

.hero-heading {
  font-family: var(--font-family-h1);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text);
  margin: 0 0 var(--space-4);
  line-height: var(--line-height-tight);
}

.hero-subheading {
  font-size: var(--font-size-lg);
  color: var(--color-text-light);
  margin: 0 0 var(--space-8);
}

.hero-button {
  display: inline-block;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--space-2) var(--space-8);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-duration-base) var(--transition-easing-default);
}

.hero-button:hover {
  background-color: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    min-height: 400px;
    padding: var(--space-8) var(--space-4);
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
  line-height: var(--line-height-normal);
}

body {
  font-family: var(--font-sans);
  color: var(--color-text);
  background-color: var(--color-background);
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
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
  transition: color var(--transition-duration-fast) var(--transition-easing-default);
}

a:hover {
  color: var(--color-primary-hover);
}

/* Buttons */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-duration-base) var(--transition-easing-default);
}

.button-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.button-primary:hover {
  background-color: var(--color-primary-hover);
}

.button-secondary {
  background-color: var(--color-secondary);
  color: var(--color-text-inverse);
}

.button-outlined {
  background-color: transparent;
  border: var(--border-width-1) solid var(--color-primary);
  color: var(--color-primary);
}

.button-outlined:hover {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

/* Forms */
.input {
  width: 100%;
  padding: var(--space-2) var(--space-4);
  border: var(--border-width-1) solid var(--color-border);
  border-radius: var(--border-radius-base);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-duration-fast) var(--transition-easing-default);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

/* Cards */
.card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-base);
  padding: var(--space-6);
}

/* Container */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
}
```

---

## CSS Variable Naming Convention

When tokens are converted to CSS custom properties, they follow this naming pattern:

| Token Category | Token Key | CSS Variable |
|----------------|-----------|--------------|
| colors | `primary` | `--color-primary` |
| typography | `font-size-lg` | `--font-size-lg` |
| spacing | `4` | `--space-4` |
| borders | `radius-md` | `--border-radius-md` |
| borders | `width-1` | `--border-width-1` |
| shadows | `md` | `--shadow-md` |
| transitions | `duration-base` | `--transition-duration-base` |
| z-index | `modal` | `--z-index-modal` |
| container | `max-width` | `--container-max-width` |

---

## Design System Examples

### Minimal Theme

```json
{
  "colors": {
    "primary": "#000000",
    "primary-hover": "#333333",
    "secondary": "#6b7280",
    "background": "#ffffff",
    "text": "#111827",
    "border": "#e5e7eb"
  },
  "typography": {
    "font-sans": "system-ui, sans-serif",
    "font-size-base": "16px"
  },
  "spacing": {
    "2": "0.5rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem"
  }
}
```

### Luxury/Elegant Theme

```json
{
  "colors": {
    "primary": "#d4af37",
    "primary-hover": "#c9a22e",
    "primary-light": "#f5e6b3",
    "secondary": "#2c2c2c",
    "accent": "#8b7355",
    "background": "#fafafa",
    "text": "#1a1a1a"
  },
  "typography": {
    "font-family-h1": "'Playfair Display', serif",
    "font-family-h2": "'Playfair Display', serif",
    "font-family-body": "'Source Sans Pro', sans-serif",
    "font-size-base": "18px"
  }
}
```

### Dark Mode Theme

```json
{
  "colors": {
    "primary": "#60a5fa",
    "primary-hover": "#3b82f6",
    "secondary": "#a78bfa",
    "accent": "#f472b6",
    "text": "#f9fafb",
    "text-light": "#d1d5db",
    "text-muted": "#9ca3af",
    "background": "#111827",
    "background-secondary": "#1f2937",
    "surface": "#1f2937",
    "surface-hover": "#374151",
    "border": "#374151",
    "shadow": "rgba(0, 0, 0, 0.3)"
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
- Proper kebab-case naming

Run validation:

```bash
spwig validate
```

---

## Best Practices

### Naming

- Use clear, semantic names (`primary`, `success`, not `blue`, `green`)
- Use hyphens (kebab-case): `primary-dark`, `text-light`
- Keep names lowercase

### Colors

- Ensure sufficient contrast (WCAG AA minimum)
- Provide light/dark/hover variants for primary colors
- Include semantic colors (success, warning, error, info)

### Typography

- Use system font stacks for performance
- Define weights you'll actually use
- Consider per-heading font families for mixed typography

### Spacing

- Use consistent increments (4px-based scale)
- Follow 4px/8px grid for visual harmony

### Testing

- Test tokens across all components
- Check responsive behavior
- Verify accessibility (contrast, font sizes)

---

## Migration from v1.0

If upgrading from SDK v1.0:

1. **Rename token file**: `design_tokens.json` → `tokens.json`
2. **Update naming**: Replace underscores with hyphens (`primary_dark` → `primary-dark`)
3. **Add new categories**: Add `z-index` and `container` sections
4. **Update typography**: Add letter-spacing tokens if needed

---

## Next Steps

- [Component Guide](./COMPONENT_GUIDE.md) - Using tokens in components
- [Template Reference](./TEMPLATE_REFERENCE.md) - Page template development
- [Context Variables](./CONTEXT_VARIABLES.md) - Available template data
