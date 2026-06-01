import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilityCommands: Record<string, string> = {
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

async function getUtilityTemplateRoot() {
  const packagedTemplateRoot = path.resolve(__dirname, '../templates/util');

  if (await fs.pathExists(packagedTemplateRoot)) {
    return packagedTemplateRoot;
  }

  return path.resolve(__dirname, '../../../../packages/util/src');
}

async function copyUtilityDirectory(srcRoot: string, destRoot: string, dir: string) {
  const from = path.join(srcRoot, dir);
  const to = path.join(destRoot, 'src/util', dir);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Utility template "${dir}" was not found.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing directory: ${path.relative(destRoot, to)}`);
  }

  await fs.copy(from, to);
  console.log(chalk.green(`${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string) {
  const srcRoot = await getUtilityTemplateRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const utilDirs = (await fs.readdir(srcRoot, { withFileTypes: true }))
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    for (const dir of utilDirs) {
      const to = path.join(destRoot, 'src/util', dir);

      if (await fs.pathExists(to)) {
        throw new Error(`Refusing to overwrite existing directory: ${path.relative(destRoot, to)}`);
      }
    }

    for (const dir of utilDirs) {
      await copyUtilityDirectory(srcRoot, destRoot, dir);
    }

    return;
  }

  const dir = utilityCommands[command];

  if (!dir) {
    throw new Error(`add command "${command}" not recognized.`);
  }

  await copyUtilityDirectory(srcRoot, destRoot, dir);
};