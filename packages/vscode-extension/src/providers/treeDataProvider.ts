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
      return [
        new SectionItem('Theme Info', 'info', element.themePath),
        new SectionItem('Components', 'components', element.themePath),
        new SectionItem('Pages', 'pages', element.themePath),
        new SectionItem('Design Tokens', 'tokens', element.themePath),
        new SectionItem('Actions', 'actions', element.themePath),
      ];
    }

    if (element instanceof SectionItem) {
      return this.getSectionChildren(element);
    }

    if (element instanceof ComponentTypeItem) {
      return this.getComponentTypeChildren(element);
    }

    if (element instanceof ComponentItem) {
      return this.getComponentFiles(element);
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

      case 'components': {
        const componentsPath = path.join(themePath, 'components');
        if (!fs.existsSync(componentsPath)) {
          return [];
        }

        const types: TreeItem[] = [];
        const dirs = ['headers', 'footers', 'sections', 'utilities'];
        for (const dir of dirs) {
          const typePath = path.join(componentsPath, dir);
          if (fs.existsSync(typePath)) {
            const count = fs.readdirSync(typePath).filter((f) =>
              fs.statSync(path.join(typePath, f)).isDirectory()
            ).length;
            if (count > 0) {
              types.push(new ComponentTypeItem(dir, typePath, count));
            }
          }
        }
        return types;
      }

      case 'pages': {
        const pagesPath = path.join(themePath, 'pages');
        if (!fs.existsSync(pagesPath)) {
          return [];
        }

        return fs
          .readdirSync(pagesPath)
          .filter((f) => f.endsWith('.json'))
          .map((f) => new FileItem(f, path.join(pagesPath, f), 'page'));
      }

      case 'tokens': {
        const tokensPath = path.join(themePath, 'design_tokens.json');
        if (fs.existsSync(tokensPath)) {
          return [new FileItem('design_tokens.json', tokensPath, 'tokens')];
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

  private getComponentTypeChildren(typeItem: ComponentTypeItem): TreeItem[] {
    const items: TreeItem[] = [];
    const dirs = fs.readdirSync(typeItem.typePath);

    for (const dir of dirs) {
      const componentPath = path.join(typeItem.typePath, dir);
      if (fs.statSync(componentPath).isDirectory()) {
        items.push(new ComponentItem(dir, componentPath));
      }
    }

    return items;
  }

  private getComponentFiles(component: ComponentItem): TreeItem[] {
    const files: TreeItem[] = [];
    const entries = fs.readdirSync(component.componentPath);

    for (const entry of entries) {
      const filePath = path.join(component.componentPath, entry);
      if (fs.statSync(filePath).isFile()) {
        files.push(new FileItem(entry, filePath, 'component-file'));
      }
    }

    return files;
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
      components: 'extensions',
      pages: 'file-code',
      tokens: 'symbol-color',
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

class ComponentTypeItem extends TreeItem {
  constructor(
    label: string,
    public readonly typePath: string,
    count: number
  ) {
    super(`${label} (${count})`, vscode.TreeItemCollapsibleState.Collapsed);
    this.iconPath = new vscode.ThemeIcon('folder');
  }
}

class ComponentItem extends TreeItem {
  constructor(
    label: string,
    public readonly componentPath: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.Collapsed);
    this.contextValue = 'component';
    this.iconPath = new vscode.ThemeIcon('extensions');
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
