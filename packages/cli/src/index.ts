/**
 * Programmatic API for Spwig Theme CLI
 * Allows using CLI functionality from Node.js code
 */

export { initCommand } from './commands/init.js';
export { validateCommand } from './commands/validate.js';
export { packageCommand } from './commands/package.js';

// Re-export types
export type { InitOptions } from './commands/init.js';
export type { ValidateOptions } from './commands/validate.js';
export type { PackageOptions } from './commands/package.js';
