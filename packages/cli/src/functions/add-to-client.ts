import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateNames = [
  'array',
  'blob',
  'classname',
  'dom',
  'file',
  'mask',
  'object',
  'picklist',
  'string',
  'tailwind',
  'validation',
] as const;

type TemplateName = typeof templateNames[number];

type AddToClientOptions = {
  destRoot?: string;
  templateRoot?: string;
};

const defaultTemplateRoot = path.resolve(__dirname, '../templates');
const commandMap = new Map<string, TemplateName>(
  templateNames.map((templateName) => [`util-${templateName}`, templateName])
);

async function assertCanCopy(templateName: TemplateName, destRoot: string, templateRoot: string) {
  const from = path.join(templateRoot, templateName);
  const to = path.join(destRoot, 'src/util', templateName);

  if (!await fs.pathExists(from)) {
    throw new Error(`Template "${templateName}" is missing from the installed package.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing src/util/${templateName}.`);
  }
}

async function copyTemplate(templateName: TemplateName, destRoot: string, templateRoot: string) {
  const from = path.join(templateRoot, templateName);
  const to = path.join(destRoot, 'src/util', templateName);

  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${templateName} copied to src/util/${templateName}`));
}

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const destRoot = options.destRoot ?? process.cwd();
  const templateRoot = options.templateRoot ?? defaultTemplateRoot;
  const templatesToCopy = command === 'util-all'
    ? [...templateNames]
    : commandMap.get(command) ? [commandMap.get(command)!] : undefined;

  if (!templatesToCopy) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await Promise.all(templatesToCopy.map((templateName) => assertCanCopy(templateName, destRoot, templateRoot)));

  for (const templateName of templatesToCopy) {
    await copyTemplate(templateName, destRoot, templateRoot);
  }
};