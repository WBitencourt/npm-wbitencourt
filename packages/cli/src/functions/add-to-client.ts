import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UTIL_TEMPLATE_DIRS = {
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

type UtilCommand = keyof typeof UTIL_TEMPLATE_DIRS;

async function resolveTemplatesRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../templates/util');
  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  return path.resolve(__dirname, '../../../../packages/util/src');
}

async function assertCanCopy(from: string, to: string, dir: string) {
  if (!(await fs.pathExists(from))) {
    throw new Error(`Template "${dir}" not found in the installed package.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`src/util/${dir} already exists. Remove it before running this command.`);
  }
}

async function copyUtilDir(srcRoot: string, destRoot: string, dir: string) {
  const from = path.join(srcRoot, dir);
  const to = path.join(destRoot, 'src/util', dir);

  await assertCanCopy(from, to, dir);
  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string) {
  const srcRoot = await resolveTemplatesRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const dirs = Object.values(UTIL_TEMPLATE_DIRS);

    for (const dir of dirs) {
      await assertCanCopy(
        path.join(srcRoot, dir),
        path.join(destRoot, 'src/util', dir),
        dir,
      );
    }

    for (const dir of dirs) {
      await copyUtilDir(srcRoot, destRoot, dir);
    }

    return;
  }

  if (command in UTIL_TEMPLATE_DIRS) {
    await copyUtilDir(srcRoot, destRoot, UTIL_TEMPLATE_DIRS[command as UtilCommand]);
    return;
  }

  console.log(chalk.red(`add command "${command}" not recognized.`));
};