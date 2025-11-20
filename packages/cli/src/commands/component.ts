/**
 * Component command
 * Adds new components to themes
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import {
  toSnakeCase,
  toTitleCase,
  getComponentNameError,
} from '../utils/validation.js';
import { writeFromTemplate } from '../utils/file-system.js';
import type { ThemeManifest } from '@spwig/theme-validator';

export interface ComponentOptions {
  displayName?: string;
  description?: string;
  withCss?: boolean;
  withJs?: boolean;
  template?: 'blank' | 'basic' | 'advanced';
}

const COMPONENT_TYPES = ['header', 'footer', 'section', 'utility'] as const;
type ComponentType = typeof COMPONENT_TYPES[number];

export async function componentCommand(
  type: string | undefined,
  name: string | undefined,
  options: ComponentOptions
): Promise<void> {
  console.log(chalk.blue.bold('\n🧩 Spwig Theme SDK - Add Component\n'));

  // Check if we're in a theme directory
  const themePath = process.cwd();
  const manifestPath = path.join(themePath, 'manifest.json');

  if (!(await fs.pathExists(manifestPath))) {
    console.error(
      chalk.red('Error:'),
      'Not in a theme directory. Run this command from your theme root.'
    );
    console.log(chalk.gray('Hint:'), 'Looking for manifest.json in current directory');
    process.exit(1);
  }

  // Load theme manifest
  let themeManifest: ThemeManifest;
  try {
    themeManifest = await fs.readJSON(manifestPath);
  } catch (error) {
    console.error(chalk.red('Error:'), 'Failed to parse manifest.json');
    process.exit(1);
  }

  console.log(chalk.bold('Theme:'), themeManifest.display_name);
  console.log();

  // Get component type
  let componentType: ComponentType;
  if (type && COMPONENT_TYPES.includes(type as ComponentType)) {
    componentType = type as ComponentType;
  } else {
    const { selectedType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedType',
        message: 'Component type:',
        choices: [
          { name: 'Header - Site header/navigation', value: 'header' },
          { name: 'Footer - Site footer', value: 'footer' },
          { name: 'Section - Content section (hero, features, etc.)', value: 'section' },
          { name: 'Utility - Utility component (cart icon, search, etc.)', value: 'utility' },
        ],
      },
    ]);
    componentType = selectedType;
  }

  // Get component name
  let componentName = name;
  if (!componentName) {
    const { name: inputName } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Component name (lowercase, underscores):',
        validate: (input: string) => {
          const error = getComponentNameError(input);
          return error || true;
        },
      },
    ]);
    componentName = inputName;
  }

  const componentSlug = toSnakeCase(componentName!);

  // Check if component already exists
  const componentPath = path.join(themePath, 'components', `${componentType}s`, componentSlug);

  if (await fs.pathExists(componentPath)) {
    console.error(chalk.red('Error:'), `Component already exists: ${componentPath}`);
    process.exit(1);
  }

  // Get component details via prompts
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'displayName',
      message: 'Display name:',
      default: options.displayName || toTitleCase(componentSlug),
      when: !options.displayName,
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      default: options.description || `A ${componentType} component for the theme`,
      when: !options.description,
    },
    {
      type: 'confirm',
      name: 'withCss',
      message: 'Create CSS file?',
      default: true,
      when: options.withCss === undefined,
    },
    {
      type: 'confirm',
      name: 'withJs',
      message: 'Create JavaScript file?',
      default: false,
      when: options.withJs === undefined,
    },
  ]);

  const componentData = {
    componentName: componentSlug,
    displayName: options.displayName || answers.displayName || toTitleCase(componentSlug),
    description: options.description || answers.description || `A ${componentType} component`,
    author: themeManifest.author,
    withCss: options.withCss !== undefined ? options.withCss : answers.withCss,
    withJs: options.withJs !== undefined ? options.withJs : answers.withJs,
    type: componentType,
  };

  // Create component
  const spinner = ora('Creating component...').start();

  try {
    await createComponent(componentPath, componentData, options.template || 'basic');

    // Update theme manifest
    await updateThemeManifest(themePath, componentType, componentSlug, componentPath);

    spinner.succeed('Component created successfully');

    console.log();
    console.log(chalk.green.bold('✨ Component created!'));
    console.log(chalk.gray('  Path:'), path.relative(themePath, componentPath));
    console.log(chalk.gray('  Type:'), componentType);
    console.log(chalk.gray('  Name:'), componentSlug);
    console.log();
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.gray('  1.'), `Edit template at ${componentSlug}/template.html`);
    console.log(chalk.gray('  2.'), `Configure props in ${componentSlug}/schema.json`);
    if (componentData.withCss) {
      console.log(chalk.gray('  3.'), `Add styles in ${componentSlug}/styles.css`);
    }
    console.log(chalk.gray('  3.'), 'Run `spwig validate` to check your component');
  } catch (error) {
    spinner.fail('Component creation failed');
    console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

/**
 * Create component directory structure and files
 */
async function createComponent(
  componentPath: string,
  data: any,
  template: 'blank' | 'basic' | 'advanced'
): Promise<void> {
  // Create component directory
  await fs.ensureDir(componentPath);

  // Template base path
  const templatesDir = path.join(__dirname, '../templates/components');

  // Create manifest.json
  const manifestTemplate = path.join(templatesDir, `${data.type}.manifest.json.template`);
  const manifestDest = path.join(componentPath, 'manifest.json');

  await writeFromTemplate(manifestTemplate, manifestDest, {
    componentName: data.componentName,
    displayName: data.displayName,
    description: data.description,
    author: data.author,
  });

  // Create template.html based on template type
  let templateSource: string;
  if (template === 'blank') {
    templateSource = path.join(templatesDir, 'blank.template.html.template');
  } else if (template === 'advanced') {
    templateSource = path.join(templatesDir, `${data.type}.advanced.template.html.template`);
  } else {
    templateSource = path.join(templatesDir, `${data.type}.template.html.template`);
  }

  // Fallback to basic if specific template doesn't exist
  if (!(await fs.pathExists(templateSource))) {
    templateSource = path.join(templatesDir, `${data.type}.template.html.template`);
  }

  const templateDest = path.join(componentPath, 'template.html');
  await writeFromTemplate(templateSource, templateDest, {
    componentName: data.componentName,
    displayName: data.displayName,
  });

  // Create schema.json
  const schemaTemplate = path.join(templatesDir, 'schema.json.template');
  const schemaDest = path.join(componentPath, 'schema.json');
  await writeFromTemplate(schemaTemplate, schemaDest, {});

  // Create styles.css if requested
  if (data.withCss) {
    const cssTemplate = path.join(templatesDir, 'styles.css.template');
    const cssDest = path.join(componentPath, 'styles.css');

    if (await fs.pathExists(cssTemplate)) {
      await writeFromTemplate(cssTemplate, cssDest, {
        componentName: data.componentName,
      });
    } else {
      // Create blank CSS file
      await fs.writeFile(
        cssDest,
        `/* Styles for ${data.displayName} */\n\n.${data.componentName} {\n  /* Add your styles here */\n}\n`
      );
    }
  }

  // Create script.js if requested
  if (data.withJs) {
    const jsDest = path.join(componentPath, 'script.js');
    await fs.writeFile(
      jsDest,
      `/**\n * Script for ${data.displayName}\n */\n\n(function() {\n  // Component initialization\n  console.log('${data.displayName} loaded');\n})();\n`
    );
  }

  // Create preview.png placeholder (optional)
  const previewDest = path.join(componentPath, 'preview.png');
  // We won't create an actual image, but mention it in docs
}

/**
 * Update theme manifest to include new bundled component
 */
async function updateThemeManifest(
  themePath: string,
  componentType: ComponentType,
  componentName: string,
  componentPath: string
): Promise<void> {
  const manifestPath = path.join(themePath, 'manifest.json');
  const manifest: ThemeManifest = await fs.readJSON(manifestPath);

  // Initialize bundled_components if it doesn't exist
  if (!manifest.bundled_components) {
    manifest.bundled_components = [];
  }

  // Add new component reference
  const relativePath = path.relative(themePath, componentPath);
  manifest.bundled_components.push({
    type: componentType,
    name: componentName,
    path: relativePath.replace(/\\/g, '/'), // Normalize path separators
  });

  // Write updated manifest
  await fs.writeJSON(manifestPath, manifest, { spaces: 2 });
}
