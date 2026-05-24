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
  'util-string': 'string',
  'util-tailwind': 'tailwind',
  'util-validation': 'validation',
};

async function resolveTemplateRoot() {
  const packagedTemplateRoot = path.resolve(__dirname, '../templates/util');

  if (await fs.pathExists(packagedTemplateRoot)) {
    return packagedTemplateRoot;
  }

  const sourceTemplateRoot = path.resolve(__dirname, '../../../../packages/util/src');
  const isRunningFromSource = __dirname.endsWith(`${path.sep}src${path.sep}functions`);

  if (isRunningFromSource && await fs.pathExists(sourceTemplateRoot)) {
    return sourceTemplateRoot;
  }

  throw new Error('Utility templates were not found in this package.');
}

async function getAllUtilDirs(srcRoot: string) {
  const entries = await fs.readdir(srcRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

async function copyUtilDirs(srcRoot: string, destRoot: string, dirs: string[]) {
  for (const dir of dirs) {
    const from = path.join(srcRoot, dir);
    const to = path.join(destRoot, 'src/util', dir);

    const fromExists = await fs.pathExists(from);
    if (!fromExists) {
      throw new Error(`Utility template "${dir}" was not found in this package.`);
    }

    const toExists = await fs.pathExists(to);
    if (toExists) {
      throw new Error(`Refusing to overwrite existing src/util/${dir}.`);
    }
  }

  for (const dir of dirs) {
    const from = path.join(srcRoot, dir);
    const to = path.join(destRoot, 'src/util', dir);

    await fs.copy(from, to, { overwrite: false, errorOnExist: true });
    console.log(chalk.green(`${dir} copied to src/util/${dir}`));
  }
}

export async function addToClient(command: string) {
  const srcRoot = await resolveTemplateRoot();
  const destRoot = process.cwd();

  switch (command) {
    case 'util-array': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-blob': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-classname': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-dom': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-file': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-mask': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-string': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-tailwind': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-validation': {
      await copyUtilDirs(srcRoot, destRoot, [utilCommands[command]]);
      break;
    }

    case 'util-all': {
      const utilDirs = await getAllUtilDirs(srcRoot);
      await copyUtilDirs(srcRoot, destRoot, utilDirs);
      break;
    }

    default:
      console.log(chalk.red(`add command "${command}" not recognized.`));
      break;
  }
};