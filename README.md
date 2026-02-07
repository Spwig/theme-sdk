# Spwig Theme SDK

[![SDK Version](https://img.shields.io/badge/SDK-v2.0.0-blue)](https://github.com/spwig/theme-sdk/releases)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/spwig.spwig-theme-dev?label=VS%20Code%20Extension)](https://marketplace.visualstudio.com/items?itemName=spwig.spwig-theme-dev)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

Token-focused theme development toolkit for Spwig eCommerce Platform.

## Overview

The Spwig Theme SDK v2.0 provides a streamlined toolkit for creating themes through design tokens. Themes control the visual identity of a Spwig storefront by defining colors, typography, spacing, and element styles -- the platform handles all rendering.

### Two Tiers

- **Tier 1: Token Themes** -- `manifest.json` + `tokens.json` + optional `overrides.css`. Change colors, fonts, spacing, and element styles through design tokens.
- **Tier 2: Token + Presets** -- Adds `presets/` directory with header/footer JSON definitions for structural layout differentiation.

## Packages

### [@spwig/theme-cli](packages/cli)
Command-line interface for theme development.

```bash
npm install -g @spwig/theme-cli
```

### [@spwig/theme-validator](packages/validator)
Standalone validation library for CI/CD pipelines and custom tooling.

```bash
npm install @spwig/theme-validator
```

### [VS Code Extension](packages/vscode-extension)
Full-featured VS Code extension with validation, IntelliSense, snippets, and Theme Explorer sidebar.

Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=spwig.spwig-theme-dev)

## Quick Start

```bash
# Install the CLI
npm install -g @spwig/theme-cli

# Create a new theme
spwig init my-theme

# Edit tokens.json to customize your design system
# ...

# Start dev server (live preview)
spwig dev --shop http://localhost:8000

# Validate
spwig validate

# Package for distribution
spwig package
```

## Theme Structure

```
my-theme/
  manifest.json       # Theme metadata and configuration
  tokens.json         # Design tokens (primary deliverable)
  overrides.css       # Optional CSS overrides
  presets/             # Optional header/footer presets (Tier 2)
    headers/
      classic.json
    footers/
      standard.json
```

## CLI Commands

### `spwig init [name]`
Create a new theme with interactive prompts.

| Option | Description |
|--------|-------------|
| `-a, --author <name>` | Author name |
| `-d, --description <text>` | Theme description |
| `-l, --license <type>` | License (MIT, Apache-2.0, GPL-3.0, Proprietary) |
| `-t, --template <type>` | Template: basic, standard, or complete |
| `--no-git` | Skip git initialization |

### `spwig validate [path]`
Validate a theme package.

| Option | Description |
|--------|-------------|
| `-v, --verbose` | Show detailed validation output |

### `spwig package`
Create a distributable `.zip` package with checksum.

| Option | Description |
|--------|-------------|
| `-o, --output <path>` | Output directory (default: dist) |
| `-n, --name <filename>` | Custom package filename |
| `--no-validate` | Skip validation before packaging |

### `spwig dev`
Start a development server for live preview.

| Option | Description |
|--------|-------------|
| `-s, --shop <url>` | Shop URL to connect to |
| `--no-open` | Do not open browser automatically |

## Documentation

- [Getting Started](docs/GETTING_STARTED.md) -- First theme creation walkthrough
- [Design Tokens](docs/DESIGN_TOKENS.md) -- Complete token reference
- [Presets](docs/PRESETS.md) -- Header and footer preset development

## Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup
```bash
git clone https://github.com/spwig/theme-sdk.git
cd theme-sdk
npm install
npm run build
```

### Testing
```bash
npm test
npm run lint
npm run format
```

## License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.

---

**Built by Spwig**
