import fs from 'fs-extra';
import path from 'path';

/**
 * Check if a directory exists
 */
export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(filePath);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * Ensure directory exists, create if it doesn't
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

/**
 * Read JSON file
 */
export async function readJSON<T = any>(filePath: string): Promise<T> {
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Write JSON file with formatting
 */
export async function writeJSON(filePath: string, data: any): Promise<void> {
  await fs.writeJSON(filePath, data, { spaces: 2 });
}

/**
 * Copy file
 */
export async function copyFile(source: string, destination: string): Promise<void> {
  await fs.copy(source, destination);
}

/**
 * Copy directory recursively
 */
export async function copyDirectory(source: string, destination: string): Promise<void> {
  await fs.copy(source, destination);
}

/**
 * Read template file and replace placeholders
 */
export async function readTemplate(
  templatePath: string,
  variables: Record<string, string>
): Promise<string> {
  let content = await fs.readFile(templatePath, 'utf-8');

  // Replace {{variable}} placeholders
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    content = content.replace(regex, value);
  }

  return content;
}

/**
 * Write file from template
 */
export async function writeFromTemplate(
  templatePath: string,
  outputPath: string,
  variables: Record<string, string>
): Promise<void> {
  const content = await readTemplate(templatePath, variables);
  await fs.writeFile(outputPath, content, 'utf-8');
}

/**
 * Get all files in directory recursively
 */
export async function getFilesRecursively(dirPath: string): Promise<string[]> {
  const files: string[] = [];

  async function scan(currentPath: string): Promise<void> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        await scan(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  await scan(dirPath);
  return files;
}

/**
 * Calculate file size
 */
export async function getFileSize(filePath: string): Promise<number> {
  const stats = await fs.stat(filePath);
  return stats.size;
}

/**
 * Calculate directory size
 */
export async function getDirectorySize(dirPath: string): Promise<number> {
  const files = await getFilesRecursively(dirPath);
  let totalSize = 0;

  for (const file of files) {
    totalSize += await getFileSize(file);
  }

  return totalSize;
}
