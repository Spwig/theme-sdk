/**
 * Validation utilities for theme names, versions, etc.
 */

/**
 * Validate theme name (lowercase, hyphens, alphanumeric)
 */
export function isValidThemeName(name: string): boolean {
  const pattern = /^[a-z][a-z0-9-]*$/;
  return pattern.test(name) && name.length >= 2 && name.length <= 50;
}

/**
 * Validate component name (lowercase, underscores/hyphens, alphanumeric)
 */
export function isValidComponentName(name: string): boolean {
  const pattern = /^[a-z][a-z0-9_-]*$/;
  return pattern.test(name) && name.length >= 2 && name.length <= 50;
}

/**
 * Validate semantic version (x.y.z)
 */
export function isValidVersion(version: string): boolean {
  const pattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
  return pattern.test(version);
}

/**
 * Convert string to kebab-case (for theme names)
 */
export function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Convert string to snake_case (for component names)
 */
export function toSnakeCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Convert kebab-case or snake_case to Title Case
 */
export function toTitleCase(str: string): string {
  return str
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Get error message for invalid theme name
 */
export function getThemeNameError(name: string): string | null {
  if (name.length < 2) {
    return 'Theme name must be at least 2 characters';
  }
  if (name.length > 50) {
    return 'Theme name must be at most 50 characters';
  }
  if (!/^[a-z]/.test(name)) {
    return 'Theme name must start with a lowercase letter';
  }
  if (!/^[a-z][a-z0-9-]*$/.test(name)) {
    return 'Theme name can only contain lowercase letters, numbers, and hyphens';
  }
  return null;
}

/**
 * Get error message for invalid component name
 */
export function getComponentNameError(name: string): string | null {
  if (name.length < 2) {
    return 'Component name must be at least 2 characters';
  }
  if (name.length > 50) {
    return 'Component name must be at most 50 characters';
  }
  if (!/^[a-z]/.test(name)) {
    return 'Component name must start with a lowercase letter';
  }
  if (!/^[a-z][a-z0-9_-]*$/.test(name)) {
    return 'Component name can only contain lowercase letters, numbers, underscores, and hyphens';
  }
  return null;
}
