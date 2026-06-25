import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateByCommand: Record<string, string> = {
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

const templateNames = Object.values(templateByCommand);

const copyFilter = (source: string) => {
  return !source.endsWith('.spec.ts') && !source.endsWith('.spec.js') && !source.endsWith('.spec.d.ts');
};

async function getTemplatesRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../templates/util');
  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  const workspaceTemplatesRoot = path.resolve(__dirname, '../../../../packages/util/src');
  if (await fs.pathExists(workspaceTemplatesRoot)) {
    return workspaceTemplatesRoot;
  }

  throw new Error('Utility templates were not found in this installation.');
}

function getDestination(destRoot: string, templateName: string) {
  return path.join(destRoot, 'src/util', templateName);
}

async function ensureCanCopy(templatesRoot: string, destRoot: string, templateName: string) {
  const from = path.join(templatesRoot, templateName);
  const to = getDestination(destRoot, templateName);

  if (!await fs.pathExists(from)) {
    throw new Error(`Utility template "${templateName}" was not found.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing directory: ${path.relative(destRoot, to)}`);
  }
}

async function copyTemplate(templatesRoot: string, destRoot: string, templateName: string) {
  const from = path.join(templatesRoot, templateName);
  const to = getDestination(destRoot, templateName);

  await fs.copy(from, to, {
    overwrite: false,
    errorOnExist: true,
    filter: copyFilter,
  });
  console.log(chalk.green(`${templateName} copied to src/util/${templateName}`));
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();
  const templatesRoot = await getTemplatesRoot();
  const templateName = templateByCommand[command];

  if (templateName) {
    await ensureCanCopy(templatesRoot, destRoot, templateName);
    await copyTemplate(templatesRoot, destRoot, templateName);
    return;
  }

  if (command === 'util-all') {
    for (const name of templateNames) {
      await ensureCanCopy(templatesRoot, destRoot, name);
    }

    for (const name of templateNames) {
      await copyTemplate(templatesRoot, destRoot, name);
    }
    return;
  }

  console.log(chalk.red(`add command "${command}" not recognized.`));
};