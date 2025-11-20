import * as vscode from 'vscode';
import { getCliPath, createTerminal } from '../utils/terminal';

export async function initCommand() {
  const cliPath = getCliPath();

  // Ask for theme name
  const themeName = await vscode.window.showInputBox({
    prompt: 'Enter theme name (lowercase, hyphens)',
    placeHolder: 'my-awesome-theme',
    validateInput: (value) => {
      if (!value) {
        return 'Theme name is required';
      }
      if (!/^[a-z][a-z0-9-]*$/.test(value)) {
        return 'Theme name must be lowercase with hyphens only';
      }
      return null;
    },
  });

  if (!themeName) {
    return;
  }

  // Ask for template type
  const template = await vscode.window.showQuickPick(
    [
      { label: 'Full', description: 'Complete theme with components and pages', value: 'full' },
      { label: 'Minimal', description: 'Basic structure with design tokens', value: 'minimal' },
      { label: 'Blank', description: 'Just manifest and README', value: 'blank' },
    ],
    {
      placeHolder: 'Select template type',
    }
  );

  if (!template) {
    return;
  }

  const terminal = createTerminal('Spwig Init');
  terminal.show();
  terminal.sendText(`${cliPath} init ${themeName} --template ${template.value}`);
}
