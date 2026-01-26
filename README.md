# Spwig Theme SDK

[![SDK Version](https://img.shields.io/badge/SDK-v1.2.0-blue)](https://github.com/spwig/theme-sdk/releases)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/spwig.spwig-theme-dev?label=VS%20Code%20Extension)](https://marketplace.visualstudio.com/items?itemName=spwig.spwig-theme-dev)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/spwig.spwig-theme-dev)](https://marketplace.visualstudio.com/items?itemName=spwig.spwig-theme-dev)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/spwig/theme-sdk?style=social)](https://github.com/spwig/theme-sdk)

Professional theme development toolkit for Spwig eCommerce Platform.

## Overview

The Spwig Theme SDK provides developers with a complete set of tools to create, validate, and package professional themes for the Spwig eCommerce platform. Build custom storefronts with modular components, design tokens, and a powerful templating system.

## Features

- **Theme Scaffolding** - Quick-start templates for new themes
- **Component System** - Modular, reusable UI components
- **Design Tokens** - Centralized styling with CSS variables
- **Validation** - Built-in validation for theme structure and manifest files
- **Packaging** - Create distributable theme packages with checksums
- **TypeScript Support** - Full TypeScript definitions for all APIs
- **Developer Experience** - Interactive CLI with helpful prompts

## Packages

This monorepo contains three packages:

### [VS Code Extension](packages/vscode-extension)
Full-featured VS Code extension for theme development with built-in validation, IntelliSense, snippets, and CLI integration.

Install from [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=spwig.spwig-theme-dev)

**Features:**
- Built-in theme validation (no CLI required)
- JSON schema validation and autocomplete
- 50+ code snippets
- Theme Explorer sidebar
- Jinja2 syntax highlighting

### [@spwig/theme-cli](packages/cli)
Command-line interface for theme development. Create themes, add components, validate, and package your work.

```bash
npm install -g @spwig/theme-cli
```

### [@spwig/theme-validator](packages/validator)
Standalone validation library for programmatic theme validation. Use in build pipelines, CI/CD, or custom tooling.

```bash
npm install @spwig/theme-validator
```

## Quick Start

### Installation

```bash
# Install the CLI globally
npm install -g @spwig/theme-cli

# Verify installation
spwig --version
```

### Create Your First Theme

```bash
# Initialize a new theme
spwig init my-awesome-theme

# Navigate to theme directory
cd my-awesome-theme

# Add a component
spwig component add section hero

# Validate your theme
spwig validate

# Package for distribution
spwig package
```

## CLI Commands

### `spwig init [name]`
Create a new theme with interactive prompts or command-line options.

**Options:**
- `-a, --author <name>` - Author name
- `-e, --email <email>` - Author email
- `-d, --description <text>` - Theme description
- `-l, --license <type>` - License type (default: MIT)
- `--no-git` - Skip git initialization
- `-t, --template <name>` - Template type: blank, minimal, or full (default: full)

### `spwig validate [path]`
Validate a theme or component package.

**Options:**
- `-t, --type <type>` - Package type: theme or component
- `-v, --verbose` - Show detailed validation output

### `spwig package`
Create a distributable theme package (.zip).

**Options:**
- `-o, --output <path>` - Output directory (default: dist)
- `-n, --name <filename>` - Custom package filename
- `--no-validate` - Skip validation before packaging
- `-c, --checksum <algo>` - Checksum algorithm: sha256 or md5 (default: sha256)

### `spwig component add [type] [name]`
Add a new component to your theme.

**Component Types:** header, footer, section, utility

**Options:**
- `-d, --display-name <text>` - Display name
- `--description <text>` - Component description
- `--with-css` - Create styles.css
- `--with-js` - Create script.js
- `-t, --template <name>` - Template type: blank, basic, or advanced

## Theme Structure

```
my-theme/
├── manifest.json           # Theme metadata and configuration
├── tokens.json             # Design tokens (colors, typography, spacing, etc.)
├── components/             # Theme components
│   ├── headers/
│   ├── footers/
│   ├── sections/
│   └── utilities/
├── pages/                  # Page schemas
├── assets/                 # Static assets
└── README.md
```

## Development

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup
```bash
# Clone repository
git clone https://github.com/spwig/theme-sdk.git
cd theme-sdk

# Install dependencies
npm install

# Build all packages
npm run build

# Run in development mode
npm run dev
```

### Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

## Documentation

### Guides
- [Getting Started](docs/GETTING_STARTED.md) - First theme creation walkthrough
- [Design Tokens](docs/DESIGN_TOKENS.md) - Complete design token reference (colors, typography, spacing, etc.)
- [Component Guide](docs/COMPONENT_GUIDE.md) - Building reusable components
- [Template Reference](docs/TEMPLATE_REFERENCE.md) - Jinja2/Django template development
- [Settings Schema](docs/SETTINGS_SCHEMA.md) - Component configuration options
- [Context Variables](docs/CONTEXT_VARIABLES.md) - Available template data

### Package Documentation
- [CLI Package](packages/cli/README.md) - Command-line interface
- [Validator Package](packages/validator/README.md) - Validation library

## Support

For issues, questions, or feature requests:
- **Issues**: [GitHub Issues](https://github.com/spwig/theme-sdk/issues)

## License

Apache License 2.0 - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by Spwig**
