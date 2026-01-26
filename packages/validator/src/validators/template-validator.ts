/**
 * Template Validator
 * Validates Django/Jinja2 template files
 */

import fs from 'fs-extra';
import {
  ValidationResult,
  ValidationError,
  ValidationWarning,
  createError,
  createWarning,
} from '../types/validation-result.js';

export class TemplateValidator {
  private errors: ValidationError[] = [];
  private warnings: ValidationWarning[] = [];

  /**
   * Validate a template file
   */
  async validate(templatePath: string): Promise<ValidationResult> {
    this.errors = [];
    this.warnings = [];

    // Check file exists
    if (!(await this.fileExists(templatePath))) {
      this.errors.push(
        createError('file_not_found', `Template file does not exist: ${templatePath}`)
      );
      return this.buildResult();
    }

    // Check file is not empty
    const content = await this.readTemplate(templatePath);
    if (!content) {
      return this.buildResult();
    }

    // Basic template syntax checks
    this.checkTemplateSyntax(content, templatePath);

    // Check for common issues
    this.checkCommonIssues(content, templatePath);

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
   * Read template content
   */
  private async readTemplate(templatePath: string): Promise<string | null> {
    try {
      const content = await fs.readFile(templatePath, 'utf-8');

      if (content.trim().length === 0) {
        this.errors.push(
          createError('empty_template', 'Template file is empty', {
            path: templatePath,
          })
        );
        return null;
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        this.errors.push(
          createError('read_error', `Failed to read template: ${error.message}`, {
            path: templatePath,
          })
        );
      }
      return null;
    }
  }

  /**
   * Check basic template syntax
   */
  private checkTemplateSyntax(content: string, templatePath: string): void {
    const lines = content.split('\n');

    // Check for unclosed tags
    let blockStack: Array<{ tag: string; line: number }> = [];
    const blockTags = ['if', 'for', 'block', 'with', 'autoescape', 'spaceless', 'verbatim'];

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Find opening tags
      const openMatches = line.matchAll(/{%\s*(\w+)/g);
      for (const match of openMatches) {
        const tag = match[1];
        if (blockTags.includes(tag)) {
          blockStack.push({ tag, line: lineNumber });
        }
      }

      // Find closing tags
      const closeMatches = line.matchAll(/{%\s*end(\w+)/g);
      for (const match of closeMatches) {
        const tag = match[1];
        if (blockStack.length === 0) {
          this.errors.push(
            createError('template_syntax', `Unexpected closing tag: {% end${tag} %}`, {
              path: templatePath,
              line: lineNumber,
            })
          );
        } else {
          const lastBlock = blockStack.pop();
          if (lastBlock && lastBlock.tag !== tag) {
            this.errors.push(
              createError(
                'template_syntax',
                `Mismatched closing tag: expected {% end${lastBlock.tag} %}, found {% end${tag} %}`,
                {
                  path: templatePath,
                  line: lineNumber,
                }
              )
            );
          }
        }
      }
    });

    // Check for unclosed blocks
    if (blockStack.length > 0) {
      for (const block of blockStack) {
        this.errors.push(
          createError('template_syntax', `Unclosed block: {% ${block.tag} %}`, {
            path: templatePath,
            line: block.line,
          })
        );
      }
    }

    // Check for basic variable syntax errors
    const variablePattern = /{{\s*[\w._[\]]+\s*}}/g;
    const invalidVariables = content.match(/{{[^}]*$/gm);
    if (invalidVariables) {
      this.errors.push(
        createError('template_syntax', 'Unclosed variable tag: {{', {
          path: templatePath,
        })
      );
    }
  }

  /**
   * Check for common template issues
   */
  private checkCommonIssues(content: string, templatePath: string): void {
    // Warn about hardcoded URLs
    if (content.includes('http://') || content.includes('https://')) {
      const httpMatches = content.match(/https?:\/\/[^\s"'<>]+/g);
      if (httpMatches && httpMatches.length > 0) {
        this.warnings.push(
          createWarning(
            'hardcoded_url',
            `Found ${httpMatches.length} hardcoded URL(s) in template`,
            {
              path: templatePath,
              suggestion: 'Use relative URLs or Django template tags like {% url %}',
            }
          )
        );
      }
    }

    // Warn about inline styles (should use design tokens)
    const inlineStyleCount = (content.match(/style\s*=/gi) || []).length;
    if (inlineStyleCount > 3) {
      this.warnings.push(
        createWarning('inline_styles', `Found ${inlineStyleCount} inline style attributes`, {
          path: templatePath,
          suggestion: 'Consider using CSS classes and design tokens instead',
        })
      );
    }

    // Check for missing alt attributes on images
    const imgTags = content.match(/<img[^>]+>/gi);
    if (imgTags) {
      for (const imgTag of imgTags) {
        if (!imgTag.includes('alt=')) {
          this.warnings.push(
            createWarning('accessibility', 'Image tag missing alt attribute', {
              path: templatePath,
              suggestion: 'Add alt attribute for accessibility',
            })
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
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }
}
