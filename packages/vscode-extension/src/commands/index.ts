import * as vscode from 'vscode';
import { initCommand } from './init';
import { validateCommand } from './validate';
import { packageCommand } from './package';
import { devCommand, devStopCommand } from './dev';

export function registerCommands(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('spwig.init', initCommand),
    vscode.commands.registerCommand('spwig.validate', validateCommand),
    vscode.commands.registerCommand('spwig.package', packageCommand),
    vscode.commands.registerCommand('spwig.dev', devCommand),
    vscode.commands.registerCommand('spwig.devStop', devStopCommand),
    vscode.commands.registerCommand('spwig.openDocs', openDocsCommand)
  );
}

async function openDocsCommand() {
  vscode.env.openExternal(vscode.Uri.parse('https://community.spwig.com/c/themes-customisation/'));
}
