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

const utilityCommands = new Map(
  utilityDirectories.map((directory) => [`util-${directory}`, [directory]])
);

async function getTemplatesRoot() {
  const candidates = [
    path.resolve(__dirname, '../templates'),
    path.resolve(__dirname, '../../../util/src'),
  ];

  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error('Utility templates were not found in this package.');
}

async function assertDestinationsDoNotExist(destRoot: string, directories: readonly string[]) {
  const existingDirectories = [];

  for (const directory of directories) {
    const destination = path.join(destRoot, 'src/util', directory);

    if (await fs.pathExists(destination)) {
      existingDirectories.push(destination);
    }
  }

  if (existingDirectories.length > 0) {
    throw new Error(
      `Refusing to overwrite existing utilities: ${existingDirectories.join(', ')}`
    );
  }
}

async function copyUtility(templatesRoot: string, destRoot: string, directory: string) {
  const from = path.join(templatesRoot, directory);
  const to = path.join(destRoot, 'src/util', directory);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Utility template "${directory}" was not found.`);
  }

  await fs.copy(from, to, {
    overwrite: false,
    errorOnExist: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });

  console.log(chalk.green(`${directory} copied to src/util/${directory}`));
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();
  const templatesRoot = await getTemplatesRoot();
  const directories = command === 'util-all' ? utilityDirectories : utilityCommands.get(command);

  if (!directories) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await assertDestinationsDoNotExist(destRoot, directories);

  for (const directory of directories) {
    await copyUtility(templatesRoot, destRoot, directory);
  }
};