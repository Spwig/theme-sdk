import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getThemeManifest, ThemeManifest } from '../utils/workspace';

export class ThemeTreeDataProvider implements vscode.TreeDataProvider<TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeItem | undefined | null | void> =
    new vscode.EventEmitter<TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<TreeItem | undefined | null | void> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (!element) {
      // Root level - get theme
      const themeData = await getThemeManifest();
      if (!themeData) {
        return [];
      }
      return [new ThemeItem(themeData.path, themeData.manifest)];
    }

    if (element instanceof ThemeItem) {
      // Theme children - sections
      const sections: TreeItem[] = [
        new SectionItem('Theme Info', 'info', element.themePath),
        new SectionItem('Design Tokens', 'tokens', element.themePath),
      ];

      // Only show Presets if presets/ directory exists
      const presetsPath = path.join(element.themePath, 'presets');
      if (fs.existsSync(presetsPath)) {
        sections.push(new SectionItem('Presets', 'presets', element.themePath));
      }

      // Only show Overrides if overrides.css exists
      const overridesPath = path.join(element.themePath, 'overrides.css');
      if (fs.existsSync(overridesPath)) {
        sections.push(new SectionItem('Overrides', 'overrides', element.themePath));
      }

      sections.push(new SectionItem('Actions', 'actions', element.themePath));

      return sections;
    }

    if (element instanceof SectionItem) {
      return this.getSectionChildren(element);
    }

    if (element instanceof PresetTypeItem) {
      return this.getPresetTypeChildren(element);
    }

    return [];
  }

  private async getSectionChildren(section: SectionItem): Promise<TreeItem[]> {
    const themePath = section.themePath;

    switch (section.sectionType) {
      case 'info': {
        const manifestPath = path.join(themePath, 'manifest.json');
        try {
          const content = fs.readFileSync(manifestPath, 'utf-8');
          const manifest = JSON.parse(content) as ThemeManifest;
          return [
            new InfoItem('Name', manifest.display_name || manifest.name),
            new InfoItem('Version', manifest.version),
            new InfoItem('Author', manifest.author || 'Unknown'),
          ];
        } catch {
          return [];
        }
      }

      case 'tokens': {
        const tokensPath = path.join(themePath, 'tokens.json');
        if (fs.existsSync(tokensPath)) {
          return [new FileItem('tokens.json', tokensPath, 'tokens')];
        }
        return [];
      }

      case 'presets': {
        const presetsPath = path.join(themePath, 'presets');
        if (!fs.existsSync(presetsPath)) {
          return [];
        }

        const types: TreeItem[] = [];
        const dirs = ['headers', 'footers'];
        for (const dir of dirs) {
          const typePath = path.join(presetsPath, dir);
          if (fs.existsSync(typePath)) {
            const files = fs.readdirSync(typePath).filter((f: string) =>
              f.endsWith('.json')
            );
            if (files.length > 0) {
              types.push(new PresetTypeItem(dir.charAt(0).toUpperCase() + dir.slice(1), typePath));
            }
          }
        }
        return types;
      }

      case 'overrides': {
        const overridesPath = path.join(themePath, 'overrides.css');
        if (fs.existsSync(overridesPath)) {
          return [new FileItem('overrides.css', overridesPath, 'overrides')];
        }
        return [];
      }

      case 'actions': {
        return [
          new ActionItem('Validate', 'spwig.validate'),
          new ActionItem('Package', 'spwig.package'),
          new ActionItem('Start Dev Server', 'spwig.dev'),
        ];
      }

      default:
        return [];
    }
  }

  private getPresetTypeChildren(typeItem: PresetTypeItem): TreeItem[] {
    const items: TreeItem[] = [];
    const files = fs.readdirSync(typeItem.typePath);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(typeItem.typePath, file);
        items.push(new FileItem(file, filePath, 'preset'));
      }
    }

    return items;
  }
}

class TreeItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState);
  }
}

class ThemeItem extends TreeItem {
  constructor(
    public readonly themePath: string,
    manifest: ThemeManifest
  ) {
    super(manifest.display_name || manifest.name, vscode.TreeItemCollapsibleState.Expanded);
    this.contextValue = 'theme';
    this.iconPath = new vscode.ThemeIcon('package');
    this.tooltip = `${manifest.name} v${manifest.version}`;
  }
}

class SectionItem extends TreeItem {
  constructor(
    label: string,
    public readonly sectionType: string,
    public readonly themePath: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);

    const icons: Record<string, string> = {
      info: 'info',
      tokens: 'symbol-color',
      presets: 'list-tree',
      overrides: 'file-code',
      actions: 'play',
    };

    this.iconPath = new vscode.ThemeIcon(icons[sectionType] || 'folder');
  }
}

class InfoItem extends TreeItem {
  constructor(label: string, value: string) {
    super(`${label}: ${value}`);
    this.iconPath = new vscode.ThemeIcon('info');
  }
}

class PresetTypeItem extends TreeItem {
  constructor(
    label: string,
    public readonly typePath: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.iconPath = new vscode.ThemeIcon('folder');
  }
}

class FileItem extends TreeItem {
  constructor(
    label: string,
    filePath: string,
    type: string
  ) {
    super(label);
    this.contextValue = type;
    this.resourceUri = vscode.Uri.file(filePath);
    this.command = {
      command: 'vscode.open',
      title: 'Open File',
      arguments: [vscode.Uri.file(filePath)],
    };

    // Set icon based on file type
    if (label.endsWith('.json')) {
      this.iconPath = new vscode.ThemeIcon('json');
    } else if (label.endsWith('.html')) {
      this.iconPath = new vscode.ThemeIcon('file-code');
    } else if (label.endsWith('.css')) {
      this.iconPath = new vscode.ThemeIcon('symbol-color');
    } else if (label.endsWith('.js')) {
      this.iconPath = new vscode.ThemeIcon('symbol-method');
    } else {
      this.iconPath = new vscode.ThemeIcon('file');
    }
  }
}

class ActionItem extends TreeItem {
  constructor(label: string, commandId: string) {
    super(label);
    this.command = {
      command: commandId,
      title: label,
    };

    const icons: Record<string, string> = {
      'spwig.validate': 'check',
      'spwig.package': 'package',
      'spwig.dev': 'play',
    };

    this.iconPath = new vscode.ThemeIcon(icons[commandId] || 'run');
  }
}
