# Spwig Theme Development

Build professional themes for Spwig eCommerce with IntelliSense, snippets, and integrated CLI commands.

## Features

### JSON Schema Validation
- Real-time validation for theme manifests
- Autocomplete for all theme configuration files
- Hover documentation for fields

### Code Snippets
- 50+ snippets for common patterns
- Manifest templates
- Component settings
- Django/Jinja2 template blocks

### Built-in Validation
- Standalone theme validation (no CLI required)
- Rich validation reports with errors and warnings
- VS Code diagnostics integration

### CLI Integration
- Create new themes
- Add components
- Package themes for distribution
- Start dev server for live development

### Theme Explorer
- Sidebar view of theme structure
- Quick access to components and pages
- One-click actions

## Commands

| Command | Shortcut | Description |
|---------|----------|-------------|
| `Spwig: Create New Theme` | - | Create a new theme project |
| `Spwig: Add Component` | `Ctrl+Alt+C` | Add a new component |
| `Spwig: Validate Theme` | `Ctrl+Alt+V` | Validate theme structure |
| `Spwig: Package Theme` | `Ctrl+Alt+P` | Create distributable package |
| `Spwig: Start Dev Server` | `Ctrl+Alt+D` | Connect to shop for live development |

## Snippets

### Manifests
- `spwig-manifest` - Theme manifest
- `spwig-component-manifest-*` - Component manifests

### Settings
- `spwig-setting-text` - Text input
- `spwig-setting-color` - Color picker
- `spwig-setting-select` - Dropdown
- `spwig-setting-checkbox` - Toggle

### Templates
- `spwig-product-card` - Product card
- `spwig-hero` - Hero section
- `spwig-header` - Site header
- `spwig-footer` - Site footer

### Design Tokens
- `spwig-tokens` - Complete design tokens
- `spwig-color-palette` - Colors
- `spwig-typography` - Typography

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `spwig.autoValidate` | `true` | Validate on save |
| `spwig.devServer.shopUrl` | `http://localhost:8000` | Shop URL for dev server |
| `spwig.devServer.autoOpen` | `true` | Open browser on dev start |
| `spwig.cli.path` | `spwig` | Path to CLI |

## Requirements

- VS Code 1.80+
- [Spwig Theme CLI](https://www.npmjs.com/package/@spwig/theme-cli) (optional, requires Node.js 20+)

## Installation

### Extension Only (Validation & Development)

1. Install from VS Code Marketplace: search "Spwig Theme Development"
2. Create theme: `Ctrl+Shift+P` → "Spwig: Create New Theme"

### With CLI (Packaging & Dev Server)

The CLI requires Node.js 20+. If you need to install or upgrade Node.js:

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # or ~/.zshrc

# Install and use Node.js 20
nvm install 20
nvm use 20
```

Then install the CLI:

```bash
npm install -g @spwig/theme-cli
```

**Note:** Theme validation works out of the box without the CLI. The CLI is only required for packaging themes and running the dev server.

## Links

- [Documentation](https://community.spwig.com/c/themes-customisation/)
- [Theme CLI](https://www.npmjs.com/package/@spwig/theme-cli)
- [GitHub](https://github.com/spwig/theme-sdk)

## License

Apache-2.0
