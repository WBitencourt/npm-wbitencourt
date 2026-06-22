import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateCommands = {
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

const shouldCopyTemplateFile = (src: string) => {
  return !src.endsWith('.spec.ts') && !src.endsWith('.spec.js') && !src.endsWith('.spec.d.ts');
};

async function getTemplateRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../templates');

  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  return path.resolve(__dirname, '../../../../packages/util/src');
}

async function copyTemplate(templateRoot: string, templateName: string, destRoot: string) {
  const from = path.join(templateRoot, templateName);
  const to = path.join(destRoot, 'src/util', templateName);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Template "${templateName}" not found.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`src/util/${templateName} already exists. Remove it before running this command.`);
  }

  await fs.copy(from, to, { filter: shouldCopyTemplateFile });
  console.log(chalk.green(`util-${templateName} copied to src/util/${templateName}`));
}

export async function addToClient(command: string) {
  const templateRoot = await getTemplateRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const templateDirs: string[] = [];

    for (const entry of await fs.readdir(templateRoot)) {
      const templatePath = path.join(templateRoot, entry);
      const stat = await fs.stat(templatePath);

      if (stat.isDirectory()) {
        templateDirs.push(entry);
      }
    }

    for (const dir of templateDirs) {
      const to = path.join(destRoot, 'src/util', dir);

      if (await fs.pathExists(to)) {
        throw new Error(`src/util/${dir} already exists. Remove it before running this command.`);
      }
    }

    for (const dir of templateDirs) {
      await copyTemplate(templateRoot, dir, destRoot);
    }

    return;
  }

  const templateName = templateCommands[command as keyof typeof templateCommands];

  if (!templateName) {
    throw new Error(`add command "${command}" not recognized.`);
  }

  await copyTemplate(templateRoot, templateName, destRoot);
};