import * as vscode from 'vscode';
import { getCliPath, createTerminal } from '../utils/terminal';
import { getThemePath } from '../utils/workspace';

export async function componentAddCommand() {
  const cliPath = getCliPath();
  const themePath = await getThemePath();

  if (!themePath) {
    vscode.window.showErrorMessage('No Spwig theme found in workspace');
    return;
  }

  // Ask for component type
  const componentType = await vscode.window.showQuickPick(
    [
      { label: 'Header', value: 'header' },
      { label: 'Footer', value: 'footer' },
      { label: 'Section', value: 'section' },
      { label: 'Utility', value: 'utility' },
    ],
    {
      placeHolder: 'Select component type',
    }
  );

  if (!componentType) {
    return;
  }

  // Ask for component name
  const componentName = await vscode.window.showInputBox({
    prompt: 'Enter component name (snake_case)',
    placeHolder: 'my_component',
    validateInput: (value) => {
      if (!value) {
        return 'Component name is required';
      }
      if (!/^[a-z][a-z0-9_]*$/.test(value)) {
        return 'Component name must be lowercase with underscores only';
      }
      return null;
    },
  });

  if (!componentName) {
    return;
  }

  // Ask for display name
  const displayName = await vscode.window.showInputBox({
    prompt: 'Enter display name',
    value: componentName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  });

  if (!displayName) {
    return;
  }

  const terminal = createTerminal('Spwig Component');
  terminal.show();
  terminal.sendText(
    `cd "${themePath}" && ${cliPath} component add ${componentType.value} ${componentName} --display-name "${displayName}" --with-css`
  );
}
