import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packagedTemplateRoot = path.resolve(__dirname, '../templates');
const developmentTemplateRoot = path.resolve(__dirname, '../../../../packages/util/src');

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

async function resolveTemplateRoot() {
  if (await fs.pathExists(packagedTemplateRoot)) {
    return packagedTemplateRoot;
  }

  if (await fs.pathExists(developmentTemplateRoot)) {
    return developmentTemplateRoot;
  }

  throw new Error('Utility templates are missing from this installation.');
}

async function getTemplateDirectories(templateRoot: string) {
  const entries = await fs.readdir(templateRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

async function copyUtility(templateRoot: string, destRoot: string, utilityName: string) {
  const from = path.join(templateRoot, utilityName);
  const to = path.join(destRoot, 'src/util', utilityName);

  if (!await fs.pathExists(from)) {
    throw new Error(`Utility template "${utilityName}" is missing.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing utility directory: ${path.relative(destRoot, to)}`);
  }

  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${utilityName} copied to src/util/${utilityName}`));
}

export async function addToClient(command: string) {
  const templateRoot = await resolveTemplateRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const utilities = await getTemplateDirectories(templateRoot);
    const existingUtilities: string[] = [];

    for (const utilityName of utilities) {
      const to = path.join(destRoot, 'src/util', utilityName);

      if (await fs.pathExists(to)) {
        existingUtilities.push(path.relative(destRoot, to));
      }
    }

    if (existingUtilities.length > 0) {
      throw new Error(`Refusing to overwrite existing utility directories: ${existingUtilities.join(', ')}`);
    }

    for (const utilityName of utilities) {
      await copyUtility(templateRoot, destRoot, utilityName);
    }

    return;
  }

  const utilityName = utilityCommands[command];

  if (!utilityName) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await copyUtility(templateRoot, destRoot, utilityName);
};