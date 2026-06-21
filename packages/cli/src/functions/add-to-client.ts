import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandToTemplate = {
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

type UtilityCommand = keyof typeof commandToTemplate;

type AddToClientOptions = {
  cwd?: string;
  templateRoot?: string;
};

const defaultTemplateRoot = path.resolve(__dirname, '../templates');

const getDestination = (destRoot: string, templateName: string) => (
  path.join(destRoot, 'src/util', templateName)
);

async function assertCanCopy(templateRoot: string, destRoot: string, templateName: string) {
  const from = path.join(templateRoot, templateName);
  const to = getDestination(destRoot, templateName);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Utility template "${templateName}" was not found in the installed package.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Destination "${path.relative(destRoot, to)}" already exists. Remove it before running this command.`);
  }
}

async function copyTemplate(templateRoot: string, destRoot: string, templateName: string) {
  const from = path.join(templateRoot, templateName);
  const to = getDestination(destRoot, templateName);

  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${templateName} copied to src/util/${templateName}`));
}

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const templateRoot = options.templateRoot ?? defaultTemplateRoot;
  const destRoot = options.cwd ?? process.cwd();

  if (command === 'util-all') {
    const templateNames = Object.values(commandToTemplate);

    for (const templateName of templateNames) {
      await assertCanCopy(templateRoot, destRoot, templateName);
    }

    for (const templateName of templateNames) {
      await copyTemplate(templateRoot, destRoot, templateName);
    }

    return;
  }

  const templateName = commandToTemplate[command as UtilityCommand];

  if (!templateName) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await assertCanCopy(templateRoot, destRoot, templateName);
  await copyTemplate(templateRoot, destRoot, templateName);
};