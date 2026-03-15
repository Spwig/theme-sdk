# Getting Started with Spwig Theme Development

This guide walks you through creating your first Spwig theme using the v2.0 SDK.

---

## Prerequisites

- **Node.js 18+** - [Download](https://nodejs.org/)
- **A running Spwig shop** - For live development and testing

```bash
node --version  # Should be 18.0.0 or higher
```

---

## Step 1: Install the CLI

```bash
npm install -g @spwig/theme-cli
spwig --version
```

---

## Step 2: Create a Theme

```bash
spwig init my-theme
```

You will be prompted for display name, author, description, and template type.

### Template Options

| Template | Contents | Best For |
|----------|----------|----------|
| **blank** | `manifest.json` only | Absolute minimal starting point |
| **minimal** | Adds `tokens.json` + empty `overrides.css` | Token-only themes |
| **full** | Adds `presets/` with header/footer presets (default) | Full-featured themes |

```bash
# Skip prompts with flags
spwig init my-theme --author "Your Name" --template full
```

---

## Step 3: Understand the Structure

```
my-theme/
  manifest.json       # Theme metadata and configuration
  tokens.json         # Design tokens (the primary deliverable)
  overrides.css       # Optional CSS overrides
  presets/             # Optional header/footer presets (Tier 2)
    headers/
      classic.json
    footers/
      standard.json
```

### What themes provide

Themes control **visual identity** through design tokens. The Spwig platform handles all rendering. There are no template files, component directories, or JavaScript.

### Key files

| File | Purpose |
|------|---------|
| `manifest.json` | Theme name, version, author, platform compatibility |
| `tokens.json` | Design system values: colors, fonts, spacing, element styles |
| `overrides.css` | Optional CSS for fine-grained style adjustments |
| `presets/` | Optional header/footer layout definitions |

---

## Step 4: Edit Tokens

Open `tokens.json` and customize your design system:

```json
{
  "colors": {
    "primary": "#2563eb",
    "primary-hover": "#1d4ed8",
    "text": "#1f2937",
    "background": "#ffffff"
  },
  "typography": {
    "font-family-body": "Inter, system-ui, sans-serif",
    "font-size-base": "1rem"
  },
  "spacing": {
    "md": "1rem",
    "lg": "1.5rem"
  }
}
```

These become CSS custom properties with the `--theme-` prefix:

| Token Path | CSS Variable |
|------------|-------------|
| `colors.primary` | `--theme-color-primary` |
| `typography.font-family-body` | `--theme-font-family-body` |
| `spacing.md` | `--theme-space-md` |

See the [Design Tokens Reference](./DESIGN_TOKENS.md) for all available tokens, including dark mode support.

---

## Step 5: Dev Server

Connect to a running Spwig shop for live preview:

```bash
spwig dev --shop http://localhost:8000
```

Token changes sync in real time. Press `Ctrl+C` to stop.

---

## Step 6: Validate

```bash
spwig validate
spwig validate --verbose  # Detailed output
```

The validator checks manifest structure, token validity, color formats, and preset JSON structure.

---

## Step 7: Package

```bash
spwig package
```

Creates `dist/my-theme-1.0.0.zip` with a SHA256 checksum file.

```bash
spwig package --output build    # Custom output dir
spwig package --no-validate     # Skip validation
```

---

## Step 8: Install on Shop

1. Log in to your Spwig admin panel
2. Navigate to **Design > Themes**
3. Click **Upload Theme** and select the `.zip` file
4. Click **Activate** to apply

When a theme with presets is activated, its header/footer presets become available in the Header/Footer builder.

---

## Using overrides.css

For visual effects that tokens cannot express — hover animations, corner shapes, glassmorphism, neon glows, external fonts:

```css
/* Load Google Fonts (external @imports are preserved) */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');

/* Custom hover animation */
.product-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 12px 24px -4px rgba(0, 0, 0, 0.1);
}

/* Squircle corners (Chrome 139+, graceful fallback) */
.product-card { corner-shape: squircle; }
```

See the [CSS Overrides Guide](./CSS_OVERRIDES_GUIDE.md) for techniques and real-world examples.

---

## VS Code Extension (Optional)

Install "Spwig Theme Development" from the VS Code Marketplace for:

- JSON schema validation and autocomplete
- Code snippets for token patterns
- Theme Explorer sidebar
- Integrated CLI commands

---

## Next Steps

- [Design Tokens Reference](./DESIGN_TOKENS.md) -- All available tokens
- [CSS Overrides Guide](./CSS_OVERRIDES_GUIDE.md) -- Hover effects, corner shapes, glassmorphism, dark theme patterns
- [Component Classes Reference](./COMPONENT_CLASSES.md) -- All platform CSS classes you can target
- [CSS Load Order](./CSS_LOAD_ORDER.md) -- Understanding the cascade
- [Presets Guide](./PRESETS.md) -- Header and footer preset development
- Example themes in `examples/`
