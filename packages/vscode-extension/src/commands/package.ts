import * as vscode from 'vscode';
import { getCliPath, createTerminal } from '../utils/terminal';
import { getThemePath } from '../utils/workspace';

export async function packageCommand() {
  const cliPath = getCliPath();
  const themePath = await getThemePath();

  if (!themePath) {
    vscode.window.showErrorMessage('No Spwig theme found in workspace');
    return;
  }

  const terminal = createTerminal('Spwig Package');
  terminal.show();
  terminal.sendText(`cd "${themePath}" && ${cliPath} package`);
}
