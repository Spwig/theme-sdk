/**
 * Theme Validator
 * Validates theme packages with bundled components
 */

import path from 'path';
import fs from 'fs-extra';
import { ManifestValidator } from './manifest-validator.js';
import { ComponentValidator } from './component-validator.js';
import {
  ValidationResult,
  createError,
  createWarning,
} from '../types/validation-result.js';
import { ThemeManifest } from '../types/manifest.js';

export class ThemeValidator extends ManifestValidator {
  private themeDir: string;
  private manifest: ThemeManifest | null = null;

  constructor(themeDir: string) {
    super();
    this.themeDir = path.resolve(themeDir);
  }

  /**
   * Validate complete theme package
   */
  async validate(): Promise<ValidationResult> {
    this.reset();

    // 1. Check directory exists
    if (!(await this.directoryExists(this.themeDir))) {
      this.addError(
        createError('directory_not_found', `Theme directory does not exist: ${this.themeDir}`)
      );
      return this.buildResult();
    }

    // 2. Check required files
    const manifestPath = path.join(this.themeDir, 'manifest.json');
    if (!(await this.fileExists(manifestPath))) {
      this.addError(createError('missing_file', 'Required file missing: manifest.json'));
      return this.buildResult();
    }

    // 3. Load and validate manifest
    try {
      this.manifest = await this.loadJSON<ThemeManifest>(manifestPath);
    } catch {
      return this.buildResult();
    }

    // Load theme manifest schema
    const schemaPath = path.join(__dirname, '../../schemas/theme_manifest_schema.json');
    const schema = await this.loadSchema(schemaPath);

    if (!this.validateAgainstSchema(this.manifest, schema, 'theme manifest')) {
      return this.buildResult();
    }

    // 4. Validate bundled components (if any)
    if (this.manifest.bundled_components && this.manifest.bundled_components.length > 0) {
      await this.validateBundledComponents();
    }

    // 5. Validate page schemas (if declared)
    if (this.manifest.page_schemas) {
      await this.validatePageSchemas();
    }

    // 6. Validate design tokens (if declared)
    if (this.manifest.design_tokens) {
      await this.validateDesignTokens();
    }

    // 7. Validate preview image (if declared)
    if (this.manifest.preview_image) {
      await this.validatePreviewImage();
    }

    // 8. Validate screenshots (if declared)
    if (this.manifest.screenshots && this.manifest.screenshots.length > 0) {
      await this.validateScreenshots();
    }

    return this.buildResult();
  }

  /**
   * Validate all bundled components
   */
  private async validateBundledComponents(): Promise<void> {
    if (!this.manifest?.bundled_components) return;

    for (const componentRef of this.manifest.bundled_components) {
      const componentPath = path.join(this.themeDir, componentRef.path);

      if (!(await this.directoryExists(componentPath))) {
        this.addError(
          createError('missing_component', `Bundled component not found: ${componentRef.path}`)
        );
        continue;
      }

      // Validate component using ComponentValidator
      const componentValidator = new ComponentValidator(componentPath);
      const result = await componentValidator.validate();

      if (!result.isValid) {
        this.addError(
          createError('component_validation_failed', `Component validation failed for ${componentRef.name}:`)
        );

        // Add component errors as sub-errors
        for (const error of result.errors) {
          this.addError({
            ...error,
            message: `  - ${error.message}`,
          });
        }
      }

      // Add component warnings
      for (const warning of result.warnings) {
        this.addWarning({
          ...warning,
          message: `[${componentRef.name}] ${warning.message}`,
        });
      }
    }
  }

  /**
   * Validate page schema files exist
   */
  private async validatePageSchemas(): Promise<void> {
    if (!this.manifest?.page_schemas) return;

    for (const [pageType, schemaPath] of Object.entries(this.manifest.page_schemas)) {
      if (!schemaPath) continue;

      const fullPath = path.join(this.themeDir, schemaPath);

      if (!(await this.fileExists(fullPath))) {
        this.addError(
          createError('missing_schema', `Page schema not found: ${schemaPath} (for ${pageType})`)
        );
        continue;
      }

      // Validate it's valid JSON
      try {
        await this.loadJSON(fullPath);
      } catch {
        // Error already added by loadJSON
      }
    }
  }

  /**
   * Validate design tokens file exists and is valid JSON
   */
  private async validateDesignTokens(): Promise<void> {
    if (!this.manifest?.design_tokens) return;

    const tokensPath = path.join(this.themeDir, this.manifest.design_tokens);

    if (!(await this.fileExists(tokensPath))) {
      this.addError(
        createError('missing_tokens', `Design tokens file not found: ${this.manifest.design_tokens}`)
      );
      return;
    }

    // Validate it's valid JSON
    try {
      const tokens = await this.loadJSON(tokensPath);

      // Basic validation - check for expected properties
      if (!tokens.colors && !tokens.typography && !tokens.spacing) {
        this.addWarning(
          createWarning(
            'incomplete_tokens',
            'Design tokens file is missing common properties (colors, typography, spacing)',
            {
              suggestion: 'Add at least colors, typography, and spacing definitions',
            }
          )
        );
      }
    } catch {
      // Error already added by loadJSON
    }
  }

  /**
   * Validate preview image exists
   */
  private async validatePreviewImage(): Promise<void> {
    if (!this.manifest?.preview_image) return;

    const previewPath = path.join(this.themeDir, this.manifest.preview_image);

    if (!(await this.fileExists(previewPath))) {
      this.addError(
        createError('missing_preview', `Preview image not found: ${this.manifest.preview_image}`)
      );
      return;
    }

    // Check file size (max 5MB like component previews)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    const stats = await fs.stat(previewPath);

    if (stats.size > maxSize) {
      this.addError(
        createError(
          'file_too_large',
          `Preview image too large (max 5MB): ${this.manifest.preview_image}`
        )
      );
    }
  }

  /**
   * Validate screenshot files exist
   */
  private async validateScreenshots(): Promise<void> {
    if (!this.manifest?.screenshots) return;

    for (const screenshot of this.manifest.screenshots) {
      const screenshotPath = path.join(this.themeDir, screenshot);

      if (!(await this.fileExists(screenshotPath))) {
        this.addError(createError('missing_screenshot', `Screenshot not found: ${screenshot}`));
        continue;
      }

      // Check file size (max 5MB each)
      const maxSize = 5 * 1024 * 1024; // 5 MB
      const stats = await fs.stat(screenshotPath);

      if (stats.size > maxSize) {
        this.addWarning(
          createWarning('large_screenshot', `Screenshot is large (>5MB): ${screenshot}`, {
            suggestion: 'Consider optimizing the screenshot to reduce file size',
          })
        );
      }
    }
  }

  /**
   * Build validation result
   */
  private buildResult(): ValidationResult {
    return {
      isValid: this.getErrors().length === 0,
      errors: this.getErrors(),
      warnings: this.getWarnings(),
      themeInfo: this.manifest,
    };
  }

  /**
   * Generate human-readable validation report
   */
  getValidationReport(): string {
    const lines: string[] = [];

    if (this.manifest) {
      lines.push(`Theme: ${this.manifest.display_name || 'Unknown'}`);
      lines.push(`Name: ${this.manifest.name || 'Unknown'}`);
      lines.push(`Version: ${this.manifest.version || 'Unknown'}`);
      lines.push('');
    }

    const errors = this.getErrors();
    if (errors.length > 0) {
      lines.push(`❌ ERRORS (${errors.length}):`);
      for (const error of errors) {
        lines.push(`  - ${error.message}`);
      }
      lines.push('');
    }

    const warnings = this.getWarnings();
    if (warnings.length > 0) {
      lines.push(`⚠️  WARNINGS (${warnings.length}):`);
      for (const warning of warnings) {
        lines.push(`  - ${warning.message}`);
        if (warning.suggestion) {
          lines.push(`    Suggestion: ${warning.suggestion}`);
        }
      }
      lines.push('');
    }

    if (errors.length === 0 && warnings.length === 0) {
      lines.push('✅ Validation passed with no errors or warnings');
    }

    return lines.join('\n');
  }
}
