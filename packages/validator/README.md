# @spwig/theme-validator

Standalone validation library for Spwig themes and components.

## Installation

```bash
npm install @spwig/theme-validator
```

## Usage

### Validate a Theme

```typescript
import { ThemeValidator } from '@spwig/theme-validator';

const validator = new ThemeValidator('./path/to/theme');
const result = await validator.validate();

if (result.isValid) {
  console.log('✅ Theme is valid!');
  console.log('Theme:', result.themeInfo?.display_name);
} else {
  console.error('❌ Validation failed');
  result.errors.forEach(error => {
    console.error(`  ${error.code}: ${error.message}`);
  });
}

// Check warnings
if (result.warnings.length > 0) {
  console.warn('⚠️  Warnings:');
  result.warnings.forEach(warning => {
    console.warn(`  ${warning.code}: ${warning.message}`);
  });
}
```

### Validate a Component

```typescript
import { ComponentValidator } from '@spwig/theme-validator';

const validator = new ComponentValidator('./path/to/component');
const result = await validator.validate();

if (result.isValid) {
  console.log('✅ Component is valid!');
  console.log('Component:', result.componentInfo?.display_name);
} else {
  console.error('❌ Validation failed');
  result.errors.forEach(error => {
    console.error(`  ${error.code}: ${error.message}`);
  });
}
```

### Validate Design Tokens

```typescript
import { DesignTokensValidator } from '@spwig/theme-validator';

const validator = new DesignTokensValidator();
const result = await validator.validateFile('./design_tokens.json');

if (!result.isValid) {
  result.errors.forEach(error => {
    console.error(`${error.code}: ${error.message}`);
  });
}
```

### Validate Template Files

```typescript
import { TemplateValidator } from '@spwig/theme-validator';

const validator = new TemplateValidator();
const result = await validator.validateFile('./template.html');

// Check for template syntax issues
if (result.warnings.length > 0) {
  console.warn('Template warnings:', result.warnings);
}
```

## API Reference

### ThemeValidator

Validates complete theme packages including manifest, components, design tokens, and structure.

**Constructor:**
```typescript
constructor(themeDir: string)
```

**Methods:**
```typescript
async validate(): Promise<ValidationResult>
```

**What it validates:**
- Theme manifest against JSON schema
- Required files (manifest.json, design_tokens.json)
- Design tokens structure
- Bundled components
- Page schemas
- Asset references
- Preview images

### ComponentValidator

Validates individual component packages.

**Constructor:**
```typescript
constructor(componentDir: string)
```

**Methods:**
```typescript
async validate(): Promise<ValidationResult>
```

**What it validates:**
- Component manifest against JSON schema
- Required files (manifest.json, template.html, schema.json)
- Template file syntax (basic checks)
- Props schema validity
- Asset declarations and file existence
- Locale files
- Preview image
- Dependency version constraints

### DesignTokensValidator

Validates design token files.

**Constructor:**
```typescript
constructor()
```

**Methods:**
```typescript
async validateFile(filePath: string): Promise<ValidationResult>
async validateTokens(tokens: DesignTokens): Promise<ValidationResult>
```

**What it validates:**
- Color token formats (hex, rgb, rgba, hsl, CSS variables)
- Typography values
- Spacing scales
- Border radius values
- Shadow definitions

### TemplateValidator

Validates Django/Jinja2 template files.

**Constructor:**
```typescript
constructor()
```

**Methods:**
```typescript
async validateFile(filePath: string): Promise<ValidationResult>
async validateTemplate(content: string): Promise<ValidationResult>
```

**What it validates:**
- Basic Jinja2 syntax
- Balanced template tags
- Common template errors
- UTF-8 encoding

### ManifestValidator

Base validator class for manifest files using JSON Schema validation.

**Constructor:**
```typescript
constructor()
```

**Methods:**
```typescript
async loadSchema(schemaPath: string): Promise<object>
validateAgainstSchema(data: any, schema: object, name: string): boolean
getErrors(): ValidationError[]
getWarnings(): ValidationWarning[]
```

## TypeScript Types

All validators include full TypeScript type definitions:

```typescript
import type {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ThemeManifest,
  ComponentManifest,
  DesignTokens,
  PageSchema,
  BundledComponentRef
} from '@spwig/theme-validator';
```

### ValidationResult

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  themeInfo?: ThemeManifest;      // For theme validation
  componentInfo?: ComponentManifest; // For component validation
}
```

### ValidationError

```typescript
interface ValidationError {
  code: string;           // Error code (e.g., 'missing_file', 'invalid_schema')
  message: string;        // Human-readable error message
  path?: string;          // File path or JSON path where error occurred
  suggestion?: string;    // Optional suggestion to fix the error
}
```

### ValidationWarning

```typescript
interface ValidationWarning {
  code: string;
  message: string;
  path?: string;
  suggestion?: string;
}
```

## Error Codes

Common error codes you might encounter:

| Code | Description |
|------|-------------|
| `directory_not_found` | Theme/component directory doesn't exist |
| `missing_file` | Required file is missing |
| `invalid_json` | JSON file is malformed |
| `schema_validation_failed` | Manifest doesn't match JSON schema |
| `missing_asset` | Referenced asset file not found |
| `missing_locale` | Declared locale file not found |
| `file_too_large` | File exceeds size limit |
| `invalid_version` | Version number format is invalid |
| `invalid_dependency` | Dependency version constraint is invalid |

## Integration Examples

### CI/CD Pipeline

```typescript
// validate-theme.ts
import { ThemeValidator } from '@spwig/theme-validator';

async function validateInCI() {
  const validator = new ThemeValidator(process.cwd());
  const result = await validator.validate();

  if (!result.isValid) {
    console.error('❌ Theme validation failed:');
    result.errors.forEach(error => {
      console.error(`  ${error.code}: ${error.message}`);
      if (error.suggestion) {
        console.error(`    💡 ${error.suggestion}`);
      }
    });
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    console.warn('⚠️  Warnings found:');
    result.warnings.forEach(warning => {
      console.warn(`  ${warning.message}`);
    });
  }

  console.log('✅ Theme validation passed!');
}

validateInCI().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
```

### Build Tool Integration

```typescript
// webpack.config.js or build script
import { ThemeValidator } from '@spwig/theme-validator';

class ThemeValidationPlugin {
  apply(compiler) {
    compiler.hooks.beforeCompile.tapPromise('ThemeValidation', async () => {
      const validator = new ThemeValidator('./src/theme');
      const result = await validator.validate();

      if (!result.isValid) {
        throw new Error('Theme validation failed');
      }
    });
  }
}
```

### Testing

```typescript
// theme.test.ts
import { ThemeValidator } from '@spwig/theme-validator';
import { describe, it, expect } from 'jest';

describe('Theme Validation', () => {
  it('should validate successfully', async () => {
    const validator = new ThemeValidator('./fixtures/valid-theme');
    const result = await validator.validate();

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect missing manifest', async () => {
    const validator = new ThemeValidator('./fixtures/invalid-theme');
    const result = await validator.validate();

    expect(result.isValid).toBe(false);
    expect(result.errors.some(e => e.code === 'missing_file')).toBe(true);
  });
});
```

## Requirements

- Node.js >= 18.0.0
- Dependencies:
  - `ajv` - JSON Schema validation
  - `ajv-errors` - Enhanced error messages
  - `fs-extra` - File system utilities

## Related Packages

- [@spwig/theme-cli](../cli) - Command-line interface for theme development

## License

Apache License 2.0 - see [LICENSE](../../LICENSE) file for details.

## Support

- [GitHub Issues](https://github.com/spwig/theme-sdk/issues)
