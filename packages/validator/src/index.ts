/**
 * Spwig Theme Validator
 * Standalone validation library for Spwig themes
 */

// Export validators
export { ThemeValidator } from './validators/theme-validator.js';
export { ManifestValidator } from './validators/manifest-validator.js';
export { DesignTokensValidator } from './validators/design-tokens-validator.js';

// Export types
export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types/validation-result.js';

export type {
  ThemeManifest,
  DesignTokens,
} from './types/manifest.js';
