import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMMAND_TO_TEMPLATE: Record<string, string> = {
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

type AddToClientOptions = {
  srcRoot?: string;
  destRoot?: string;
};

function getDestination(destRoot: string, templateName: string) {
  return path.join(destRoot, 'src/util', templateName);
}

async function assertCanCopy(srcRoot: string, destRoot: string, templateNames: string[]) {
  const missingTemplates: string[] = [];
  const existingDestinations: string[] = [];

  for (const templateName of templateNames) {
    const from = path.join(srcRoot, templateName);
    const to = getDestination(destRoot, templateName);

    if (!(await fs.pathExists(from))) {
      missingTemplates.push(templateName);
    }

    if (await fs.pathExists(to)) {
      existingDestinations.push(path.relative(destRoot, to));
    }
  }

  if (missingTemplates.length > 0) {
    throw new Error(`Missing util template(s): ${missingTemplates.join(', ')}`);
  }

  if (existingDestinations.length > 0) {
    throw new Error(`Refusing to overwrite existing path(s): ${existingDestinations.join(', ')}`);
  }
}

async function copyTemplate(srcRoot: string, destRoot: string, templateName: string) {
  const from = path.join(srcRoot, templateName);
  const to = getDestination(destRoot, templateName);

  await fs.copy(from, to);
  console.log(chalk.green(`${templateName} copied to src/util/${templateName}`));
}

async function getAllTemplateNames(srcRoot: string) {
  const entries = await fs.readdir(srcRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const srcRoot = options.srcRoot ?? path.resolve(__dirname, '../templates');
  const destRoot = options.destRoot ?? process.cwd();

  if (command === 'util-all') {
    const templateNames = await getAllTemplateNames(srcRoot);

    await assertCanCopy(srcRoot, destRoot, templateNames);

    for (const templateName of templateNames) {
      await copyTemplate(srcRoot, destRoot, templateName);
    }

    return;
  }

  const templateName = COMMAND_TO_TEMPLATE[command];

  if (!templateName) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await assertCanCopy(srcRoot, destRoot, [templateName]);
  await copyTemplate(srcRoot, destRoot, templateName);
};