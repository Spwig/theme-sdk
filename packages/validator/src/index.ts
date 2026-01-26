/**
 * Spwig Theme Validator
 * Standalone validation library for Spwig themes
 */

// Export validators
export { ThemeValidator } from './validators/theme-validator.js';
export { ComponentValidator } from './validators/component-validator.js';
export { ManifestValidator } from './validators/manifest-validator.js';
export { TemplateValidator } from './validators/template-validator.js';
export { DesignTokensValidator } from './validators/design-tokens-validator.js';

// Export types
export type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from './types/validation-result.js';

export type {
  ThemeManifest,
  ComponentManifest,
  PageSchema,
  DesignTokens,
  BundledComponentRef,
} from './types/manifest.js';
