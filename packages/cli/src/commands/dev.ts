/**
 * Development server command for Spwig Theme SDK
 *
 * Connects to a running Spwig shop for live theme development with hot reload.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import chokidar from 'chokidar';
import open from 'open';

interface DevOptions {
  shop: string;
  port?: number;
  open?: boolean;
  verbose?: boolean;
}

interface DevSession {
  token: string;
  expires_at: string;
  theme_dev_url: string;
  message: string;
}

interface SyncResult {
  success: boolean;
  synced: string[];
  errors: string[];
  reload_type: string;
}

interface FileChange {
  path: string;
  content: string;
  checksum: string;
  encoding: 'utf-8' | 'base64';
}

// File extensions that should be encoded as base64
const BINARY_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.woff', '.woff2', '.ico', '.gif'];

export async function devCommand(themePath: string, options: DevOptions): Promise<void> {
  const spinner = ora();
  let session: DevSession | null = null;
  let watcher: chokidar.FSWatcher | null = null;

  // Cleanup handler
  const cleanup = async () => {
    if (watcher) {
      await watcher.close();
    }
    if (session) {
      await disconnectSession(options.shop, session.token, spinner);
    }
  };

  // Handle process termination
  process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n\nShutting down dev server...'));
    await cleanup();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await cleanup();
    process.exit(0);
  });

  try {
    // Resolve theme path
    const absoluteThemePath = path.resolve(themePath || process.cwd());

    // Check theme exists
    const manifestPath = path.join(absoluteThemePath, 'manifest.json');
    if (!await fileExists(manifestPath)) {
      console.error(chalk.red('Error: manifest.json not found. Are you in a theme directory?'));
      process.exit(1);
    }

    // Read theme manifest
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    const themeName = manifest.name || 'Unknown Theme';

    console.log(chalk.blue(`\n🚀 Spwig Theme SDK v2.0 - Dev Server\n`));
    console.log(`Theme: ${chalk.bold(themeName)}`);
    console.log(`Shop: ${chalk.cyan(options.shop)}\n`);

    // Connect to shop
    spinner.start('Connecting to shop...');
    session = await connectToShop(options.shop, themeName, absoluteThemePath, options);
    spinner.succeed(`Connected as ${chalk.green(session.message)}`);

    // Initial sync
    spinner.start('Syncing theme files...');
    const files = await collectThemeFiles(absoluteThemePath);
    const syncResult = await syncFiles(options.shop, session.token, files);

    if (syncResult.success) {
      spinner.succeed(`Synced ${chalk.green(syncResult.synced.length)} files`);
    } else {
      spinner.warn(`Synced with ${chalk.yellow(syncResult.errors.length)} errors`);
      syncResult.errors.forEach(err => console.log(chalk.red(`  - ${err}`)));
    }

    // Validate theme
    spinner.start('Validating theme...');
    const validation = await validateTheme(options.shop, session.token);

    if (validation.is_valid) {
      spinner.succeed('Theme validation passed');
    } else {
      spinner.warn(`Validation: ${chalk.yellow(validation.error_count)} errors, ${chalk.yellow(validation.warning_count)} warnings`);
      validation.errors.forEach((err: string) => console.log(chalk.red(`  ✗ ${err}`)));
      validation.warnings.forEach((warn: string) => console.log(chalk.yellow(`  ⚠ ${warn}`)));
    }

    // Get preview URL
    const previewUrl = `${options.shop}${session.theme_dev_url}`;

    console.log(chalk.green(`\n✓ Dev server ready!\n`));
    console.log(`Preview: ${chalk.cyan(previewUrl)}`);
    console.log(`Watch: ${chalk.dim('Watching for file changes...')}\n`);

    // Open browser if requested
    if (options.open !== false) {
      await open(previewUrl);
    }

    // Start file watcher
    watcher = chokidar.watch(absoluteThemePath, {
      ignored: [
        /(^|[\/\\])\../,  // Ignore dotfiles
        '**/node_modules/**',
        '**/dist/**',
        '**/*.log',
      ],
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 100,
        pollInterval: 50,
      },
    });

    // Track pending changes for debouncing
    let pendingChanges: Map<string, NodeJS.Timeout> = new Map();
    const DEBOUNCE_MS = 200;

    const handleChange = async (filePath: string) => {
      const relativePath = path.relative(absoluteThemePath, filePath);

      // Clear existing timeout for this file
      const existingTimeout = pendingChanges.get(relativePath);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }

      // Set new debounced timeout
      pendingChanges.set(relativePath, setTimeout(async () => {
        pendingChanges.delete(relativePath);

        try {
          const content = await fs.readFile(filePath);
          const ext = path.extname(filePath).toLowerCase();
          const isBinary = BINARY_EXTENSIONS.includes(ext);

          const file: FileChange = {
            path: relativePath,
            content: isBinary ? content.toString('base64') : content.toString('utf-8'),
            checksum: crypto.createHash('sha256').update(content).digest('hex'),
            encoding: isBinary ? 'base64' : 'utf-8',
          };

          const result = await syncFiles(options.shop, session!.token, [file]);

          if (result.success) {
            const icon = result.reload_type === 'css' ? '🎨' : '🔄';
            console.log(`${icon} ${chalk.dim(relativePath)} ${chalk.green('synced')}`);
          } else {
            console.log(`${chalk.red('✗')} ${chalk.dim(relativePath)} ${chalk.red('failed')}`);
            result.errors.forEach(err => console.log(chalk.red(`    ${err}`)));
          }
        } catch (err) {
          console.log(`${chalk.red('✗')} ${chalk.dim(relativePath)} ${chalk.red('read error')}`);
        }
      }, DEBOUNCE_MS));
    };

    watcher
      .on('change', handleChange)
      .on('add', handleChange)
      .on('unlink', (filePath) => {
        const relativePath = path.relative(absoluteThemePath, filePath);
        console.log(`${chalk.yellow('⊖')} ${chalk.dim(relativePath)} ${chalk.yellow('deleted')}`);
        // TODO: Send delete event to shop
      });

    // Keep process running
    console.log(chalk.dim('Press Ctrl+C to stop\n'));

    // Keep alive
    await new Promise(() => {});

  } catch (error) {
    spinner.fail('Dev server failed');
    await cleanup();

    if (error instanceof Error) {
      console.error(chalk.red(`\nError: ${error.message}`));
      if (options.verbose) {
        console.error(error.stack);
      }
    }
    process.exit(1);
  }
}

async function connectToShop(
  shopUrl: string,
  themeName: string,
  themePath: string,
  options: DevOptions
): Promise<DevSession> {
  // Prompt for credentials
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
        resolve(answer);
      });
    });
  };

  console.log(chalk.dim('\nEnter admin credentials:'));
  const username = await question('Username: ');

  // Use muted input for password (or prompt without echo)
  process.stdout.write('Password: ');
  const password = await new Promise<string>((resolve) => {
    let pwd = '';
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (char) => {
      const c = char.toString();
      if (c === '\n' || c === '\r') {
        process.stdin.setRawMode(false);
        process.stdout.write('\n');
        resolve(pwd);
      } else if (c === '\u007f') {
        // Backspace
        pwd = pwd.slice(0, -1);
      } else {
        pwd += c;
      }
    });
  });

  rl.close();

  // Connect to shop
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch(`${shopUrl}/api/theme-dev/connect/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: JSON.stringify({
      theme_name: themeName,
      theme_path: themePath,
      client_info: {
        cli_version: '2.0.0',
        node_version: process.version,
        os: process.platform,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText })) as { error?: string };
    throw new Error(error.error || `Connection failed: ${response.status}`);
  }

  return response.json() as Promise<DevSession>;
}

async function disconnectSession(shopUrl: string, token: string, spinner: Ora): Promise<void> {
  try {
    spinner.start('Disconnecting...');
    await fetch(`${shopUrl}/api/theme-dev/disconnect/`, {
      method: 'POST',
      headers: {
        'X-Dev-Token': token,
      },
    });
    spinner.succeed('Disconnected');
  } catch {
    spinner.warn('Failed to disconnect cleanly');
  }
}

async function collectThemeFiles(themePath: string): Promise<FileChange[]> {
  const files: FileChange[] = [];

  const walk = async (dir: string): Promise<void> => {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(themePath, fullPath);

      // Skip ignored files/directories
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') {
        continue;
      }

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        const content = await fs.readFile(fullPath);
        const ext = path.extname(entry.name).toLowerCase();
        const isBinary = BINARY_EXTENSIONS.includes(ext);

        files.push({
          path: relativePath,
          content: isBinary ? content.toString('base64') : content.toString('utf-8'),
          checksum: crypto.createHash('sha256').update(content).digest('hex'),
          encoding: isBinary ? 'base64' : 'utf-8',
        });
      }
    }
  };

  await walk(themePath);
  return files;
}

async function syncFiles(shopUrl: string, token: string, files: FileChange[]): Promise<SyncResult> {
  const response = await fetch(`${shopUrl}/api/theme-dev/sync/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Dev-Token': token,
    },
    body: JSON.stringify({ files }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText })) as { error?: string };
    throw new Error(error.error || `Sync failed: ${response.status}`);
  }

  return response.json() as Promise<SyncResult>;
}

async function validateTheme(shopUrl: string, token: string): Promise<{
  is_valid: boolean;
  errors: string[];
  warnings: string[];
  error_count: number;
  warning_count: number;
}> {
  const response = await fetch(`${shopUrl}/api/theme-dev/validate/`, {
    method: 'GET',
    headers: {
      'X-Dev-Token': token,
    },
  });

  if (!response.ok) {
    throw new Error(`Validation request failed: ${response.status}`);
  }

  return response.json() as Promise<{
    is_valid: boolean;
    errors: string[];
    warnings: string[];
    error_count: number;
    warning_count: number;
  }>;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
