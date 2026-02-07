/**
 * Validate command
 * Validates theme packages
 */

import chalk from 'chalk';
import ora, { Ora } from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { ThemeValidator } from '@spwig/theme-validator';

export interface ValidateOptions {
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

  // Verify manifest.json exists
  const manifestPath = path.join(absolutePath, 'manifest.json');
  if (!(await fs.pathExists(manifestPath))) {
    console.error(chalk.red('Error:'), 'No manifest.json found');
    return 1;
  }

  console.log(chalk.gray('Path:'), absolutePath);
  console.log(chalk.gray('Type:'), 'theme');
  console.log();

  // Run validation
  const spinner = ora('Validating theme...').start();

  try {
    return await validateTheme(absolutePath, options.verbose || false, spinner);
  } catch (error) {
    spinner.fail('Validation failed with error');
    console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
    return 1;
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

