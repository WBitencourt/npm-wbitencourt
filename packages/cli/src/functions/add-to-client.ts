import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagedTemplateRoot = path.resolve(__dirname, '../templates');
const workspaceTemplateRoot = path.resolve(__dirname, '../../../../packages/util/src');

const utilCommands = {
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
} as const;

type UtilCommand = keyof typeof utilCommands;

async function getTemplateRoot() {
  if (await fs.pathExists(packagedTemplateRoot)) {
    return packagedTemplateRoot;
  }

  return workspaceTemplateRoot;
}

async function copyTemplate(dir: string, destRoot: string) {
  const from = path.join(await getTemplateRoot(), dir);
  const to = path.join(destRoot, 'src/util', dir);

  if (await fs.pathExists(to)) {
    throw new Error(`src/util/${dir} already exists. Remove it before running this command.`);
  }

  await fs.copy(from, to, {
    filter: (source) => !source.endsWith('.spec.ts'),
  });
  console.log(chalk.green(`${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const dirs = Object.values(utilCommands);
    const existingDirs = [];

    for (const dir of dirs) {
      if (await fs.pathExists(path.join(destRoot, 'src/util', dir))) {
        existingDirs.push(`src/util/${dir}`);
      }
    }

    if (existingDirs.length > 0) {
      throw new Error(`Cannot copy util-all because these paths already exist: ${existingDirs.join(', ')}`);
    }

    for (const dir of dirs) {
      await copyTemplate(dir, destRoot);
    }

    return;
  }

  if (command in utilCommands) {
    await copyTemplate(utilCommands[command as UtilCommand], destRoot);
    return;
  }

  console.log(chalk.red(`add command "${command}" not recognized.`));
};