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

// Valid breakpoint names for responsive tokens
const VALID_BREAKPOINTS = ['mobile', 'tablet', 'desktop', 'sm', 'md', 'lg', 'xl', '2xl'];

// Recommended tokens for each element category
const ELEMENT_TOKEN_RECOMMENDATIONS: Record<string, string[]> = {
  hero: [
    'min-height',
    'padding-y',
    'padding-x',
    'title-size',
    'subtitle-size',
    'text-color',
    'overlay-color',
  ],
  button: [
    'radius',
    'padding-x-sm',
    'padding-y-sm',
    'padding-x-md',
    'padding-y-md',
    'padding-x-lg',
    'padding-y-lg',
    'font-weight',
  ],
  card: ['bg', 'border', 'radius', 'shadow', 'shadow-hover', 'padding'],
  divider: ['color', 'thickness', 'spacing'],
  form: [
    'input-bg',
    'input-border',
    'input-focus-border',
    'input-radius',
    'input-padding',
    'input-disabled-bg',
    'input-placeholder-color',
    'label-color',
    'label-size',
    'error-color',
    'help-color',
    'primary-color',
    'primary-hover',
    'success-color',
    'warning-color',
    'text-color',
    'text-muted',
    'bg-color',
    'bg-light',
    'border-color',
    'focus-shadow',
    'title-size',
    'heading-size',
    'base-size',
    'small-size',
    'tiny-size',
    'font-weight-bold',
    'font-weight-medium',
    'line-height-relaxed',
    'spacing-lg',
    'spacing-md',
    'spacing-sm',
    'spacing-xs',
    'container-max-width',
    'container-padding',
    'shadow',
    'transition',
    'button-padding-x',
    'button-padding-y',
    'button-radius',
    'checkbox-size',
    'checkbox-radius',
    'radio-size',
    'star-empty-color',
    'star-filled-color',
    'nps-button-height',
    'likert-min-width',
    'progress-height',
    'step-circle-size',
    'step-circle-size-mobile',
  ],
  accordion: ['header-bg', 'header-hover-bg', 'border', 'content-bg', 'padding'],
  modal: ['backdrop-color', 'bg', 'radius', 'shadow', 'padding', 'max-width'],
  countdown: ['number-size', 'number-color', 'label-size', 'label-color', 'bg'],
  testimonial: ['bg', 'border', 'quote-color', 'author-color', 'radius'],
  blog: ['card-radius', 'card-shadow', 'meta-color', 'title-color'],
  product: ['card-radius', 'card-shadow', 'card-shadow-hover', 'price-color', 'grid-gap'],
  voucher: ['code-bg', 'code-border', 'code-font', 'code-color'],
  heading: ['h1-size', 'h2-size', 'h3-size', 'color', 'line-height'],
  image: ['radius', 'shadow'],
  gallery: ['gap', 'radius'],
};

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

    // Validate element tokens
    if (tokens.elements) {
      this.validateElements(tokens.elements, tokensPath);
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
  private validateMenu(menu: Record<string, string | Record<string, string>>, tokensPath: string): void {
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

    // Validate each menu token value (supports both flat and responsive values)
    for (const [name, value] of Object.entries(menu)) {
      this.validateTokenValue(name, value, 'menu', tokensPath);
    }
  }

  /**
   * Validate element tokens
   */
  private validateElements(
    elements: Record<string, Record<string, string> | undefined>,
    tokensPath: string
  ): void {
    for (const [category, categoryTokens] of Object.entries(elements)) {
      if (!categoryTokens) continue;

      // Check if it's a known element category
      const isKnownCategory = category in ELEMENT_TOKEN_RECOMMENDATIONS;

      if (!isKnownCategory) {
        this.warnings.push(
          createWarning(
            'unknown_element_category',
            `Unknown element category: "${category}". This may be intentional for custom elements.`,
            {
              path: tokensPath,
              suggestion: `Known categories: ${Object.keys(ELEMENT_TOKEN_RECOMMENDATIONS).join(', ')}`,
            }
          )
        );
      }

      // Validate each token value in the category
      for (const [tokenName, tokenValue] of Object.entries(categoryTokens)) {
        this.validateTokenValue(tokenName, tokenValue, `elements.${category}`, tokensPath);
      }

      // Check for recommended tokens in known categories
      if (isKnownCategory) {
        const recommended = ELEMENT_TOKEN_RECOMMENDATIONS[category];
        const missing = recommended.filter((token) => !(token in categoryTokens));

        if (missing.length > 0 && missing.length < recommended.length) {
          // Only warn if they have some tokens but are missing others
          this.warnings.push(
            createWarning(
              'incomplete_element_tokens',
              `Element "${category}" is missing some recommended tokens: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '...' : ''}`,
              {
                path: tokensPath,
                suggestion: 'Add these tokens for complete element styling',
              }
            )
          );
        }
      }
    }
  }

  /**
   * Validate a token value that may be flat or responsive
   * @param name - Token name
   * @param value - Token value (string or breakpoint object)
   * @param category - Token category (e.g., 'menu', 'typography')
   * @param tokensPath - Path to tokens file for error reporting
   */
  private validateTokenValue(
    name: string,
    value: string | Record<string, string>,
    category: string,
    tokensPath: string
  ): void {
    // Flat value (string) - check for --theme- prefix in var() references
    if (typeof value === 'string') {
      // Check for var() references without --theme- prefix
      if (value.includes('var(--') && !value.includes('var(--theme-')) {
        this.warnings.push(
          createWarning(
            'missing_theme_prefix',
            `${category} token "${name}" uses var() without --theme- prefix: ${value}`,
            {
              path: tokensPath,
              suggestion: 'Use --theme- prefix for all theme variables (e.g., var(--theme-color-primary))',
            }
          )
        );
      }
      return;
    }

    // Responsive value (object with breakpoint keys)
    if (typeof value === 'object' && value !== null) {
      const keys = Object.keys(value);

      // Must have at least one breakpoint
      if (keys.length === 0) {
        this.errors.push(
          createError(
            'empty_responsive_token',
            `${category} token "${name}" is an empty object. Provide at least one breakpoint value.`,
            { path: tokensPath }
          )
        );
        return;
      }

      // Validate breakpoint names
      for (const breakpoint of keys) {
        if (!VALID_BREAKPOINTS.includes(breakpoint)) {
          this.errors.push(
            createError(
              'invalid_breakpoint',
              `${category} token "${name}" has invalid breakpoint "${breakpoint}". Valid breakpoints: ${VALID_BREAKPOINTS.join(', ')}`,
              { path: tokensPath }
            )
          );
        }

        // Validate that breakpoint value is a string
        const breakpointValue = value[breakpoint];
        if (typeof breakpointValue !== 'string') {
          this.errors.push(
            createError(
              'invalid_breakpoint_value',
              `${category} token "${name}.${breakpoint}" must be a string, got ${typeof breakpointValue}`,
              { path: tokensPath }
            )
          );
        } else if (breakpointValue.includes('var(--') && !breakpointValue.includes('var(--theme-')) {
          // Check for var() references without --theme- prefix in responsive values
          this.warnings.push(
            createWarning(
              'missing_theme_prefix',
              `${category} token "${name}.${breakpoint}" uses var() without --theme- prefix: ${breakpointValue}`,
              {
                path: tokensPath,
                suggestion: 'Use --theme- prefix for all theme variables (e.g., var(--theme-color-primary))',
              }
            )
          );
        }
      }

      return;
    }

    // Invalid type
    this.errors.push(
      createError(
        'invalid_token_type',
        `${category} token "${name}" must be a string or responsive object, got ${typeof value}`,
        { path: tokensPath }
      )
    );
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
