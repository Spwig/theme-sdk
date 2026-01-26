# Changelog

All notable changes to @spwig/theme-cli will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-26

### Changed
- **Design tokens documentation overhaul**
  - Token file renamed from `design_tokens.json` to `tokens.json`
  - Token naming convention standardized to kebab-case (hyphens, not underscores)
  - Added comprehensive documentation for all color variants

### Added
- **New token categories documented**
  - `z-index` tokens for consistent stacking (dropdown, sticky, fixed, modal, tooltip)
  - `container` tokens for layout (max-width, padding)
  - `letter-spacing` typography tokens
  - Per-heading typography tokens (font-family-h1 through h6, etc.)
  - Additional easing functions (easing-in, easing-out)
  - `2xl` breakpoint (1536px)

- **New color tokens documented**
  - `primary-hover`, `secondary-hover`, `accent-hover` for interaction states
  - `text-muted` for subdued text
  - `background-secondary`, `background-tertiary`, `background-alt`
  - `surface-secondary`, `surface-variant`, `surface-hover`, `surface-dark`
  - `header-bg`, `footer-bg` for layout areas
  - `shadow`, `overlay` utility colors

### Migration
- See DESIGN_TOKENS.md "Migration from v1.0" section for upgrade instructions

## [1.1.0] - 2025-11-19

### Added
- **`spwig dev` command** - Development server with hot reload
  - Connect to a running Spwig shop for live theme development
  - Automatic file watching and synchronization
  - CSS-only hot reload for style changes
  - Full page reload for template/manifest changes
  - Basic auth with shop admin credentials
  - Auto-opens browser to preview URL
  - Clean disconnect on Ctrl+C

### Dependencies
- Added `chokidar` for file watching
- Added `open` for browser launching

## [1.0.0] - 2025-11-18

### Added
- Initial release
- **`spwig init`** - Create new theme with interactive prompts
  - Template options: full, minimal, blank
  - Git initialization support
- **`spwig validate`** - Validate theme or component structure
  - JSON schema validation for manifests
  - File structure verification
  - Asset size checks (5MB max for images)
- **`spwig package`** - Create distributable theme package
  - ZIP archive generation
  - SHA256 checksum calculation
  - Pre-packaging validation
- **`spwig component add`** - Add components to theme
  - Scaffold component files (manifest, template, schema, styles)
  - Auto-update theme manifest with new component
