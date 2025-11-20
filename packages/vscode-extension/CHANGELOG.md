# Change Log

All notable changes to the "Spwig Theme Development" extension will be documented in this file.

## [1.1.1] - 2024-11-20

### Fixed
- Corrected documentation URL to community.spwig.com
- Updated README with detailed CLI installation instructions

## [1.1.0] - 2024-11-20

### Added
- Bundled theme validator for standalone validation (no CLI required)
- Rich validation output with formatted report
- VS Code diagnostics integration for validation errors/warnings
- Progress indicator during validation

### Changed
- Validate command now runs directly without requiring Spwig CLI installation

## [1.0.0] - 2024-11-20

### Added
- Initial release
- Theme Explorer sidebar with tree view
- Create new theme command
- Validate theme command with diagnostics
- Package theme command
- Dev server integration (start/stop)
- Add component command with templates
- Open documentation command
- JSON schema validation for:
  - Theme manifest
  - Component manifest
  - Design tokens
  - Page definitions
  - Component settings
- Code snippets for:
  - Manifest files
  - Settings definitions
  - Design tokens
  - Jinja2 templates
- Jinja2 syntax highlighting for HTML files
- Keyboard shortcuts for common commands
- Configuration options for dev server and auto-validation
