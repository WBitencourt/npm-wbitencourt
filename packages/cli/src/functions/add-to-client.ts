import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilCommands: Record<string, string> = {
  'util-array': 'array',
  'util-blob': 'blob',
  'util-classname': 'classname',
  'util-dom': 'dom',
  'util-file': 'file',
  'util-mask': 'mask',
  'util-string': 'string',
  'util-tailwind': 'tailwind',
  'util-validation': 'validation',
};

async function ensureDestinationsDoNotExist(destRoot: string, utilDirs: string[]) {
  const existingDestinations: string[] = [];

  for (const dir of utilDirs) {
    const to = path.join(destRoot, 'src/util', dir);

    if (await fs.pathExists(to)) {
      existingDestinations.push(path.relative(destRoot, to));
    }
  }

  if (existingDestinations.length > 0) {
    throw new Error(
      `Refusing to overwrite existing util files: ${existingDestinations.join(', ')}`
    );
  }
}

async function copyUtilDir(srcRoot: string, destRoot: string, dir: string) {
  const from = path.join(srcRoot, dir);
  const to = path.join(destRoot, 'src/util', dir);

  const fromExists = await fs.pathExists(from);
  if (!fromExists) {
    throw new Error(`Utility source "${dir}" was not found.`);
  }

  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string) {
  const srcRoot = path.resolve(__dirname, '../../../../packages/util/src');
  const destRoot = process.cwd();
  const utilDir = utilCommands[command];

  if (utilDir) {
    await ensureDestinationsDoNotExist(destRoot, [utilDir]);
    await copyUtilDir(srcRoot, destRoot, utilDir);
    return;
  }

  switch (command) {
    case 'util-all': {
      const utilDirs = (await fs.readdir(srcRoot, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);

      await ensureDestinationsDoNotExist(destRoot, utilDirs);

      for (const dir of utilDirs) {
        await copyUtilDir(srcRoot, destRoot, dir);
      }

      break;
    }

    default:
      console.log(chalk.red(`add command "${command}" not recognized.`));
      break;
  }
};