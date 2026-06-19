import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

function isUtilCommand(command: string): command is UtilCommand {
  return command in utilCommands;
}

async function getTemplateRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../templates');

  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  return path.resolve(__dirname, '../../../../packages/util/src');
}

async function copyTemplate(templateRoot: string, destRoot: string, templateName: string) {
  const from = path.join(templateRoot, templateName);
  const to = path.join(destRoot, 'src/util', templateName);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Template "${templateName}" was not found in the published package.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing directory: ${path.relative(destRoot, to)}`);
  }

  await fs.copy(from, to, {
    filter: (source) => !source.endsWith('.spec.ts'),
  });

  console.log(chalk.green(`${templateName} copied to src/util/${templateName}`));
}

export async function addToClient(command: string) {
  const templateRoot = await getTemplateRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const templateNames = Object.values(utilCommands);

    for (const templateName of templateNames) {
      const to = path.join(destRoot, 'src/util', templateName);
      if (await fs.pathExists(to)) {
        throw new Error(`Refusing to overwrite existing directory: ${path.relative(destRoot, to)}`);
      }
    }

    for (const templateName of templateNames) {
      await copyTemplate(templateRoot, destRoot, templateName);
    }

    return;
  }

  if (!isUtilCommand(command)) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await copyTemplate(templateRoot, destRoot, utilCommands[command]);
}