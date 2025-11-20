import * as vscode from 'vscode';
import { ThemeValidator } from '@spwig/theme-validator';
import { getThemePath } from '../utils/workspace';

export async function validateCommand() {
  const themePath = await getThemePath();

  if (!themePath) {
    vscode.window.showErrorMessage('No Spwig theme found in workspace');
    return;
  }

  // Show progress indicator
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: 'Validating theme...',
      cancellable: false,
    },
    async () => {
      try {
        const validator = new ThemeValidator(themePath);
        const result = await validator.validate();

        // Create output channel for detailed results
        const outputChannel = vscode.window.createOutputChannel('Spwig Validation');
        outputChannel.clear();
        outputChannel.appendLine('═══════════════════════════════════════════════════════════');
        outputChannel.appendLine('  SPWIG THEME VALIDATION REPORT');
        outputChannel.appendLine('═══════════════════════════════════════════════════════════');
        outputChannel.appendLine('');
        outputChannel.appendLine(validator.getValidationReport());
        outputChannel.appendLine('');
        outputChannel.appendLine('═══════════════════════════════════════════════════════════');
        outputChannel.show();

        // Show summary notification
        if (result.isValid) {
          if (result.warnings.length > 0) {
            vscode.window.showWarningMessage(
              `Theme validation passed with ${result.warnings.length} warning(s). See output for details.`
            );
          } else {
            vscode.window.showInformationMessage('Theme validation passed successfully!');
          }
        } else {
          vscode.window.showErrorMessage(
            `Theme validation failed with ${result.errors.length} error(s). See output for details.`
          );
        }

        // Update diagnostics for better IDE integration
        updateDiagnostics(themePath, result);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        vscode.window.showErrorMessage(`Validation failed: ${message}`);
      }
    }
  );
}

/**
 * Update VS Code diagnostics based on validation results
 */
function updateDiagnostics(
  themePath: string,
  result: { errors: Array<{ code: string; message: string }>; warnings: Array<{ code: string; message: string }> }
) {
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('spwig-validation');
  const manifestUri = vscode.Uri.file(`${themePath}/manifest.json`);
  const diagnostics: vscode.Diagnostic[] = [];

  // Add errors
  for (const error of result.errors) {
    diagnostics.push(
      new vscode.Diagnostic(
        new vscode.Range(0, 0, 0, 1),
        error.message,
        vscode.DiagnosticSeverity.Error
      )
    );
  }

  // Add warnings
  for (const warning of result.warnings) {
    diagnostics.push(
      new vscode.Diagnostic(
        new vscode.Range(0, 0, 0, 1),
        warning.message,
        vscode.DiagnosticSeverity.Warning
      )
    );
  }

  diagnosticCollection.set(manifestUri, diagnostics);
}
