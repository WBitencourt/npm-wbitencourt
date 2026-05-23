import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilCommands: Record<string, string> = {
  'util-array': 'array',
  'util-blob': 'blob',
  'util-classname': 'classname',
  'util-dom': 'dom',
  'util-file': 'file',
  'util-mask': 'mask',
  'util-object': 'object',
  'util-picklist': 'picklist',
  'util-string': 'string',
  'util-tailwind': 'tailwind',
  'util-validation': 'validation',
};

async function getTemplatesRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../templates');

  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  return path.resolve(__dirname, '../../../../packages/util/src');
}

async function copyUtilDirectory(templatesRoot: string, utilDir: string, destRoot: string) {
  const from = path.join(templatesRoot, utilDir);
  const to = path.join(destRoot, 'src/util', utilDir);

  if (!await fs.pathExists(from)) {
    throw new Error(`Utility template "${utilDir}" was not found.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing src/util/${utilDir}.`);
  }

  await fs.copy(from, to);
  console.log(chalk.green(`${utilDir} copied to src/util/${utilDir}`));
}

async function getTemplateDirectories(templatesRoot: string) {
  const utilDirs = await fs.readdir(templatesRoot);
  const directories: string[] = [];

  for (const dir of utilDirs) {
    const from = path.join(templatesRoot, dir);
    const stat = await fs.stat(from);

    if (stat.isDirectory()) directories.push(dir);
  }

  return directories;
}

async function ensureDestinationIsAvailable(destRoot: string, utilDir: string) {
  const to = path.join(destRoot, 'src/util', utilDir);

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing src/util/${utilDir}.`);
  }
}

export async function addToClient(command: string) {
  const templatesRoot = await getTemplatesRoot();
  const destRoot = process.cwd();
  const utilDir = utilCommands[command];

  if (utilDir) {
    await copyUtilDirectory(templatesRoot, utilDir, destRoot);
    return;
  }

  switch (command) {
    case 'util-all': {
      const utilDirs = await getTemplateDirectories(templatesRoot);

      for (const dir of utilDirs) {
        await ensureDestinationIsAvailable(destRoot, dir);
      }

      for (const dir of utilDirs) {
        await copyUtilDirectory(templatesRoot, dir, destRoot);
      }
    
      break;
    }

    default:
      throw new Error(`add command "${command}" not recognized.`);
  }
};