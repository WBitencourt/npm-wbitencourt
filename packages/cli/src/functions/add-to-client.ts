import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilityDirectories = [
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

type UtilityDirectory = typeof utilityDirectories[number];

const commandToDirectory: Record<string, UtilityDirectory> = {
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

async function resolveUtilSourceRoot() {
  const candidates = [
    path.resolve(__dirname, '../util'),
    path.resolve(__dirname, '../../../../packages/util/src'),
  ];

  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error('Could not locate utility source files.');
}

async function copyUtility(srcRoot: string, destRoot: string, directory: UtilityDirectory) {
  const from = path.join(srcRoot, directory);
  const to = path.join(destRoot, 'src/util', directory);

  if (!await fs.pathExists(from)) {
    throw new Error(`Utility "${directory}" source files were not found.`);
  }

  await fs.copy(from, to);
  console.log(chalk.green(`util-${directory} copied to src/util/${directory}`));
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();
  const directory = commandToDirectory[command];

  if (directory) {
    const srcRoot = await resolveUtilSourceRoot();
    await copyUtility(srcRoot, destRoot, directory);
    return;
  }

  if (command === 'util-all') {
    const srcRoot = await resolveUtilSourceRoot();

    for (const utilDirectory of utilityDirectories) {
      await copyUtility(srcRoot, destRoot, utilDirectory);
    }

    return;
  }

  console.log(chalk.red(`add command "${command}" not recognized.`));
};