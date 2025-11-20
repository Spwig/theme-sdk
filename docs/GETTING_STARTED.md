# Getting Started with Spwig Theme Development

This guide walks you through setting up your development environment and creating your first Spwig theme.

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Visual Studio Code** - Recommended editor
- **A running Spwig shop** - For live development and testing

Verify your Node.js installation:

```bash
node --version  # Should be 18.0.0 or higher
npm --version
```

---

## Step 1: Install the Spwig Theme CLI

Install the CLI globally to access all theme development commands:

```bash
npm install -g @spwig/theme-cli
```

Verify the installation:

```bash
spwig --version  # Should show 1.1.0 or higher
```

---

## Step 2: Install the VSCode Extension

For the best development experience, install the Spwig Theme Development extension:

1. Open VSCode
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Spwig Theme Development"
4. Click Install

The extension provides:
- **Built-in theme validation** (no CLI required)
- JSON schema validation and autocomplete
- 50+ code snippets
- Theme Explorer sidebar
- Integrated CLI commands
- Jinja2/Django template syntax highlighting

> **Note:** The extension includes built-in validation, so you can validate themes without installing the CLI. The CLI is only required for packaging and dev server features.

---

## Step 3: Create Your First Theme

### Using the CLI

```bash
# Navigate to your projects directory
cd ~/projects

# Create a new theme
spwig init my-first-theme
```

You'll be prompted for:
- **Display name** - Human-readable name (e.g., "My First Theme")
- **Author name** - Your name or company
- **Author email** - Contact email (optional)
- **Description** - Brief theme description
- **License** - MIT, Apache-2.0, GPL-3.0, or Proprietary
- **Initialize git** - Yes/No

### Using VSCode

1. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
2. Type "Spwig: Create New Theme"
3. Follow the prompts

### Template Options

The CLI offers three template types:

| Template | Description | Best For |
|----------|-------------|----------|
| **Full** | Complete theme with components, pages, and assets | Production themes |
| **Minimal** | Basic structure with design tokens | Learning the system |
| **Blank** | Just manifest and README | Starting from scratch |

```bash
# Create with specific template
spwig init my-theme --template minimal
```

---

## Step 4: Understand the Theme Structure

After initialization, your theme folder will look like this:

```
my-first-theme/
├── manifest.json           # Theme metadata and configuration
├── design_tokens.json      # Colors, typography, spacing
├── README.md
├── .gitignore
│
├── components/
│   ├── headers/
│   │   └── default_header/
│   │       ├── manifest.json
│   │       ├── template.html
│   │       ├── schema.json
│   │       └── styles.css
│   ├── footers/
│   │   └── default_footer/
│   └── sections/
│       └── hero_section/
│
├── pages/
│   ├── home.json           # Section configuration for homepage
│   ├── product.json
│   ├── collection.json
│   └── cart.json
│
├── templates/
│   ├── layout.html         # Base layout template
│   ├── home.html
│   ├── product.html
│   ├── collection.html
│   └── cart.html
│
└── assets/
    ├── theme.js
    ├── styles/
    │   └── global.css
    └── images/
        └── logo.svg
```

### Key Files

| File | Purpose |
|------|---------|
| `manifest.json` | Theme name, version, author, component references |
| `design_tokens.json` | Design system values (colors, fonts, spacing) |
| `components/*/manifest.json` | Component metadata and settings |
| `components/*/template.html` | Django/Jinja2 template |
| `components/*/schema.json` | Merchant-configurable settings |
| `templates/*.html` | Page templates |

---

## Step 5: Start the Development Server

Connect your theme to a running Spwig shop for live development:

```bash
cd my-first-theme

# Start dev server connected to your local shop
spwig dev --shop http://localhost:8000
```

You'll be prompted for admin credentials. Once connected:

1. Your theme files sync to the shop
2. Browser opens to the preview URL
3. File changes trigger hot reload:
   - CSS changes → instant style refresh
   - Template/manifest changes → full page reload

### Dev Server Options

```bash
# Don't open browser automatically
spwig dev --shop http://localhost:8000 --no-open

# Enable verbose logging
spwig dev --shop http://localhost:8000 --verbose
```

Press `Ctrl+C` to stop the dev server and disconnect cleanly.

---

## Step 6: Add Components

Create new components using the CLI:

```bash
# Add a new section component
spwig component add section featured_products

# Add with display name and CSS
spwig component add section newsletter_signup --display-name "Newsletter Signup" --with-css
```

Or use VSCode:
1. Press `Ctrl+Alt+C` / `Cmd+Alt+C`
2. Select component type
3. Enter component name

### Component Types

| Type | Purpose | Region |
|------|---------|--------|
| **header** | Site navigation, logo, cart | Top of page |
| **footer** | Links, contact, copyright | Bottom of page |
| **section** | Content blocks (hero, features, etc.) | Main content area |
| **utility** | Reusable elements (buttons, cards) | Anywhere |

---

## Step 7: Validate Your Theme

Check your theme for errors before packaging:

```bash
spwig validate

# Verbose output
spwig validate --verbose
```

Or in VSCode: `Ctrl+Alt+V` / `Cmd+Alt+V`

The validator checks:
- Manifest structure and required fields
- Component file completeness
- Asset sizes (max 5MB for images)
- Design token format

---

## Step 8: Package for Distribution

Create a distributable ZIP package:

```bash
spwig package
```

This creates:
- `dist/my-first-theme-1.0.0.zip` - Theme package
- `dist/my-first-theme-1.0.0.sha256` - Checksum file

### Package Options

```bash
# Custom output directory
spwig package --output build

# Custom filename
spwig package --name my-theme-release

# Skip validation (not recommended)
spwig package --no-validate
```

---

## Common Workflows

### Making Style Changes

1. Edit `assets/styles/global.css` or component `styles.css`
2. Save the file
3. Dev server syncs and applies CSS instantly (no page reload)

### Updating Component Settings

1. Edit the component's `schema.json` to add/modify settings
2. Update `template.html` to use the new settings
3. Save both files
4. Dev server reloads the page

### Using Design Tokens

Reference tokens in your CSS:

```css
.hero-title {
  font-family: var(--font-family-heading);
  color: var(--color-primary);
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-lg);
}
```

### Adding a New Page

1. Create a page schema in `pages/`:
   ```json
   {
     "page_type": "about",
     "sections": [
       {
         "type": "hero_section",
         "settings": {
           "title": "About Us"
         }
       }
     ]
   }
   ```

2. Create a page template in `templates/about.html`:
   ```django
   {% extends "layout.html" %}

   {% block content %}
     {% for section in page.sections %}
       {% include section.template %}
     {% endfor %}
   {% endblock %}
   ```

---

## VSCode Snippets

Speed up development with built-in snippets. Type the prefix and press Tab:

### Manifests
- `spwig-manifest` - Complete theme manifest
- `spwig-component-manifest-section` - Section component manifest

### Settings
- `spwig-setting-text` - Text input
- `spwig-setting-color` - Color picker
- `spwig-setting-select` - Dropdown
- `spwig-setting-checkbox` - Toggle

### Templates
- `spwig-product-card` - Product card HTML
- `spwig-hero` - Hero section
- `spwig-for` - Django for loop
- `spwig-if` - Django if statement

### Design Tokens
- `spwig-tokens` - Complete design tokens
- `spwig-color-palette` - Color definitions

---

## Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|---------------|-------|
| Validate Theme | `Ctrl+Alt+V` | `Cmd+Alt+V` |
| Package Theme | `Ctrl+Alt+P` | `Cmd+Alt+P` |
| Start Dev Server | `Ctrl+Alt+D` | `Cmd+Alt+D` |
| Add Component | `Ctrl+Alt+C` | `Cmd+Alt+C` |

---

## Troubleshooting

### Dev server won't connect

- Verify the shop is running and accessible
- Check your admin credentials
- Ensure DEBUG mode is enabled on the shop
- Try with `--verbose` flag for detailed logs

### Validation errors

- Run `spwig validate --verbose` for detailed output
- Check file paths match manifest references
- Ensure all required fields are present
- Verify JSON syntax in all `.json` files

### Changes not reflecting

- Check the dev server terminal for sync errors
- Ensure you saved the file
- For template changes, wait for full page reload
- Clear browser cache if styles seem stuck

### VSCode extension not working

- Ensure CLI is installed globally
- Check the theme has a `manifest.json` in the root
- Reload VSCode window (`Ctrl+Shift+P` → "Reload Window")

---

## Next Steps

- Read the [Component Development Guide](./COMPONENT_GUIDE.md) for advanced patterns
- Explore the [Design Tokens Reference](./DESIGN_TOKENS.md) for styling best practices
- Check example themes in the `examples/` directory
- Join the developer community for support

---

## Quick Reference

```bash
# Create theme
spwig init my-theme

# Start development
spwig dev --shop http://localhost:8000

# Add component
spwig component add section my_section

# Validate
spwig validate

# Package
spwig package
```

Happy theming!
