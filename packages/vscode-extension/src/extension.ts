import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { ThemeTreeDataProvider } from './providers/treeDataProvider';
import { DiagnosticsProvider } from './providers/diagnosticsProvider';

let diagnosticsProvider: DiagnosticsProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('Spwig Theme Development extension is now active');

  // Register commands
  registerCommands(context);

  // Register tree view
  const treeDataProvider = new ThemeTreeDataProvider();
  vscode.window.registerTreeDataProvider('spwigThemeExplorer', treeDataProvider);

  // Register refresh command for tree view
  context.subscriptions.push(
    vscode.commands.registerCommand('spwig.refresh', () => {
      treeDataProvider.refresh();
    })
  );

  // Register diagnostics provider
  diagnosticsProvider = new DiagnosticsProvider();
  context.subscriptions.push(diagnosticsProvider);

  // Auto-validate on save if enabled
  const config = vscode.workspace.getConfiguration('spwig');
  if (config.get('autoValidate', true)) {
    context.subscriptions.push(
      vscode.workspace.onDidSaveTextDocument((document) => {
        if (isSpwigFile(document)) {
          diagnosticsProvider?.validateDocument(document);
        }
      })
    );
  }

  // Show welcome message on first install
  const hasShownWelcome = context.globalState.get('spwig.hasShownWelcome');
  if (!hasShownWelcome) {
    showWelcomeMessage();
    context.globalState.update('spwig.hasShownWelcome', true);
  }
}

export function deactivate() {
  if (diagnosticsProvider) {
    diagnosticsProvider.dispose();
  }
}

function isSpwigFile(document: vscode.TextDocument): boolean {
  const fileName = document.fileName;
  return (
    fileName.endsWith('manifest.json') ||
    fileName.endsWith('design_tokens.json') ||
    fileName.endsWith('schema.json') ||
    (fileName.endsWith('.json') && fileName.includes('/pages/')) ||
    (fileName.endsWith('.html') && fileName.includes('/templates/'))
  );
}

async function showWelcomeMessage() {
  const action = await vscode.window.showInformationMessage(
    'Welcome to Spwig Theme Development! Get started by creating a new theme or opening an existing one.',
    'Create Theme',
    'Documentation',
    "Don't Show Again"
  );

  if (action === 'Create Theme') {
    vscode.commands.executeCommand('spwig.init');
  } else if (action === 'Documentation') {
    vscode.commands.executeCommand('spwig.openDocs');
  }
}
