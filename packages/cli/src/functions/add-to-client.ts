import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilities = {
  'util-array': 'array',
  'util-blob': 'blob',
  'util-classname': 'classname',
  'util-dom': 'dom',
  'util-file': 'file',
  'util-mask': 'mask',
  'util-string': 'string',
  'util-tailwind': 'tailwind',
  'util-validation': 'validation',
} as const;

type UtilityCommand = keyof typeof utilities;

async function resolveTemplateRoot() {
  const candidates = [
    path.resolve(__dirname, '../templates/util'),
    path.resolve(__dirname, '../../../util/src'),
  ];

  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error('Utility templates were not found in this package.');
}

async function availableUtilityDirs(templateRoot: string) {
  const entries = await fs.readdir(templateRoot, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function ensureTargetsAreSafe(destRoot: string, dirs: string[]) {
  const existingDirs: string[] = [];

  for (const dir of dirs) {
    const to = path.join(destRoot, 'src/util', dir);
    if (await fs.pathExists(to)) {
      existingDirs.push(`src/util/${dir}`);
    }
  }

  if (existingDirs.length > 0) {
    throw new Error(`Refusing to overwrite existing utilities: ${existingDirs.join(', ')}`);
  }
}

async function copyUtilities(templateRoot: string, destRoot: string, dirs: string[]) {
  await ensureTargetsAreSafe(destRoot, dirs);

  for (const dir of dirs) {
    const from = path.join(templateRoot, dir);
    const to = path.join(destRoot, 'src/util', dir);

    if (!(await fs.pathExists(from))) {
      throw new Error(`Utility template "${dir}" was not found.`);
    }

    await fs.copy(from, to, { overwrite: false, errorOnExist: true });
    console.log(chalk.green(`${dir} copied to src/util/${dir}`));
  }
}

export async function addToClient(command: string) {
  const templateRoot = await resolveTemplateRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    await copyUtilities(templateRoot, destRoot, await availableUtilityDirs(templateRoot));
    return;
  }

  if (command in utilities) {
    await copyUtilities(templateRoot, destRoot, [utilities[command as UtilityCommand]]);
    return;
  }

  console.log(chalk.red(`add command "${command}" not recognized.`));
};