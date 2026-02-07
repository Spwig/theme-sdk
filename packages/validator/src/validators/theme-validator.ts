/**
 * Theme Validator
 * Validates Spwig v2.0 theme packages (tokens-focused)
 */

import path from 'path';
import fs from 'fs-extra';
import { ManifestValidator } from './manifest-validator.js';
import { DesignTokensValidator } from './design-tokens-validator.js';
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

    // 4. Validate tokens.json (required — the primary deliverable)
    await this.validateTokensFile();

    // 5. Validate overrides.css (if exists)
    await this.validateOverrides();

    // 6. Validate presets (if exists — Tier 2)
    await this.validatePresets();

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
   * Validate tokens.json file exists and is valid
   */
  private async validateTokensFile(): Promise<void> {
    const tokensPath = path.join(this.themeDir, 'tokens.json');

    if (!(await this.fileExists(tokensPath))) {
      this.addError(
        createError('missing_tokens', 'Required file missing: tokens.json — this is the primary theme deliverable')
      );
      return;
    }

    // Use the DesignTokensValidator for detailed validation
    const tokensValidator = new DesignTokensValidator();
    const result = await tokensValidator.validate(tokensPath);

    // Forward errors and warnings
    for (const error of result.errors) {
      this.addError(error);
    }
    for (const warning of result.warnings) {
      this.addWarning(warning);
    }
  }

  /**
   * Validate overrides.css if present
   */
  private async validateOverrides(): Promise<void> {
    const overridesPath = path.join(this.themeDir, 'overrides.css');

    if (!(await this.fileExists(overridesPath))) {
      return; // Optional file, no error
    }

    // Check it's valid UTF-8 and not empty
    try {
      const content = await fs.readFile(overridesPath, 'utf-8');
      if (content.trim().length === 0) {
        this.addWarning(
          createWarning('empty_overrides', 'overrides.css is empty — you can remove it if not needed')
        );
      }

      // Check file size (max 1MB for CSS)
      const stats = await fs.stat(overridesPath);
      if (stats.size > 1024 * 1024) {
        this.addWarning(
          createWarning('large_overrides', 'overrides.css is larger than 1MB', {
            suggestion: 'Consider moving styles into tokens.json values where possible',
          })
        );
      }
    } catch (error) {
      this.addError(
        createError('invalid_overrides', `Failed to read overrides.css: ${error instanceof Error ? error.message : error}`)
      );
    }
  }

  /**
   * Validate preset files (Tier 2 themes)
   */
  private async validatePresets(): Promise<void> {
    const presetsDir = path.join(this.themeDir, 'presets');

    if (!(await this.directoryExists(presetsDir))) {
      return; // Tier 1 theme, no presets
    }

    // Validate header presets
    const headersDir = path.join(presetsDir, 'headers');
    if (await this.directoryExists(headersDir)) {
      await this.validatePresetDir(headersDir, 'header');
    }

    // Validate footer presets
    const footersDir = path.join(presetsDir, 'footers');
    if (await this.directoryExists(footersDir)) {
      await this.validatePresetDir(footersDir, 'footer');
    }
  }

  /**
   * Validate a directory of preset JSON files
   */
  private async validatePresetDir(dir: string, type: 'header' | 'footer'): Promise<void> {
    const files = await fs.readdir(dir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    if (jsonFiles.length === 0) {
      this.addWarning(
        createWarning(`empty_${type}_presets`, `${type} presets directory exists but contains no JSON files`)
      );
      return;
    }

    for (const file of jsonFiles) {
      const filePath = path.join(dir, file);

      try {
        const preset = await fs.readJSON(filePath);

        // Validate required preset fields
        if (!preset.name || typeof preset.name !== 'string') {
          this.addError(
            createError('invalid_preset', `${type} preset "${file}" is missing required "name" field`)
          );
        }

        if (!preset.layout_type || typeof preset.layout_type !== 'string') {
          this.addError(
            createError('invalid_preset', `${type} preset "${file}" is missing required "layout_type" field`)
          );
        }

        if (!preset.widget_placements || !Array.isArray(preset.widget_placements)) {
          this.addError(
            createError('invalid_preset', `${type} preset "${file}" is missing required "widget_placements" array`)
          );
        } else {
          // Validate each widget placement
          for (const placement of preset.widget_placements) {
            if (!placement.widget_type || typeof placement.widget_type !== 'string') {
              this.addError(
                createError('invalid_preset', `${type} preset "${file}" has a placement missing "widget_type"`)
              );
            }
            if (!placement.zone || typeof placement.zone !== 'string') {
              this.addError(
                createError('invalid_preset', `${type} preset "${file}" has a placement missing "zone"`)
              );
            }
          }
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          this.addError(
            createError('json_parse_error', `Invalid JSON in ${type} preset "${file}": ${error.message}`)
          );
        } else {
          this.addError(
            createError('read_error', `Failed to read ${type} preset "${file}": ${error instanceof Error ? error.message : error}`)
          );
        }
      }
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

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
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
      const maxSize = 5 * 1024 * 1024;
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
      if (this.manifest.sdk_version) {
        lines.push(`SDK Version: ${this.manifest.sdk_version}`);
      }
      lines.push('');
    }

    const errors = this.getErrors();
    if (errors.length > 0) {
      lines.push(`ERRORS (${errors.length}):`);
      for (const error of errors) {
        lines.push(`  - ${error.message}`);
      }
      lines.push('');
    }

    const warnings = this.getWarnings();
    if (warnings.length > 0) {
      lines.push(`WARNINGS (${warnings.length}):`);
      for (const warning of warnings) {
        lines.push(`  - ${warning.message}`);
        if (warning.suggestion) {
          lines.push(`    Suggestion: ${warning.suggestion}`);
        }
      }
      lines.push('');
    }

    if (errors.length === 0 && warnings.length === 0) {
      lines.push('Validation passed with no errors or warnings');
    }

    return lines.join('\n');
  }
}
