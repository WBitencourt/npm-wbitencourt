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

const templateRootCandidates = [
  path.resolve(__dirname, '../templates'),
  path.resolve(__dirname, '../../../../packages/util/src'),
];

type UtilityCommand = keyof typeof templateByCommand;

async function resolveTemplateRoot() {
  for (const candidate of templateRootCandidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error('Could not find packaged utility templates.');
}

async function assertDestinationAvailable(to: string) {
  if (await fs.pathExists(to)) {
    throw new Error(`Destination already exists: ${path.relative(process.cwd(), to)}`);
  }
}

async function copyUtility(templateRoot: string, dir: string, destRoot: string) {
  const from = path.join(templateRoot, dir);
  const to = path.join(destRoot, 'src/util', dir);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Utility template "${dir}" was not found in the package.`);
  }

  await assertDestinationAvailable(to);
  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const templateRoot = await resolveTemplateRoot();
    const dirs = Object.values(templateByCommand);

    for (const dir of dirs) {
      await assertDestinationAvailable(path.join(destRoot, 'src/util', dir));
    }

    for (const dir of dirs) {
      await copyUtility(templateRoot, dir, destRoot);
    }

    return;
  }

  const dir = templateByCommand[command as UtilityCommand];

  if (!dir) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await copyUtility(await resolveTemplateRoot(), dir, destRoot);
};