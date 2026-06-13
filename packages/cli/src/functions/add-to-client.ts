import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateByCommand = {
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

type UtilCommand = keyof typeof templateByCommand;

async function getTemplatesRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../templates');
  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  const workspaceTemplatesRoot = path.resolve(__dirname, '../../../../packages/util/src');
  if (await fs.pathExists(workspaceTemplatesRoot)) {
    return workspaceTemplatesRoot;
  }

  throw new Error('Utility templates were not found in this package.');
}

async function assertDestinationAvailable(to: string) {
  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing utility directory: ${to}`);
  }
}

async function copyTemplate(templatesRoot: string, destRoot: string, dir: string) {
  const from = path.join(templatesRoot, dir);
  const to = path.join(destRoot, 'src/util', dir);

  await assertDestinationAvailable(to);
  await fs.copy(from, to);
  console.log(chalk.green(`${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string) {
  const templatesRoot = await getTemplatesRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const utilDirs = Object.values(templateByCommand);
    await Promise.all(
      utilDirs.map((dir) => assertDestinationAvailable(path.join(destRoot, 'src/util', dir))),
    );

    for (const dir of utilDirs) {
      await copyTemplate(templatesRoot, destRoot, dir);
    }

    return;
  }

  const dir = templateByCommand[command as UtilCommand];
  if (!dir) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await copyTemplate(templatesRoot, destRoot, dir);
};