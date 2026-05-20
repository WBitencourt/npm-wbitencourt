import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resolveTemplatesRoot() {
  const distTemplatesRoot = path.resolve(__dirname, '../templates');
  if (await fs.pathExists(distTemplatesRoot)) {
    return distTemplatesRoot;
  }

  const sourceTemplatesRoot = path.resolve(__dirname, '../../../util/src');
  if (await fs.pathExists(sourceTemplatesRoot)) {
    return sourceTemplatesRoot;
  }

  throw new Error('Utility templates were not found in this package.');
}

async function copyUtility(templatesRoot: string, destRoot: string, dir: string) {
  const from = path.join(templatesRoot, dir);
  const to = path.join(destRoot, 'src/util', dir);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Utility "${dir}" template was not found.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing utility at ${path.relative(destRoot, to)}.`);
  }

  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();
  const templatesRoot = await resolveTemplatesRoot();

  if (command === 'util-all') {
    const utilDirs = await fs.readdir(templatesRoot, { withFileTypes: true });

    for (const dir of utilDirs) {
      if (dir.isDirectory()) {
        await copyUtility(templatesRoot, destRoot, dir.name);
      }
    }

    return;
  }

  if (command.startsWith('util-')) {
    await copyUtility(templatesRoot, destRoot, command.slice('util-'.length));
    return;
  }

  throw new Error(`add command "${command}" not recognized.`);
};