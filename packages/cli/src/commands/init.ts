import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import {
  directoryExists,
  ensureDirectory,
  writeFromTemplate,
  writeJSON,
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
 * Initialize a new theme
 */
export async function initCommand(themeName: string | undefined, options: InitOptions): Promise<void> {
  console.log(chalk.blue.bold('\n🎨 Spwig Theme SDK - Create New Theme\n'));

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
      template: options.template || 'full',
    });

    spinner.succeed(chalk.green('Theme created successfully!'));

    // Show next steps
    console.log(chalk.blue('\n📦 Next steps:\n'));
    console.log(chalk.white(`  cd ${themeSlug}`));
    console.log(chalk.white(`  spwig dev`));
    console.log(chalk.dim('\n  Visit http://localhost:3000 to see your theme\n'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create theme'));
    throw error;
  }
}

/**
 * Create theme directory structure
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
    template: 'blank' | 'minimal' | 'full';
  }
): Promise<void> {
  const { themeName, displayName, author, description, license, template } = config;

  // Create base directories
  await ensureDirectory(themePath);

  // Template variables
  const variables = {
    themeName,
    displayName,
    author,
    description,
    license,
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
  const gitignoreContent = `node_modules/
dist/
*.log
.DS_Store
Thumbs.db
`;
  await ensureDirectory(themePath);
  const fs = await import('fs-extra');
  await fs.writeFile(path.join(themePath, '.gitignore'), gitignoreContent);

  if (template === 'blank') {
    // Blank template - just manifest and README
    return;
  }

  // Minimal and full templates include design tokens
  await writeFromTemplate(
    path.join(templatesDir, 'theme/design_tokens.json.template'),
    path.join(themePath, 'design_tokens.json'),
    variables
  );

  if (template === 'minimal') {
    // Minimal template - basic structure only
    await ensureDirectory(path.join(themePath, 'components'));
    await ensureDirectory(path.join(themePath, 'pages'));
    await ensureDirectory(path.join(themePath, 'assets'));
    return;
  }

  // Full template - complete structure with default components

  // Create components
  await createDefaultComponent(themePath, 'header', 'default_header', 'Default Header', variables);
  await createDefaultComponent(themePath, 'footer', 'default_footer', 'Default Footer', variables);
  await createDefaultComponent(
    themePath,
    'section',
    'hero_section',
    'Hero Section',
    variables
  );

  // Create pages directory with basic schemas
  await ensureDirectory(path.join(themePath, 'pages'));
  const pagesDir = path.join(themePath, 'pages');

  // Home page schema
  await writeJSON(path.join(pagesDir, 'home.json'), {
    page_type: 'home',
    sections: [
      {
        type: 'hero_section',
        settings: {
          title: 'Welcome to Your Store',
          description: 'Discover our amazing products',
        },
      },
    ],
  });

  // Product page schema
  await writeJSON(path.join(pagesDir, 'product.json'), {
    page_type: 'product',
    sections: [],
  });

  // Collection page schema
  await writeJSON(path.join(pagesDir, 'collection.json'), {
    page_type: 'collection',
    sections: [],
  });

  // Cart page schema
  await writeJSON(path.join(pagesDir, 'cart.json'), {
    page_type: 'cart',
    sections: [],
  });

  // Create assets directory
  await ensureDirectory(path.join(themePath, 'assets/styles'));
  await ensureDirectory(path.join(themePath, 'assets/scripts'));
  await ensureDirectory(path.join(themePath, 'assets/images'));

  // Create global CSS
  const globalCSS = `/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--body-font);
  font-size: var(--base-size);
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
`;
  await fs.writeFile(path.join(themePath, 'assets/styles/global.css'), globalCSS);

  // Create theme.js
  await writeFromTemplate(
    path.join(templatesDir, 'assets/theme.js.template'),
    path.join(themePath, 'assets/theme.js'),
    variables
  );

  // Create placeholder logo
  await writeFromTemplate(
    path.join(templatesDir, 'assets/logo.svg.template'),
    path.join(themePath, 'assets/images/logo.svg'),
    variables
  );

  // Create page templates directory
  const templatesPath = path.join(themePath, 'templates');
  await ensureDirectory(templatesPath);

  // Layout template
  await writeFromTemplate(
    path.join(templatesDir, 'pages/layout.html.template'),
    path.join(templatesPath, 'layout.html'),
    variables
  );

  // Home page template
  await writeFromTemplate(
    path.join(templatesDir, 'pages/home.html.template'),
    path.join(templatesPath, 'home.html'),
    variables
  );

  // Product page template
  await writeFromTemplate(
    path.join(templatesDir, 'pages/product.html.template'),
    path.join(templatesPath, 'product.html'),
    variables
  );

  // Collection page template
  await writeFromTemplate(
    path.join(templatesDir, 'pages/collection.html.template'),
    path.join(templatesPath, 'collection.html'),
    variables
  );

  // Cart page template
  await writeFromTemplate(
    path.join(templatesDir, 'pages/cart.html.template'),
    path.join(templatesPath, 'cart.html'),
    variables
  );
}

/**
 * Create a default component
 */
async function createDefaultComponent(
  themePath: string,
  type: string,
  name: string,
  displayName: string,
  variables: Record<string, string>
): Promise<void> {
  const componentDir = path.join(themePath, `components/${type}s/${name}`);
  await ensureDirectory(componentDir);

  const templatesDir = path.join(__dirname, '../templates/components');

  const componentVars = {
    ...variables,
    componentName: name,
    displayName: displayName,
    description: `${displayName} component`,
  };

  // Manifest
  await writeFromTemplate(
    path.join(templatesDir, `${type}.manifest.json.template`),
    path.join(componentDir, 'manifest.json'),
    componentVars
  );

  // Template
  await writeFromTemplate(
    path.join(templatesDir, `${type}.template.html.template`),
    path.join(componentDir, 'template.html'),
    componentVars
  );

  // Schema
  await writeFromTemplate(
    path.join(templatesDir, `${type}.schema.json.template`),
    path.join(componentDir, 'schema.json'),
    componentVars
  );

  // Styles
  await writeFromTemplate(
    path.join(templatesDir, `${type}.styles.css.template`),
    path.join(componentDir, 'styles.css'),
    componentVars
  );
}
