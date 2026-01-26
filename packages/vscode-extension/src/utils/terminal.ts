import * as vscode from 'vscode';

export function getCliPath(): string {
  const config = vscode.workspace.getConfiguration('spwig');
  return config.get<string>('cli.path', 'spwig');
}

export function createTerminal(name: string): vscode.Terminal {
  // Dispose existing terminal with same name
  const existing = findTerminal(name);
  if (existing) {
    existing.dispose();
  }

  return vscode.window.createTerminal({
    name,
    cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath,
  });
}

export function findTerminal(name: string): vscode.Terminal | undefined {
  return vscode.window.terminals.find((t) => t.name === name);
}
