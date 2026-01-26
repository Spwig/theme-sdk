/**
 * Validation result types
 */

export interface ValidationError {
  /** Error type/category */
  type: string;
  /** Error message */
  message: string;
  /** File path where error occurred */
  path?: string;
  /** Line number (for template/JSON errors) */
  line?: number;
  /** Whether this error can be auto-fixed */
  fixable: boolean;
}

export interface ValidationWarning {
  /** Warning type/category */
  type: string;
  /** Warning message */
  message: string;
  /** File path where warning occurred */
  path?: string;
  /** Suggestion for fixing */
  suggestion?: string;
  /** Whether this warning can be auto-fixed */
  fixable: boolean;
}

export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** List of validation errors */
  errors: ValidationError[];
  /** List of validation warnings */
  warnings: ValidationWarning[];
  /** Theme or component info (if valid) */
  themeInfo?: any;
  /** Component info (for component validation) */
  componentInfo?: any;
}

/**
 * Helper to create validation error
 */
export function createError(
  type: string,
  message: string,
  options: Partial<Omit<ValidationError, 'type' | 'message'>> = {}
): ValidationError {
  return {
    type,
    message,
    fixable: false,
    ...options,
  };
}

/**
 * Helper to create validation warning
 */
export function createWarning(
  type: string,
  message: string,
  options: Partial<Omit<ValidationWarning, 'type' | 'message'>> = {}
): ValidationWarning {
  return {
    type,
    message,
    fixable: false,
    ...options,
  };
}
