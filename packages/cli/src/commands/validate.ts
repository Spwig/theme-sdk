/**
 * Validate command
 * Validates theme or component packages
 */

import chalk from 'chalk';
import ora, { Ora } from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { ThemeValidator, ComponentValidator } from '@spwig/theme-validator';

export interface ValidateOptions {
  type?: 'theme' | 'component';
  verbose?: boolean;
}

export async function validateCommand(targetPath: string = '.', options: ValidateOptions): Promise<number> {
  console.log(chalk.blue.bold('\n🔍 Spwig Theme SDK - Validate Package\n'));

  const absolutePath = path.resolve(targetPath);

  // Check if directory exists
  if (!(await fs.pathExists(absolutePath))) {
    console.error(chalk.red('Error:'), `Directory does not exist: ${absolutePath}`);
    return 1;
  }

  // Auto-detect type if not specified
  let type = options.type;
  if (!type) {
    const spinner = ora('Auto-detecting package type...').start();
    type = await detectPackageType(absolutePath);
    spinner.succeed(`Detected ${type} package`);
  }

  console.log(chalk.gray('Path:'), absolutePath);
  console.log(chalk.gray('Type:'), type);
  console.log();

  // Run validation
  const spinner = ora(`Validating ${type}...`).start();

  try {
    if (type === 'theme') {
      return await validateTheme(absolutePath, options.verbose || false, spinner);
    } else {
      return await validateComponent(absolutePath, options.verbose || false, spinner);
    }
  } catch (error) {
    spinner.fail('Validation failed with error');
    console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
    return 1;
  }
}

/**
 * Auto-detect package type (theme or component)
 */
async function detectPackageType(packagePath: string): Promise<'theme' | 'component'> {
  const manifestPath = path.join(packagePath, 'manifest.json');

  if (!(await fs.pathExists(manifestPath))) {
    console.error(chalk.red('Error:'), 'No manifest.json found');
    process.exit(1);
  }

  try {
    const manifest = await fs.readJSON(manifestPath);

    // Theme packages have bundled_components or page_schemas
    if (manifest.bundled_components || manifest.page_schemas || manifest.design_tokens) {
      return 'theme';
    }

    // Component packages have tier_compatibility and regions
    if (manifest.tier_compatibility || manifest.regions) {
      return 'component';
    }

    // Default to theme if unclear
    return 'theme';
  } catch (error) {
    console.error(chalk.red('Error:'), 'Failed to parse manifest.json');
    process.exit(1);
  }
}

/**
 * Validate theme package
 */
async function validateTheme(themePath: string, verbose: boolean, spinner: Ora): Promise<number> {
  const validator = new ThemeValidator(themePath);
  const result = await validator.validate();

  if (result.isValid) {
    spinner.succeed(chalk.green('✅ Theme validation passed!'));
  } else {
    spinner.fail(chalk.red('❌ Theme validation failed'));
  }

  console.log();

  // Show theme info
  if (result.themeInfo) {
    console.log(chalk.bold('Theme Information:'));
    console.log(chalk.gray('  Name:'), result.themeInfo.display_name);
    console.log(chalk.gray('  ID:'), result.themeInfo.name);
    console.log(chalk.gray('  Version:'), result.themeInfo.version);
    console.log(chalk.gray('  Author:'), result.themeInfo.author);

    if (result.themeInfo.bundled_components) {
      console.log(
        chalk.gray('  Components:'),
        result.themeInfo.bundled_components.length
      );
    }
    console.log();
  }

  // Show errors
  if (result.errors.length > 0) {
    console.log(chalk.red.bold(`❌ ERRORS (${result.errors.length}):`));
    for (const error of result.errors) {
      console.log(chalk.red('  •'), error.message);
      if (verbose && error.path) {
        console.log(chalk.gray(`    Path: ${error.path}`));
      }
    }
    console.log();
  }

  // Show warnings
  if (result.warnings.length > 0) {
    console.log(chalk.yellow.bold(`⚠️  WARNINGS (${result.warnings.length}):`));
    for (const warning of result.warnings) {
      console.log(chalk.yellow('  •'), warning.message);
      if (warning.suggestion) {
        console.log(chalk.gray(`    💡 ${warning.suggestion}`));
      }
      if (verbose && warning.path) {
        console.log(chalk.gray(`    Path: ${warning.path}`));
      }
    }
    console.log();
  }

  // Summary
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(chalk.green('✨ No errors or warnings found!'));
    console.log(chalk.gray('Your theme is ready to package.'));
    return 0;
  } else if (result.errors.length === 0) {
    console.log(chalk.yellow('⚠️  Validation passed with warnings'));
    console.log(chalk.gray('Consider addressing warnings before packaging'));
    return 0;
  } else {
    console.log(chalk.red('❌ Validation failed'));
    console.log(chalk.gray('Please fix errors before packaging'));
    return 1;
  }
}

/**
 * Validate component package
 */
async function validateComponent(
  componentPath: string,
  verbose: boolean,
  spinner: Ora
): Promise<number> {
  const validator = new ComponentValidator(componentPath);
  const result = await validator.validate();

  if (result.isValid) {
    spinner.succeed(chalk.green('✅ Component validation passed!'));
  } else {
    spinner.fail(chalk.red('❌ Component validation failed'));
  }

  console.log();

  // Show component info
  if (result.componentInfo) {
    console.log(chalk.bold('Component Information:'));
    console.log(chalk.gray('  Name:'), result.componentInfo.display_name);
    console.log(chalk.gray('  ID:'), result.componentInfo.name);
    console.log(chalk.gray('  Version:'), result.componentInfo.version);
    console.log(chalk.gray('  Author:'), result.componentInfo.author);
    console.log(chalk.gray('  Category:'), result.componentInfo.category);
    console.log(
      chalk.gray('  Tiers:'),
      result.componentInfo.tier_compatibility.join(', ')
    );
    console.log();
  }

  // Show errors
  if (result.errors.length > 0) {
    console.log(chalk.red.bold(`❌ ERRORS (${result.errors.length}):`));
    for (const error of result.errors) {
      console.log(chalk.red('  •'), error.message);
      if (verbose && error.path) {
        console.log(chalk.gray(`    Path: ${error.path}`));
      }
    }
    console.log();
  }

  // Show warnings
  if (result.warnings.length > 0) {
    console.log(chalk.yellow.bold(`⚠️  WARNINGS (${result.warnings.length}):`));
    for (const warning of result.warnings) {
      console.log(chalk.yellow('  •'), warning.message);
      if (warning.suggestion) {
        console.log(chalk.gray(`    💡 ${warning.suggestion}`));
      }
      if (verbose && warning.path) {
        console.log(chalk.gray(`    Path: ${warning.path}`));
      }
    }
    console.log();
  }

  // Summary
  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(chalk.green('✨ No errors or warnings found!'));
    console.log(chalk.gray('Your component is ready to use.'));
    return 0;
  } else if (result.errors.length === 0) {
    console.log(chalk.yellow('⚠️  Validation passed with warnings'));
    console.log(chalk.gray('Consider addressing warnings for best practices'));
    return 0;
  } else {
    console.log(chalk.red('❌ Validation failed'));
    console.log(chalk.gray('Please fix errors before using this component'));
    return 1;
  }
}
