/**
 * Design Tokens Validator
 * Validates design token files (colors, typography, spacing, etc.)
 */

import fs from 'fs-extra';
import {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  createError,
  createWarning,
} from '../types/validation-result.js';
import { DesignTokens } from '../types/manifest.js';

export class DesignTokensValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  /**
   * Validate a design tokens file
   */
  async validate(tokensPath: string): Promise<ValidationResult> {
    this.errors = [];
    this.warnings = [];

    // Check file exists
    if (!(await this.fileExists(tokensPath))) {
      this.errors.push(
        createError('file_not_found', `Design tokens file does not exist: ${tokensPath}`)
      );
      return this.buildResult();
    }

    // Load and parse JSON
    const tokens = await this.loadTokens(tokensPath);
    if (!tokens) {
      return this.buildResult();
    }

    // Validate token structure
    this.validateTokenStructure(tokens, tokensPath);

    // Validate colors
    if (tokens.colors) {
      this.validateColors(tokens.colors, tokensPath);
    }

    // Validate typography
    if (tokens.typography) {
      this.validateTypography(tokens.typography, tokensPath);
    }

    // Validate spacing
    if (tokens.spacing) {
      this.validateSpacing(tokens.spacing, tokensPath);
    }

    // Validate menu tokens
    if (tokens.menu) {
      this.validateMenu(tokens.menu, tokensPath);
    }

    // Check for recommended properties
    this.checkRecommendedProperties(tokens, tokensPath);

    return this.buildResult();
  }

  /**
   * Check file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  /**
   * Load and parse tokens file
   */
  private async loadTokens(tokensPath: string): Promise<DesignTokens | null> {
    try {
      const content = await fs.readFile(tokensPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.errors.push(
          createError('json_parse_error', `Invalid JSON in design tokens: ${error.message}`, {
            path: tokensPath,
          })
        );
      } else if (error instanceof Error) {
        this.errors.push(
          createError('read_error', `Failed to read design tokens: ${error.message}`, {
            path: tokensPath,
          })
        );
      }
      return null;
    }
  }

  /**
   * Validate overall token structure
   */
  private validateTokenStructure(tokens: DesignTokens, tokensPath: string): void {
    if (typeof tokens !== 'object' || tokens === null) {
      this.errors.push(
        createError('invalid_structure', 'Design tokens must be an object', {
          path: tokensPath,
        })
      );
      return;
    }

    // Check that it's not empty
    if (Object.keys(tokens).length === 0) {
      this.errors.push(
        createError('empty_tokens', 'Design tokens file is empty', {
          path: tokensPath,
        })
      );
    }
  }

  /**
   * Validate color tokens
   */
  private validateColors(colors: Record<string, string>, tokensPath: string): void {
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    const rgbaPattern = /^rgba?\(/;
    const hslPattern = /^hsla?\(/;

    for (const [name, value] of Object.entries(colors)) {
      if (typeof value !== 'string') {
        this.errors.push(
          createError('invalid_color', `Color "${name}" must be a string`, {
            path: tokensPath,
          })
        );
        continue;
      }

      // Check if it's a valid color format
      if (!hexPattern.test(value) && !rgbaPattern.test(value) && !hslPattern.test(value)) {
        this.warnings.push(
          createWarning(
            'color_format',
            `Color "${name}" may not be in a valid format: ${value}`,
            {
              path: tokensPath,
              suggestion: 'Use hex (#RRGGBB), rgb(), rgba(), hsl(), or hsla() format',
            }
          )
        );
      }
    }

    // Check for recommended color tokens
    const recommendedColors = ['primary', 'secondary', 'background', 'text', 'border'];
    const missingColors = recommendedColors.filter((color) => !(color in colors));

    if (missingColors.length > 0) {
      this.warnings.push(
        createWarning(
          'missing_recommended',
          `Missing recommended color tokens: ${missingColors.join(', ')}`,
          {
            path: tokensPath,
            suggestion: 'Add these colors for better theme consistency',
          }
        )
      );
    }
  }

  /**
   * Validate typography tokens
   */
  private validateTypography(typography: Record<string, any>, tokensPath: string): void {
    for (const [name, value] of Object.entries(typography)) {
      if (typeof value !== 'object' || value === null) {
        this.warnings.push(
          createWarning('invalid_typography', `Typography "${name}" should be an object`, {
            path: tokensPath,
          })
        );
        continue;
      }

      // Check for recommended properties
      const recommendedProps = ['fontSize', 'lineHeight', 'fontWeight'];
      const hasProps = recommendedProps.some((prop) => prop in value);

      if (!hasProps) {
        this.warnings.push(
          createWarning(
            'incomplete_typography',
            `Typography "${name}" is missing recommended properties`,
            {
              path: tokensPath,
              suggestion: 'Add fontSize, lineHeight, and/or fontWeight',
            }
          )
        );
      }
    }
  }

  /**
   * Validate spacing tokens
   */
  private validateSpacing(spacing: Record<string, string>, tokensPath: string): void {
    const validUnits = ['px', 'rem', 'em', '%', 'vh', 'vw'];

    for (const [name, value] of Object.entries(spacing)) {
      if (typeof value !== 'string') {
        this.errors.push(
          createError('invalid_spacing', `Spacing "${name}" must be a string`, {
            path: tokensPath,
          })
        );
        continue;
      }

      // Check if value has a valid unit
      const hasValidUnit = validUnits.some((unit) => value.endsWith(unit));

      if (!hasValidUnit && value !== '0') {
        this.warnings.push(
          createWarning('spacing_unit', `Spacing "${name}" may be missing a unit: ${value}`, {
            path: tokensPath,
            suggestion: `Add a unit like px, rem, or em`,
          })
        );
      }
    }
  }

  /**
   * Validate menu tokens
   */
  private validateMenu(menu: Record<string, string>, tokensPath: string): void {
    // Check for recommended menu tokens
    const recommendedMenuTokens = [
      'text-color',
      'text-hover-color',
      'background-hover',
      'dropdown-background',
      'item-gap',
      'link-padding-x',
      'link-padding-y',
      'font-size',
      'border-radius',
      'animation-duration',
    ];

    const missingTokens = recommendedMenuTokens.filter((token) => !(token in menu));

    if (missingTokens.length > 0) {
      this.warnings.push(
        createWarning(
          'incomplete_menu_tokens',
          `Missing recommended menu tokens: ${missingTokens.slice(0, 5).join(', ')}${missingTokens.length > 5 ? '...' : ''}`,
          {
            path: tokensPath,
            suggestion: 'Add these menu tokens for complete navigation styling',
          }
        )
      );
    }

    // Validate each menu token value
    for (const [name, value] of Object.entries(menu)) {
      if (typeof value !== 'string') {
        this.errors.push(
          createError('invalid_menu_token', `Menu token "${name}" must be a string`, {
            path: tokensPath,
          })
        );
      }
    }
  }

  /**
   * Check for recommended properties
   */
  private checkRecommendedProperties(tokens: DesignTokens, tokensPath: string): void {
    const recommended = ['colors', 'typography', 'spacing'];
    const missing = recommended.filter((prop) => !(prop in tokens));

    if (missing.length > 0) {
      this.warnings.push(
        createWarning(
          'missing_sections',
          `Missing recommended design token sections: ${missing.join(', ')}`,
          {
            path: tokensPath,
            suggestion: 'Add these sections for a complete design system',
          }
        )
      );
    }

    // Suggest adding breakpoints for responsive design
    if (!tokens.breakpoints) {
      this.warnings.push(
        createWarning('missing_breakpoints', 'No breakpoints defined', {
          path: tokensPath,
          suggestion: 'Add breakpoints for responsive design (mobile, tablet, desktop)',
        })
      );
    }
  }

  /**
   * Build validation result
   */
  private buildResult(): ValidationResult {
    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }
}
