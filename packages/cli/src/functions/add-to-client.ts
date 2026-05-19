import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resolveTemplateRoot() {
  const packagedTemplateRoot = path.resolve(__dirname, '../templates');
  const monorepoTemplateRoot = path.resolve(__dirname, '../../../util/src');

  if (await fs.pathExists(packagedTemplateRoot)) {
    return packagedTemplateRoot;
  }

  if (await fs.pathExists(monorepoTemplateRoot)) {
    return monorepoTemplateRoot;
  }

  throw new Error('Utility templates were not found in this package.');
}

async function listUtilities(srcRoot: string) {
  const entries = await fs.readdir(srcRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function copyUtilityDirectory(from: string, to: string) {
  await fs.ensureDir(to);

  const entries = await fs.readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.endsWith('.spec.ts')) {
      continue;
    }

    const source = path.join(from, entry.name);
    const destination = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyUtilityDirectory(source, destination);
      continue;
    }

    if (entry.isFile()) {
      await fs.copy(source, destination, { overwrite: false, errorOnExist: true });
    }
  }
}

async function copyUtilities(srcRoot: string, destRoot: string, utilityNames: string[]) {
  const operations = utilityNames.map((name) => ({
    name,
    from: path.join(srcRoot, name),
    to: path.join(destRoot, 'src/util', name),
  }));

  for (const operation of operations) {
    if (!await fs.pathExists(operation.from)) {
      throw new Error(`Utility template "${operation.name}" was not found.`);
    }

    if (await fs.pathExists(operation.to)) {
      const relativeDestination = path.relative(destRoot, operation.to);
      throw new Error(`Destination "${relativeDestination}" already exists. Remove it before running add again.`);
    }
  }

  for (const operation of operations) {
    await copyUtilityDirectory(operation.from, operation.to);
    console.log(chalk.green(`util-${operation.name} copied to src/util/${operation.name}`));
  }
}

export async function addToClient(command: string, destRoot = process.cwd()) {
  const srcRoot = await resolveTemplateRoot();
  const utilities = await listUtilities(srcRoot);

  if (command === 'util-all') {
    await copyUtilities(srcRoot, destRoot, utilities);
    return;
  }

  const prefix = 'util-';
  const utilityName = command.startsWith(prefix) ? command.slice(prefix.length) : '';

  if (utilityName && utilities.includes(utilityName)) {
    await copyUtilities(srcRoot, destRoot, [utilityName]);
    return;
  }

  console.log(chalk.red(`add command "${command}" not recognized.`));
}