# Changelog

All notable changes to @spwig/theme-cli will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
