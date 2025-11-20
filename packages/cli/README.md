# @spwig/theme-cli

Command-line interface for Spwig theme development.

## Installation

### Global Installation (Recommended)

```bash
npm install -g @spwig/theme-cli
```

After installation, the `spwig` command will be available globally:

```bash
spwig --version
spwig --help
```

### Local Installation

```bash
npm install --save-dev @spwig/theme-cli
```

Use with npx:

```bash
npx spwig init my-theme
```

Or add to package.json scripts:

```json
{
  "scripts": {
    "theme:init": "spwig init",
    "theme:validate": "spwig validate",
    "theme:package": "spwig package"
  }
}
```

## Commands

### `spwig init [name]`

Create a new Spwig theme with guided setup.

**Arguments:**
- `name` - Theme name (optional, will prompt if not provided)

**Options:**
- `-a, --author <name>` - Author name
- `-e, --email <email>` - Author email
- `-d, --description <text>` - Theme description
- `-l, --license <type>` - License type (default: MIT)
- `--no-git` - Skip git repository initialization
- `-t, --template <name>` - Template type: blank, minimal, or full (default: full)

**Templates:**
- `blank` - Empty theme with only manifest.json
- `minimal` - Basic structure with design tokens
- `full` - Complete theme with sample components and pages

**Examples:**

```bash
# Interactive mode
spwig init

# Quick start with options
spwig init my-store-theme \
  --author "Jane Developer" \
  --email "jane@example.com" \
  --description "A modern eCommerce theme" \
  --template full

# Minimal theme without git
spwig init simple-theme --template minimal --no-git
```

### `spwig validate [path]`

Validate theme or component package structure and configuration.

**Arguments:**
- `path` - Path to theme/component (default: current directory)

**Options:**
- `-t, --type <type>` - Package type: theme or component (auto-detected if not specified)
- `-v, --verbose` - Show detailed validation output

**What it validates:**
- ✅ Manifest schema compliance
- ✅ Required files presence
- ✅ Design tokens format
- ✅ Component structure
- ✅ Template syntax (basic checks)
- ✅ Asset references
- ✅ Locale files
- ✅ Version constraints

**Examples:**

```bash
# Validate current directory
spwig validate

# Validate specific theme with verbose output
spwig validate ./themes/boutique --verbose

# Validate a component
spwig validate ./components/hero --type component

# Use in CI/CD
spwig validate && npm run build
```

**Exit codes:**
- `0` - Validation passed
- `1` - Validation failed (errors found)
- `2` - Invalid arguments or runtime error

### `spwig package`

Create a distributable theme package ready for installation.

**Options:**
- `-o, --output <path>` - Output directory (default: dist)
- `-n, --name <filename>` - Custom package filename (without extension)
- `--no-validate` - Skip validation before packaging
- `-c, --checksum <algo>` - Checksum algorithm: sha256 or md5 (default: sha256)

**What it does:**
1. Validates theme (unless `--no-validate`)
2. Creates optimized .zip package
3. Generates checksum file
4. Includes only necessary files (excludes node_modules, .git, etc.)

**Examples:**

```bash
# Package to dist/
spwig package

# Custom output directory and name
spwig package --output ./releases --name my-theme-v1.2.0

# Skip validation (not recommended)
spwig package --no-validate

# Use MD5 checksum instead of SHA256
spwig package --checksum md5
```

**Output:**
```
dist/
├── my-theme-1.0.0.zip
└── my-theme-1.0.0.zip.sha256
```

### `spwig component add [type] [name]`

Add a new component to your theme.

**Arguments:**
- `type` - Component type (optional, will prompt if not provided)
- `name` - Component name (optional, will prompt if not provided)

**Component Types:**
- `header` - Site header and navigation
- `footer` - Site footer
- `section` - Content sections (hero, features, testimonials, etc.)
- `utility` - Utility components (cart icon, search bar, language switcher, etc.)

**Options:**
- `-d, --display-name <text>` - Human-readable display name
- `--description <text>` - Component description
- `--with-css` - Create styles.css file
- `--with-js` - Create script.js file
- `-t, --template <name>` - Template type: blank, basic, or advanced (default: basic)

**What it creates:**
- `manifest.json` - Component metadata
- `template.html` - Django/Jinja2 template
- `schema.json` - Component properties schema
- `styles.css` - Component styles (if --with-css)
- `script.js` - Component JavaScript (if --with-js)

**Examples:**

```bash
# Interactive mode
spwig component add

# Add hero section with CSS and JS
spwig component add section hero \
  --display-name "Hero Banner" \
  --description "Full-width hero section with CTA" \
  --with-css \
  --with-js

# Add utility component
spwig component add utility cart_icon \
  --template blank
```

## Programmatic API

Use the CLI commands programmatically in your Node.js applications:

```typescript
import {
  initCommand,
  validateCommand,
  packageCommand,
  componentCommand,
  type InitOptions,
  type ValidateOptions,
  type PackageOptions,
  type ComponentOptions
} from '@spwig/theme-cli';

// Create a theme
await initCommand('my-theme', {
  author: 'John Doe',
  email: 'john@example.com',
  description: 'A beautiful theme',
  license: 'MIT',
  git: true,
  template: 'full'
});

// Validate with options
const exitCode = await validateCommand('./my-theme', {
  verbose: true
});

if (exitCode === 0) {
  console.log('Validation passed!');
}

// Package theme
await packageCommand('./my-theme', {
  output: './dist',
  name: 'my-theme-v1',
  validate: true,
  checksum: 'sha256'
});

// Add component
await componentCommand('section', 'hero', {
  displayName: 'Hero Section',
  description: 'Main hero banner',
  withCss: true,
  withJs: false,
  template: 'basic'
});
```

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## Related Packages

- [@spwig/theme-validator](../validator) - Standalone validation library

## License

Apache License 2.0 - see [LICENSE](../../LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/spwig/theme-sdk/issues)
