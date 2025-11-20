/**
 * Package command
 * Creates distributable ZIP packages from themes
 */

import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import archiver from 'archiver';
import crypto from 'crypto';
import { ThemeValidator } from '@spwig/theme-validator';
import type { ThemeManifest } from '@spwig/theme-validator';

export interface PackageOptions {
  output?: string;
  name?: string;
  validate?: boolean;
  checksum?: 'sha256' | 'md5';
}

interface PackageMetadata {
  file_count: number;
  total_size: number;
  checksum: string;
}

interface PackageInfo {
  theme_name: string;
  version: string;
  package_file: string;
  checksum_file: string;
  package_size: number;
  package_checksum: string;
  content_checksum: string;
  file_count: number;
  total_size: number;
  bundled_components: number;
}

export async function packageCommand(themePath: string, options: PackageOptions): Promise<void> {
  console.log(chalk.blue.bold('\n📦 Spwig Theme SDK - Package Theme\n'));

  const absolutePath = path.resolve(themePath);

  // Check if directory exists
  if (!(await fs.pathExists(absolutePath))) {
    console.error(chalk.red('Error:'), `Directory does not exist: ${absolutePath}`);
    process.exit(1);
  }

  // Load manifest
  const manifestPath = path.join(absolutePath, 'manifest.json');
  if (!(await fs.pathExists(manifestPath))) {
    console.error(chalk.red('Error:'), 'No manifest.json found in theme directory');
    process.exit(1);
  }

  let manifest: ThemeManifest;
  try {
    manifest = await fs.readJSON(manifestPath);
  } catch (error) {
    console.error(chalk.red('Error:'), 'Failed to parse manifest.json');
    process.exit(1);
  }

  console.log(chalk.bold('Theme:'), manifest.display_name);
  console.log(chalk.gray('Version:'), manifest.version);
  console.log();

  // Validate theme first (unless --no-validate)
  if (options.validate !== false) {
    const validateSpinner = ora('Validating theme...').start();
    const validator = new ThemeValidator(absolutePath);
    const result = await validator.validate();

    if (!result.isValid) {
      validateSpinner.fail(chalk.red('Validation failed'));
      console.log();
      console.log(chalk.red.bold(`❌ ERRORS (${result.errors.length}):`));
      for (const error of result.errors) {
        console.log(chalk.red('  •'), error.message);
      }
      console.log();
      console.error(chalk.red('Cannot package theme with validation errors'));
      process.exit(1);
    }

    validateSpinner.succeed('Theme validation passed');
  }

  // Determine output path
  const outputDir = options.output ? path.resolve(options.output) : path.join(absolutePath, 'dist');
  await fs.ensureDir(outputDir);

  const packageName = options.name || `${manifest.name}-${manifest.version}.zip`;
  const outputPath = path.join(outputDir, packageName);

  // Create package
  const spinner = ora('Creating package...').start();

  try {
    const packageInfo = await createPackage(absolutePath, outputPath, manifest);
    spinner.succeed('Package created successfully');

    console.log();
    console.log(chalk.green.bold('✨ Package Summary:'));
    console.log(chalk.gray('  Package:'), packageInfo.package_file);
    console.log(chalk.gray('  Size:'), formatBytes(packageInfo.package_size));
    console.log(chalk.gray('  Files:'), packageInfo.file_count);
    console.log(chalk.gray('  Checksum:'), packageInfo.checksum_file);
    console.log(chalk.gray('  Components:'), packageInfo.bundled_components);
    console.log();
    console.log(chalk.green('✅ Theme package ready for distribution!'));
  } catch (error) {
    spinner.fail('Packaging failed');
    console.error(chalk.red('\nError:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

/**
 * Create ZIP package from theme directory
 */
async function createPackage(
  themePath: string,
  outputPath: string,
  manifest: ThemeManifest
): Promise<PackageInfo> {
  // Create temporary build directory
  const buildDir = path.join(path.dirname(outputPath), `build_${manifest.name}_${Date.now()}`);
  await fs.ensureDir(buildDir);

  try {
    // Copy theme to build directory
    await copyToBuildDir(themePath, buildDir);

    // Clean build directory
    await cleanBuildDir(buildDir);

    // Calculate metadata
    const metadata = await calculateMetadata(buildDir);

    // Update manifest with metadata
    await updateManifestWithMetadata(buildDir, metadata);

    // Create ZIP
    await createZip(buildDir, outputPath);

    // Calculate package checksum
    const packageChecksum = await calculateFileChecksum(outputPath);

    // Create checksum file
    const checksumPath = `${outputPath}.sha256`;
    await fs.writeFile(checksumPath, `${packageChecksum}  ${path.basename(outputPath)}\n`);

    // Return package info
    return {
      theme_name: manifest.name,
      version: manifest.version,
      package_file: outputPath,
      checksum_file: checksumPath,
      package_size: (await fs.stat(outputPath)).size,
      package_checksum: packageChecksum,
      content_checksum: metadata.checksum,
      file_count: metadata.file_count,
      total_size: metadata.total_size,
      bundled_components: manifest.bundled_components?.length || 0,
    };
  } finally {
    // Cleanup build directory
    if (await fs.pathExists(buildDir)) {
      await fs.remove(buildDir);
    }
  }
}

/**
 * Copy theme directory to build directory
 */
async function copyToBuildDir(themePath: string, buildDir: string): Promise<void> {
  const ignorePatterns = [
    '__pycache__',
    '*.pyc',
    '.DS_Store',
    '.git',
    '.gitignore',
    'node_modules',
    '.env',
    '*.log',
    'dist',
    'build',
    '.vscode',
    '.idea',
  ];

  await fs.copy(themePath, buildDir, {
    filter: (src) => {
      const basename = path.basename(src);
      return !ignorePatterns.some((pattern) => {
        if (pattern.startsWith('*')) {
          return basename.endsWith(pattern.substring(1));
        }
        return basename === pattern;
      });
    },
  });
}

/**
 * Clean build directory of unwanted files
 */
async function cleanBuildDir(buildDir: string): Promise<void> {
  // Remove Python cache files
  const pycFiles = await findFiles(buildDir, '**/*.pyc');
  for (const file of pycFiles) {
    await fs.remove(file);
  }

  // Remove __pycache__ directories
  const pycacheDirs = await findDirectories(buildDir, '**/__pycache__');
  for (const dir of pycacheDirs) {
    await fs.remove(dir);
  }

  // Remove .DS_Store files (macOS)
  const dsFiles = await findFiles(buildDir, '**/.DS_Store');
  for (const file of dsFiles) {
    await fs.remove(file);
  }
}

/**
 * Calculate package metadata (file count, size, checksum)
 */
async function calculateMetadata(buildDir: string): Promise<PackageMetadata> {
  let fileCount = 0;
  let totalSize = 0;
  const fileHashes: string[] = [];

  const files = await getAllFiles(buildDir);

  for (const file of files) {
    const stats = await fs.stat(file);
    fileCount++;
    totalSize += stats.size;

    // Don't include manifest.json in checksum (will be updated)
    if (path.basename(file) !== 'manifest.json') {
      const hash = await calculateFileChecksum(file);
      fileHashes.push(hash);
    }
  }

  // Calculate overall checksum from sorted file hashes
  const combinedHash = crypto.createHash('sha256');
  for (const hash of fileHashes.sort()) {
    combinedHash.update(hash);
  }

  return {
    file_count: fileCount,
    total_size: totalSize,
    checksum: `sha256:${combinedHash.digest('hex')}`,
  };
}

/**
 * Update manifest.json with package metadata
 */
async function updateManifestWithMetadata(
  buildDir: string,
  metadata: PackageMetadata
): Promise<void> {
  const manifestPath = path.join(buildDir, 'manifest.json');
  const manifest = await fs.readJSON(manifestPath);

  manifest.total_size_bytes = metadata.total_size;
  manifest.file_count = metadata.file_count;
  manifest.checksum = metadata.checksum;

  await fs.writeJSON(manifestPath, manifest, { spaces: 2 });
}

/**
 * Create ZIP package
 */
async function createZip(buildDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', () => resolve());
    archive.on('error', (err) => reject(err));

    archive.pipe(output);

    // Add all files to ZIP (at root level, not in subdirectory)
    archive.directory(buildDir, false);

    archive.finalize();
  });
}

/**
 * Calculate SHA256 checksum of a file
 */
async function calculateFileChecksum(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', reject);
  });
}

/**
 * Get all files recursively
 */
async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function walk(currentPath: string) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

/**
 * Find files matching pattern
 */
async function findFiles(dir: string, pattern: string): Promise<string[]> {
  // Simple implementation - would use glob in production
  const files: string[] = [];
  const extension = pattern.includes('*') ? pattern.split('*')[1] : null;

  async function walk(currentPath: string) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        if (!extension || fullPath.endsWith(extension)) {
          files.push(fullPath);
        }
      }
    }
  }

  await walk(dir);
  return files;
}

/**
 * Find directories matching pattern
 */
async function findDirectories(dir: string, pattern: string): Promise<string[]> {
  const dirs: string[] = [];
  const targetName = pattern.includes('**') ? pattern.split('/').pop() : pattern;

  async function walk(currentPath: string) {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === targetName) {
          dirs.push(fullPath);
        }
        await walk(fullPath);
      }
    }
  }

  await walk(dir);
  return dirs;
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
