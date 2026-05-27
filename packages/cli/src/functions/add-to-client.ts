import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UTILITY_DIRECTORIES = [
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

type UtilityDirectory = typeof UTILITY_DIRECTORIES[number];

async function resolveTemplateRoot() {
  const candidates = [
    path.resolve(__dirname, '../templates/util'),
    path.resolve(__dirname, '../../../../packages/util/src'),
  ];

  for (const candidate of candidates) {
    if (await fs.pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error('Utility templates were not found in the installed package.');
}

async function assertUtilitiesCanBeCopied(templateRoot: string, destRoot: string, utilities: readonly UtilityDirectory[]) {
  const missingTemplates: string[] = [];
  const existingTargets: string[] = [];

  for (const utility of utilities) {
    const from = path.join(templateRoot, utility);
    const to = path.join(destRoot, 'src/util', utility);

    if (!(await fs.pathExists(from))) {
      missingTemplates.push(utility);
    }

    if (await fs.pathExists(to)) {
      existingTargets.push(path.relative(destRoot, to));
    }
  }

  if (missingTemplates.length > 0) {
    throw new Error(`Utility template not found: ${missingTemplates.join(', ')}`);
  }

  if (existingTargets.length > 0) {
    throw new Error(`Refusing to overwrite existing utility files: ${existingTargets.join(', ')}`);
  }
}

async function copyUtilities(templateRoot: string, destRoot: string, utilities: readonly UtilityDirectory[]) {
  await assertUtilitiesCanBeCopied(templateRoot, destRoot, utilities);

  for (const utility of utilities) {
    const from = path.join(templateRoot, utility);
    const to = path.join(destRoot, 'src/util', utility);

    await fs.copy(from, to, {
      errorOnExist: true,
      overwrite: false,
      filter: (src) => !src.endsWith('.spec.ts'),
    });
    console.log(chalk.green(`${utility} copied to src/util/${utility}`));
  }
}

export async function addToClient(command: string) {
  const templateRoot = await resolveTemplateRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    await copyUtilities(templateRoot, destRoot, UTILITY_DIRECTORIES);
    return;
  }

  const utility = command.replace(/^util-/, '') as UtilityDirectory;

  if (!UTILITY_DIRECTORIES.includes(utility)) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await copyUtilities(templateRoot, destRoot, [utility]);
};