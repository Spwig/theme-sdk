#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { validateCommand } from './commands/validate.js';
import { packageCommand } from './commands/package.js';
import { devCommand } from './commands/dev.js';

const program = new Command();

program
  .name('spwig')
  .description('Spwig Theme SDK - Build professional themes for Spwig eCommerce')
  .version('2.0.0');

// spwig init
program
  .command('init [name]')
  .description('Create a new theme')
  .option('-a, --author <name>', 'Author name')
  .option('-e, --email <email>', 'Author email')
  .option('-d, --description <text>', 'Theme description')
  .option('-l, --license <type>', 'License type', 'MIT')
  .option('-t, --template <name>', 'Use template (basic, standard, complete)', 'standard')
  .option('--primary-color <hex>', 'Primary color hex (e.g., #2563eb)')
  .action(async (name, options) => {
    try {
      await initCommand(name, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// spwig validate
program
  .command('validate [path]')
  .description('Validate theme package')
  .option('-v, --verbose', 'Show detailed validation output')
  .action(async (path, options) => {
    try {
      const exitCode = await validateCommand(path || process.cwd(), options);
      process.exit(exitCode);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// spwig package
program
  .command('package')
  .description('Create distributable theme package')
  .option('-o, --output <path>', 'Output directory', 'dist')
  .option('-n, --name <filename>', 'Custom package name')
  .option('--no-validate', 'Skip validation before packaging')
  .option('-c, --checksum <algo>', 'Checksum algorithm (sha256, md5)', 'sha256')
  .action(async (options) => {
    try {
      await packageCommand(process.cwd(), options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// spwig dev
program
  .command('dev [path]')
  .description('Start development server with hot reload')
  .requiredOption('-s, --shop <url>', 'Spwig shop URL (e.g., http://localhost:8000)')
  .option('-p, --port <port>', 'Local port for dev server', '3000')
  .option('--no-open', 'Do not open browser automatically')
  .option('-v, --verbose', 'Enable verbose logging')
  .action(async (path, options) => {
    try {
      await devCommand(path || process.cwd(), options);
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
// Global error handler
process.on('uncaughtException', (error) => {
  console.error(chalk.red('Uncaught Exception:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('Unhandled Rejection:'), reason);
  process.exit(1);
});

program.parse();
