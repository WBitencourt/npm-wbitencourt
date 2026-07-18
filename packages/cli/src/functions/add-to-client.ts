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

const packagedTemplateRoot = path.resolve(__dirname, '../templates');
const workspaceTemplateRoot = path.resolve(__dirname, '../../../../packages/util/src');

async function getTemplateRoot() {
  if (await fs.pathExists(packagedTemplateRoot)) {
    return packagedTemplateRoot;
  }

  if (await fs.pathExists(workspaceTemplateRoot)) {
    return workspaceTemplateRoot;
  }

  throw new Error('Utility templates were not found in this package.');
}

async function copyUtility(templateRoot: string, destRoot: string, utilityName: string) {
  const from = path.join(templateRoot, utilityName);
  const to = path.join(destRoot, 'src/util', utilityName);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Utility template "${utilityName}" was not found.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing src/util/${utilityName}.`);
  }

  await fs.copy(from, to, {
    overwrite: false,
    errorOnExist: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
  console.log(chalk.green(`${utilityName} copied to src/util/${utilityName}`));
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();
  const utilityName = utilityCommands[command];

  if (!utilityName && command !== 'util-all') {
    throw new Error(`add command "${command}" not recognized.`);
  }

  const templateRoot = await getTemplateRoot();

  if (utilityName) {
    await copyUtility(templateRoot, destRoot, utilityName);
    return;
  }

  if (command === 'util-all') {
    const utilityNames = Object.values(utilityCommands);
    const existingUtilities = [];

    for (const name of utilityNames) {
      const to = path.join(destRoot, 'src/util', name);
      if (await fs.pathExists(to)) {
        existingUtilities.push(`src/util/${name}`);
      }
    }

    if (existingUtilities.length > 0) {
      throw new Error(`Refusing to overwrite existing utilities: ${existingUtilities.join(', ')}.`);
    }

    for (const name of utilityNames) {
      await copyUtility(templateRoot, destRoot, name);
    }

    return;
  }
}