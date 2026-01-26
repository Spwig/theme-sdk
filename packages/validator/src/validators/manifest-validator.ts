/**
 * Manifest Validator
 * Validates JSON manifests against schemas using Ajv
 */

import Ajv, { ErrorObject } from 'ajv';
import addErrors from 'ajv-errors';
import fs from 'fs-extra';
import path from 'path';
import {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  createError,
} from '../types/validation-result.js';

export class ManifestValidator {
  private ajv: Ajv;
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false,
    });
    addErrors(this.ajv);
  }

  /**
   * Load a JSON schema from file
   */
  protected async loadSchema(schemaPath: string): Promise<any> {
    try {
      const schemaContent = await fs.readFile(schemaPath, 'utf-8');
      return JSON.parse(schemaContent);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load schema from ${schemaPath}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Load a JSON file
   */
  protected async loadJSON<T = any>(filePath: string): Promise<T> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.errors.push(
          createError('json_parse_error', `Invalid JSON in ${path.basename(filePath)}: ${error.message}`, {
            path: filePath,
          })
        );
      } else if (error instanceof Error) {
        this.errors.push(
          createError('file_error', `Failed to read ${path.basename(filePath)}: ${error.message}`, {
            path: filePath,
          })
        );
      }
      throw error;
    }
  }

  /**
   * Validate manifest against schema
   */
  protected validateAgainstSchema(
    manifest: any,
    schema: any,
    manifestType: string = 'manifest'
  ): boolean {
    const validate = this.ajv.compile(schema);
    const valid = validate(manifest);

    if (!valid && validate.errors) {
      for (const error of validate.errors) {
        this.errors.push(this.convertAjvError(error, manifestType));
      }
    }

    return valid;
  }

  /**
   * Convert Ajv error to ValidationError
   */
  private convertAjvError(error: ErrorObject, manifestType: string): ValidationError {
    const dataPath = error.instancePath || error.schemaPath;
    let message = error.message || 'Validation error';

    // Make error message more readable
    if (error.keyword === 'required') {
      const missingProp = (error.params as any).missingProperty;
      message = `Missing required property: ${missingProp}`;
    } else if (error.keyword === 'pattern') {
      message = `${dataPath} ${message}`;
    } else if (error.keyword === 'enum') {
      const allowedValues = (error.params as any).allowedValues;
      message = `${dataPath} must be one of: ${allowedValues.join(', ')}`;
    } else if (dataPath) {
      message = `${dataPath}: ${message}`;
    }

    return createError('schema_validation', message, {
      path: dataPath,
    });
  }

  /**
   * Reset errors and warnings
   */
  protected reset(): void {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Get current errors
   */
  protected getErrors(): ValidationError[] {
    return this.errors;
  }

  /**
   * Get current warnings
   */
  protected getWarnings(): ValidationWarning[] {
    return this.warnings;
  }

  /**
   * Add an error
   */
  protected addError(error: ValidationError): void {
    this.errors.push(error);
  }

  /**
   * Add a warning
   */
  protected addWarning(warning: ValidationWarning): void {
    this.warnings.push(warning);
  }

  /**
   * Check if file exists
   */
  protected async fileExists(filePath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      return stats.isFile();
    } catch {
      return false;
    }
  }

  /**
   * Check if directory exists
   */
  protected async directoryExists(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  }

  /**
   * Compare semantic versions
   * @returns -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  protected compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;

      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }

    return 0;
  }

  /**
   * Validate file is not empty
   */
  protected async validateFileNotEmpty(filePath: string, fileType: string): Promise<boolean> {
    try {
      const stats = await fs.stat(filePath);
      if (stats.size === 0) {
        this.addError(
          createError('empty_file', `${fileType} file is empty`, {
            path: filePath,
          })
        );
        return false;
      }
      return true;
    } catch (error) {
      this.addError(
        createError('file_error', `Failed to check ${fileType} file size`, {
          path: filePath,
        })
      );
      return false;
    }
  }

  /**
   * Validate file is valid UTF-8
   */
  protected async validateUTF8(filePath: string, fileType: string): Promise<boolean> {
    try {
      await fs.readFile(filePath, 'utf-8');
      return true;
    } catch (error) {
      this.addError(
        createError('encoding_error', `${fileType} file is not valid UTF-8`, {
          path: filePath,
        })
      );
      return false;
    }
  }
}
