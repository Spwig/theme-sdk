import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getThemePath } from '../utils/workspace';

export class DiagnosticsProvider implements vscode.Disposable {
  private diagnosticCollection: vscode.DiagnosticCollection;
  private disposables: vscode.Disposable[] = [];

  constructor() {
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('spwig');
    this.disposables.push(this.diagnosticCollection);
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose());
  }

  async validateDocument(document: vscode.TextDocument) {
    const diagnostics: vscode.Diagnostic[] = [];
    const fileName = path.basename(document.fileName);
    const text = document.getText();

    try {
      // Validate JSON files
      if (document.languageId === 'json') {
        const parsed = JSON.parse(text);

        if (fileName === 'manifest.json') {
          this.validateManifest(document, parsed, diagnostics);
        } else if (fileName === 'tokens.json') {
          this.validateDesignTokens(document, parsed, diagnostics);
        }
      }
    } catch (e) {
      // JSON parse error
      if (e instanceof SyntaxError) {
        const match = e.message.match(/position (\d+)/);
        if (match) {
          const pos = parseInt(match[1], 10);
          const position = document.positionAt(pos);
          diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(position, position),
              `Invalid JSON: ${e.message}`,
              vscode.DiagnosticSeverity.Error
            )
          );
        }
      }
    }

    this.diagnosticCollection.set(document.uri, diagnostics);
  }

  private validateManifest(
    document: vscode.TextDocument,
    manifest: Record<string, unknown>,
    diagnostics: vscode.Diagnostic[]
  ) {
    // Check required fields
    const requiredFields = ['name', 'version', 'display_name', 'description', 'author'];
    for (const field of requiredFields) {
      if (!manifest[field]) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 1),
            `Missing required field: "${field}"`,
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }

    // Validate version format
    if (manifest.version && typeof manifest.version === 'string') {
      const semverPattern = /^\d+\.\d+\.\d+$/;
      if (!semverPattern.test(manifest.version)) {
        const range = this.findFieldRange(document, 'version');
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            'Version must be in semantic version format (e.g., "1.0.0")',
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }

    // Validate name format
    if (manifest.name && typeof manifest.name === 'string') {
      const namePattern = /^[a-z][a-z0-9-]*$/;
      if (!namePattern.test(manifest.name)) {
        const range = this.findFieldRange(document, 'name');
        diagnostics.push(
          new vscode.Diagnostic(
            range,
            'Name must be lowercase with hyphens only (e.g., "my-theme")',
            vscode.DiagnosticSeverity.Error
          )
        );
      }
    }

    // Warn about missing optional but recommended fields
    const recommendedFields = ['license', 'preview_image'];
    for (const field of recommendedFields) {
      if (!manifest[field]) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 1),
            `Recommended field missing: "${field}"`,
            vscode.DiagnosticSeverity.Warning
          )
        );
      }
    }
  }

  private validateDesignTokens(
    document: vscode.TextDocument,
    tokens: Record<string, unknown>,
    diagnostics: vscode.Diagnostic[]
  ) {
    // Check recommended token categories
    const recommendedCategories = ['colors', 'typography', 'spacing'];
    for (const category of recommendedCategories) {
      if (!tokens[category]) {
        diagnostics.push(
          new vscode.Diagnostic(
            new vscode.Range(0, 0, 0, 1),
            `Recommended token category missing: "${category}"`,
            vscode.DiagnosticSeverity.Hint
          )
        );
      }
    }

    // Validate color values
    if (tokens.colors && typeof tokens.colors === 'object') {
      const colors = tokens.colors as Record<string, string>;
      const colorPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;

      for (const [key, value] of Object.entries(colors)) {
        if (typeof value === 'string' && !colorPattern.test(value)) {
          diagnostics.push(
            new vscode.Diagnostic(
              new vscode.Range(0, 0, 0, 1),
              `Invalid color value for "${key}": "${value}"`,
              vscode.DiagnosticSeverity.Warning
            )
          );
        }
      }
    }
  }

  private findFieldRange(document: vscode.TextDocument, fieldName: string): vscode.Range {
    const text = document.getText();
    const pattern = new RegExp(`"${fieldName}"\\s*:\\s*`);
    const match = text.match(pattern);

    if (match && match.index !== undefined) {
      const startPos = document.positionAt(match.index);
      const endPos = document.positionAt(match.index + match[0].length);
      return new vscode.Range(startPos, endPos);
    }

    return new vscode.Range(0, 0, 0, 1);
  }

  async validateWorkspace() {
    const themePath = await getThemePath();
    if (!themePath) {
      return;
    }

    // Validate all relevant files
    const patterns = ['manifest.json', 'tokens.json'];

    for (const pattern of patterns) {
      const files = await vscode.workspace.findFiles(pattern);
      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        await this.validateDocument(document);
      }
    }
  }
}
