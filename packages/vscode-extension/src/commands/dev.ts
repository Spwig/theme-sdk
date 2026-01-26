import * as vscode from 'vscode';
import { getCliPath, createTerminal, findTerminal } from '../utils/terminal';
import { getThemePath } from '../utils/workspace';

let devTerminal: vscode.Terminal | undefined;

export async function devCommand() {
  const cliPath = getCliPath();
  const themePath = await getThemePath();

  if (!themePath) {
    vscode.window.showErrorMessage('No Spwig theme found in workspace');
    return;
  }

  // Get shop URL from settings
  const config = vscode.workspace.getConfiguration('spwig');
  const shopUrl = config.get<string>('devServer.shopUrl', 'http://localhost:8000');
  const autoOpen = config.get<boolean>('devServer.autoOpen', true);

  // Ask for shop URL if not configured
  const url = await vscode.window.showInputBox({
    prompt: 'Enter Spwig shop URL',
    value: shopUrl,
    placeHolder: 'http://localhost:8000',
  });

  if (!url) {
    return;
  }

  // Kill existing dev server if running
  if (devTerminal) {
    devTerminal.dispose();
  }

  devTerminal = createTerminal('Spwig Dev Server');
  devTerminal.show();

  const openFlag = autoOpen ? '' : '--no-open';
  devTerminal.sendText(`cd "${themePath}" && ${cliPath} dev --shop ${url} ${openFlag}`);
}

export async function devStopCommand() {
  if (devTerminal) {
    devTerminal.dispose();
    devTerminal = undefined;
    vscode.window.showInformationMessage('Spwig dev server stopped');
  } else {
    // Try to find existing terminal
    const terminal = findTerminal('Spwig Dev Server');
    if (terminal) {
      terminal.dispose();
      vscode.window.showInformationMessage('Spwig dev server stopped');
    } else {
      vscode.window.showWarningMessage('No Spwig dev server running');
    }
  }
}
