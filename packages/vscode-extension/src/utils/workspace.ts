import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function getThemePath(): Promise<string | undefined> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    return undefined;
  }

  // Check each workspace folder for manifest.json
  for (const folder of workspaceFolders) {
    const manifestPath = path.join(folder.uri.fsPath, 'manifest.json');
    if (fs.existsSync(manifestPath)) {
      try {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const manifest = JSON.parse(content);
        // Check if it's a theme manifest (has name and version)
        if (manifest.name && manifest.version) {
          return folder.uri.fsPath;
        }
      } catch {
        // Invalid JSON, continue
      }
    }
  }

  return undefined;
}

export async function getThemeManifest(): Promise<{
  path: string;
  manifest: ThemeManifest;
} | undefined> {
  const themePath = await getThemePath();
  if (!themePath) {
    return undefined;
  }

  const manifestPath = path.join(themePath, 'manifest.json');
  try {
    const content = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(content) as ThemeManifest;
    return { path: themePath, manifest };
  } catch {
    return undefined;
  }
}

export interface ThemeManifest {
  name: string;
  version: string;
  display_name?: string;
  description?: string;
  author?: string;
  license?: string;
  components?: {
    headers?: string[];
    footers?: string[];
    sections?: string[];
    utilities?: string[];
  };
}
