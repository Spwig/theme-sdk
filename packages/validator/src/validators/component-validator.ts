/**
 * Component Validator
 * Validates component packages against manifest schema and file structure
 */

import path from 'path';
import fs from 'fs-extra';
import { ManifestValidator } from './manifest-validator.js';
import {
  ValidationResult,
  createError,
  createWarning,
} from '../types/validation-result.js';
import { ComponentManifest, ComponentDependency } from '../types/manifest.js';

export class ComponentValidator extends ManifestValidator {
  private componentDir: string;
  private manifest: ComponentManifest | null = null;

  private static readonly REQUIRED_FILES = [
    'manifest.json',
    'template.html',
    'schema.json',
  ];

  private static readonly OPTIONAL_FILES = [
    'preview.png',
    'preview.jpg',
    'preview.jpeg',
    'preview.webp',
  ];

  constructor(componentDir: string) {
    super();
    this.componentDir = path.resolve(componentDir);
  }

  /**
   * Validate complete component package
   */
  async validate(): Promise<ValidationResult> {
    this.reset();

    // 1. Check directory exists
    if (!(await this.directoryExists(this.componentDir))) {
      this.addError(
        createError('directory_not_found', `Component directory does not exist: ${this.componentDir}`)
      );
      return this.buildResult();
    }

    // 2. Check required files
    if (!(await this.validateRequiredFiles())) {
      return this.buildResult();
    }

    // 3. Load and validate manifest
    const manifestPath = path.join(this.componentDir, 'manifest.json');
    try {
      this.manifest = await this.loadJSON<ComponentManifest>(manifestPath);
    } catch {
      return this.buildResult();
    }

    // Load component manifest schema
    const schemaPath = path.join(__dirname, '../../schemas/component_manifest_schema.json');
    const schema = await this.loadSchema(schemaPath);

    if (!this.validateAgainstSchema(this.manifest, schema, 'component manifest')) {
      return this.buildResult();
    }

    // 4. Validate template file
    await this.validateTemplate();

    // 5. Validate props schema file
    await this.validatePropsSchema();

    // 6. Validate assets if declared
    if (this.manifest.assets) {
      await this.validateAssets();
    }

    // 7. Validate locales if declared
    if (this.manifest.locales) {
      await this.validateLocales();
    }

    // 8. Validate preview image if declared
    if (this.manifest.preview) {
      await this.validatePreview();
    }

    // 9. Validate dependencies format
    if (this.manifest.dependencies) {
      await this.validateDependencies();
    }

    return this.buildResult();
  }

  /**
   * Validate required files exist
   */
  private async validateRequiredFiles(): Promise<boolean> {
    let allExist = true;

    for (const filename of ComponentValidator.REQUIRED_FILES) {
      const filePath = path.join(this.componentDir, filename);
      if (!(await this.fileExists(filePath))) {
        this.addError(createError('missing_file', `Required file missing: ${filename}`));
        allExist = false;
      }
    }

    return allExist;
  }

  /**
   * Validate template.html file
   */
  private async validateTemplate(): Promise<void> {
    const templatePath = path.join(this.componentDir, 'template.html');

    if (!(await this.fileExists(templatePath))) {
      this.addError(createError('missing_file', 'Template file (template.html) does not exist'));
      return;
    }

    // Check file is not empty
    if (!(await this.validateFileNotEmpty(templatePath, 'Template'))) {
      return;
    }

    // Check it's valid UTF-8
    await this.validateUTF8(templatePath, 'Template');
  }

  /**
   * Validate props schema file
   */
  private async validatePropsSchema(): Promise<void> {
    const schemaPath = path.join(this.componentDir, 'schema.json');

    if (!(await this.fileExists(schemaPath))) {
      this.addError(createError('missing_file', 'Props schema file (schema.json) does not exist'));
      return;
    }

    // Load and validate it's valid JSON
    let propsSchema: any;
    try {
      propsSchema = await this.loadJSON(schemaPath);
    } catch {
      // Error already added by loadJSON
      return;
    }

    // Check it matches the props_schema in manifest (if present)
    if (this.manifest?.props_schema) {
      const manifestSchema = JSON.stringify(this.manifest.props_schema, null, 2);
      const fileSchema = JSON.stringify(propsSchema, null, 2);

      if (manifestSchema !== fileSchema) {
        this.addError(
          createError(
            'schema_mismatch',
            'Props schema in schema.json does not match manifest.props_schema'
          )
        );
        return;
      }
    }

    // Validate it's a valid JSON Schema (basic check)
    if (!propsSchema.$schema && !propsSchema.type) {
      this.addWarning(
        createWarning(
          'invalid_schema',
          'Props schema may not be a valid JSON Schema (missing $schema or type)',
          {
            suggestion: 'Add "$schema": "http://json-schema.org/draft-07/schema#" to schema.json',
          }
        )
      );
    }
  }

  /**
   * Validate declared asset files exist
   */
  private async validateAssets(): Promise<void> {
    if (!this.manifest?.assets) return;

    const validAssetTypes = ['css', 'js', 'images'];

    for (const [assetType, assetPaths] of Object.entries(this.manifest.assets)) {
      if (!validAssetTypes.includes(assetType)) {
        this.addError(createError('invalid_asset_type', `Unknown asset type: ${assetType}`));
        continue;
      }

      for (const assetPath of assetPaths) {
        const fullPath = path.join(this.componentDir, assetPath);

        if (!(await this.fileExists(fullPath))) {
          this.addError(createError('missing_asset', `Asset file does not exist: ${assetPath}`));
          continue;
        }
      }
    }
  }

  /**
   * Validate locale files exist for declared locales
   */
  private async validateLocales(): Promise<void> {
    if (!this.manifest?.locales) return;

    const localesDir = path.join(this.componentDir, 'locales');

    if (!(await this.directoryExists(localesDir))) {
      this.addError(
        createError('missing_directory', 'Locales declared but locales/ directory does not exist')
      );
      return;
    }

    for (const locale of this.manifest.locales) {
      const localeFile = path.join(localesDir, `${locale}.json`);

      if (!(await this.fileExists(localeFile))) {
        this.addError(
          createError('missing_locale', `Locale file does not exist: locales/${locale}.json`)
        );
        continue;
      }

      // Validate it's valid JSON
      try {
        await this.loadJSON(localeFile);
      } catch {
        // Error already added by loadJSON
      }
    }
  }

  /**
   * Validate preview image file exists
   */
  private async validatePreview(): Promise<void> {
    if (!this.manifest?.preview) return;

    const previewPath = path.join(this.componentDir, this.manifest.preview);

    if (!(await this.fileExists(previewPath))) {
      this.addError(
        createError('missing_preview', `Preview image does not exist: ${this.manifest.preview}`)
      );
      return;
    }

    // Check file size is reasonable (not too large)
    const maxSize = 5 * 1024 * 1024; // 5 MB
    const stats = await fs.stat(previewPath);

    if (stats.size > maxSize) {
      this.addError(
        createError(
          'file_too_large',
          `Preview image is too large (max 5MB): ${this.manifest.preview}`
        )
      );
    }
  }

  /**
   * Validate dependency format
   */
  private async validateDependencies(): Promise<void> {
    if (!this.manifest?.dependencies) return;

    for (const dep of this.manifest.dependencies) {
      const minVer = dep.min_version;
      const maxVer = dep.max_version;

      if (minVer && maxVer) {
        // Compare versions
        if (this.compareVersions(minVer, maxVer) > 0) {
          this.addError(
            createError(
              'invalid_dependency',
              `Dependency ${dep.name}: min_version (${minVer}) is greater than max_version (${maxVer})`
            )
          );
        }
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
      componentInfo: this.manifest,
    };
  }
}
