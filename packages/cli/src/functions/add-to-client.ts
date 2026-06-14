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

const commandToDirectory = new Map<string, UtilityDirectory>(
  utilityDirectories.map((dir) => [`util-${dir}`, dir] as const),
);

type AddToClientOptions = {
  templatesRoot?: string;
  destRoot?: string;
};

async function assertCanCopy(from: string, to: string) {
  const fromExists = await fs.pathExists(from);
  if (!fromExists) {
    throw new Error(`Template not found: ${from}`);
  }

  const toExists = await fs.pathExists(to);
  if (toExists) {
    throw new Error(`Destination already exists: ${to}`);
  }
}

async function copyUtility(templatesRoot: string, destRoot: string, dir: UtilityDirectory) {
  const from = path.join(templatesRoot, dir);
  const to = path.join(destRoot, 'src/util', dir);

  await assertCanCopy(from, to);
  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`util-${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const templatesRoot = options.templatesRoot ?? path.resolve(__dirname, '../templates');
  const destRoot = options.destRoot ?? process.cwd();

  const utilityDirectory = commandToDirectory.get(command);
  if (utilityDirectory) {
    await copyUtility(templatesRoot, destRoot, utilityDirectory);
    return;
  }

  switch (command) {
    case 'util-all': {
      for (const dir of utilityDirectories) {
        const from = path.join(templatesRoot, dir);
        const to = path.join(destRoot, 'src/util', dir);

        await assertCanCopy(from, to);
      }

      for (const dir of utilityDirectories) {
        await copyUtility(templatesRoot, destRoot, dir);
      }

      break;
    }

    default:
      console.log(chalk.red(`add command "${command}" not recognized.`));
      break;
  }
};