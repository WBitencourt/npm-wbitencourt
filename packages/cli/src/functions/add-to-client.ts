import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UTIL_COMMANDS = {
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

async function resolveTemplatesRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../templates');

  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  const sourceTemplatesRoot = path.resolve(__dirname, '../../../util/src');
  const isSourceRuntime = path.basename(path.resolve(__dirname, '..')) === 'src';

  if (isSourceRuntime && await fs.pathExists(sourceTemplatesRoot)) {
    return sourceTemplatesRoot;
  }

  throw new Error('Utility templates not found. Reinstall the wbitencourt package.');
}

async function copyTemplate(templatesRoot: string, templateName: string, destRoot: string) {
  const from = path.join(templatesRoot, templateName);
  const to = path.join(destRoot, 'src/util', templateName);

  if (!await fs.pathExists(from)) {
    throw new Error(`Utility template "${templateName}" not found.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Destination already exists: ${to}. Remove it before running this command again.`);
  }

  await fs.copy(from, to, {
    errorOnExist: true,
    overwrite: false,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
}

export async function addToClient(command: string) {
  const templatesRoot = await resolveTemplatesRoot();
  const destRoot = process.cwd();
  const templateName = UTIL_COMMANDS[command as keyof typeof UTIL_COMMANDS];

  if (templateName) {
    await copyTemplate(templatesRoot, templateName, destRoot);
    console.log(chalk.green(`${command} copied to src/util/${templateName}`));
    return;
  }

  switch (command) {
    case 'util-all': {
      const utilDirs = await fs.readdir(templatesRoot);

      for (const dir of utilDirs) {
        const templatePath = path.join(templatesRoot, dir);
        const templateStat = await fs.stat(templatePath);
        if (!templateStat.isDirectory()) continue;

        await copyTemplate(templatesRoot, dir, destRoot);
        console.log(chalk.green(`${dir} copied to src/util/${dir}`));
      }

      break;
    }

    default:
      console.log(chalk.red(`add command "${command}" not recognized.`));
      break;
  }
};