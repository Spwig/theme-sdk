import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import {
  directoryExists,
  ensureDirectory,
  writeFromTemplate,
} from '../utils/file-system.js';
import {
  isValidThemeName,
  toKebabCase,
  toTitleCase,
  getThemeNameError,
  isValidEmail,
} from '../utils/validation.js';

export interface InitOptions {
  author?: string;
  email?: string;
  description?: string;
  license?: string;
  git?: boolean;
  template?: 'blank' | 'minimal' | 'full';
}

/**
 * Initialize a new Spwig theme (v2.0 architecture)
 *
 * Theme v2.0 is token-driven: the primary deliverable is tokens.json
 * which controls all visual aspects of the storefront. Themes no longer
 * bundle components or page schemas.
 */
export async function initCommand(themeName: string | undefined, options: InitOptions): Promise<void> {
  console.log(chalk.blue.bold('\n  Spwig Theme SDK v2.0 - Create New Theme\n'));

  // Get theme name
  let finalThemeName = themeName;
  if (!finalThemeName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Theme name (lowercase, hyphens):',
        validate: (input: string) => {
          const error = getThemeNameError(input);
          return error || true;
        },
      },
    ]);
    finalThemeName = name;
  } else {
    // Validate provided name
    const error = getThemeNameError(finalThemeName);
    if (error) {
      throw new Error(`Invalid theme name: ${error}`);
    }
  }

  const themeSlug = toKebabCase(finalThemeName!);
  const themePath = path.join(process.cwd(), themeSlug);

  // Check if directory already exists
  if (await directoryExists(themePath)) {
    throw new Error(`Directory ${themeSlug} already exists`);
  }

  // Get other theme details
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'displayName',
      message: 'Display name:',
      default: toTitleCase(themeSlug),
      validate: (input: string) => (input.length > 0 ? true : 'Display name is required'),
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name:',
      default: options.author,
      validate: (input: string) => (input.length > 0 ? true : 'Author name is required'),
    },
    {
      type: 'input',
      name: 'email',
      message: 'Author email:',
      default: options.email,
      validate: (input: string) => {
        if (!input) return true; // Email is optional
        return isValidEmail(input) ? true : 'Invalid email address';
      },
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      default: options.description || `A modern theme for Spwig eCommerce`,
      validate: (input: string) =>
        input.length >= 10 ? true : 'Description must be at least 10 characters',
    },
    {
      type: 'input',
      name: 'primaryColor',
      message: 'Primary color (hex):',
      default: '#2563eb',
      validate: (input: string) => /^#[0-9a-fA-F]{6}$/.test(input) ? true : 'Must be a valid hex color (e.g. #2563eb)',
    },
    {
      type: 'input',
      name: 'primaryHoverColor',
      message: 'Primary hover color (hex):',
      default: '#1d4ed8',
      validate: (input: string) => /^#[0-9a-fA-F]{6}$/.test(input) ? true : 'Must be a valid hex color (e.g. #1d4ed8)',
    },
    {
      type: 'list',
      name: 'license',
      message: 'License:',
      choices: ['MIT', 'Apache-2.0', 'GPL-3.0', 'Proprietary'],
      default: options.license || 'MIT',
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize git repository?',
      default: options.git !== false,
    },
  ]);

  const spinner = ora('Creating theme...').start();

  try {
    // Create theme directory structure
    await createThemeStructure(themePath, {
      themeName: themeSlug,
      displayName: answers.displayName,
      author: answers.author,
      email: answers.email,
      description: answers.description,
      license: answers.license,
      primaryColor: answers.primaryColor,
      primaryHoverColor: answers.primaryHoverColor,
      template: options.template || 'full',
    });

    spinner.succeed(chalk.green('Theme created successfully!'));

    // Show created structure
    console.log(chalk.blue('\n  Theme structure:\n'));
    console.log(chalk.dim(`  ${themeSlug}/`));
    console.log(chalk.dim('  \u251c\u2500\u2500 manifest.json'));
    console.log(chalk.dim('  \u251c\u2500\u2500 tokens.json'));
    console.log(chalk.dim('  \u251c\u2500\u2500 presets/'));
    console.log(chalk.dim('  \u2502   \u251c\u2500\u2500 header.json'));
    console.log(chalk.dim('  \u2502   \u2514\u2500\u2500 footer.json'));
    console.log(chalk.dim('  \u251c\u2500\u2500 css/'));
    console.log(chalk.dim('  \u2502   \u2514\u2500\u2500 theme.css'));
    console.log(chalk.dim('  \u2514\u2500\u2500 README.md'));

    // Show next steps
    console.log(chalk.blue('\n  Next steps:\n'));
    console.log(chalk.white(`  cd ${themeSlug}`));
    console.log(chalk.white('  spwig dev'));
    console.log(chalk.dim("\n  Edit tokens.json to customize your theme's appearance."));
    console.log(chalk.dim('  Visit http://localhost:3000 to preview your theme.\n'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create theme'));
    throw error;
  }
}

/**
 * Create theme directory structure for v2.0
 *
 * v2.0 themes consist of:
 * - manifest.json: Theme metadata
 * - tokens.json: Complete design token set (the main deliverable)
 * - presets/header.json: Default header layout configuration
 * - presets/footer.json: Default footer layout configuration
 * - css/theme.css: Optional custom CSS overrides
 * - README.md: Theme documentation
 */
async function createThemeStructure(
  themePath: string,
  config: {
    themeName: string;
    displayName: string;
    author: string;
    email?: string;
    description: string;
    license: string;
    primaryColor: string;
    primaryHoverColor: string;
    template: 'blank' | 'minimal' | 'full';
  }
): Promise<void> {
  const {
    themeName,
    displayName,
    author,
    description,
    license,
    primaryColor,
    primaryHoverColor,
    template,
  } = config;

  // Create base directory
  await ensureDirectory(themePath);

  // Template variables for all templates
  const variables: Record<string, string> = {
    themeName,
    displayName,
    author,
    description,
    license,
    primaryColor,
    primaryHoverColor,
    year: new Date().getFullYear().toString(),
  };

  // Get templates directory
  const templatesDir = path.join(__dirname, '../templates');

  // Always create manifest.json
  await writeFromTemplate(
    path.join(templatesDir, 'theme/manifest.json.template'),
    path.join(themePath, 'manifest.json'),
    variables
  );

  // Always create README.md
  await writeFromTemplate(
    path.join(templatesDir, 'theme/README.md.template'),
    path.join(themePath, 'README.md'),
    variables
  );

  // Create .gitignore
  const fs = await import('fs-extra');
  await fs.writeFile(
    path.join(themePath, '.gitignore'),
    `node_modules/\ndist/\n*.log\n.DS_Store\nThumbs.db\n`
  );

  if (template === 'blank') {
    // Blank template: manifest + README only
    return;
  }

  // Minimal and full: include tokens.json
  await writeFromTemplate(
    path.join(templatesDir, 'theme/tokens.json.template'),
    path.join(themePath, 'tokens.json'),
    variables
  );

  if (template === 'minimal') {
    // Minimal: tokens + empty presets and css directories
    await ensureDirectory(path.join(themePath, 'presets'));
    await ensureDirectory(path.join(themePath, 'css'));
    return;
  }

  // Full template: complete structure with presets and starter CSS

  // Create presets
  await ensureDirectory(path.join(themePath, 'presets'));
  await writeFromTemplate(
    path.join(templatesDir, 'presets/header.json.template'),
    path.join(themePath, 'presets/header.json'),
    variables
  );
  await writeFromTemplate(
    path.join(templatesDir, 'presets/footer.json.template'),
    path.join(themePath, 'presets/footer.json'),
    variables
  );

  // Create CSS directory with starter theme.css
  await ensureDirectory(path.join(themePath, 'css'));
  const starterCSS = `/* ${displayName} - Custom CSS Overrides */
/* 
 * This file is loaded after token-generated styles.
 * Use it for advanced customizations that go beyond design tokens.
 *
 * Token-generated CSS variables are available as:
 *   --theme-color-primary, --theme-color-secondary, etc.
 *   --theme-font-size-base, --theme-font-family-body, etc.
 *   --theme-space-4, --theme-radius-md, etc.
 *
 * See tokens.json for the complete list of available tokens.
 */
`;
  await fs.writeFile(path.join(themePath, 'css/theme.css'), starterCSS);
}
