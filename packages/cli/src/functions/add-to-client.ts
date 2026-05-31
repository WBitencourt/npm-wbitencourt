import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilityCommands = {
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

async function getTemplatesRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../templates/util');
  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  const workspaceTemplatesRoot = path.resolve(__dirname, '../../../../packages/util/src');
  if (await fs.pathExists(workspaceTemplatesRoot)) {
    return workspaceTemplatesRoot;
  }

  throw new Error('Utility templates were not found in this installation.');
}

async function copyUtility(templatesRoot: string, destRoot: string, utilityName: string) {
  const from = path.join(templatesRoot, utilityName);
  const to = path.join(destRoot, 'src/util', utilityName);

  await assertUtilitiesDoNotExist(destRoot, [utilityName]);

  await fs.copy(from, to, { errorOnExist: true, overwrite: false });
  console.log(chalk.green(`${utilityName} copied to src/util/${utilityName}`));
}

async function assertUtilitiesDoNotExist(destRoot: string, utilityNames: string[]) {
  const existingUtilities = [];

  for (const utilityName of utilityNames) {
    const to = path.join(destRoot, 'src/util', utilityName);
    if (await fs.pathExists(to)) {
      existingUtilities.push(`src/util/${utilityName}`);
    }
  }

  if (existingUtilities.length > 0) {
    throw new Error(`${existingUtilities.join(', ')} already exists; refusing to overwrite existing files.`);
  }
}

export async function addToClient(command: string) {
  const templatesRoot = await getTemplatesRoot();
  const destRoot = process.cwd();

  if (command === 'util-all') {
    const entries = await fs.readdir(templatesRoot, { withFileTypes: true });
    const utilityDirs = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    await assertUtilitiesDoNotExist(destRoot, utilityDirs);

    for (const utilityName of utilityDirs) {
      await copyUtility(templatesRoot, destRoot, utilityName);
    }

    return;
  }

  const utilityName = utilityCommands[command as keyof typeof utilityCommands];

  if (!utilityName) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await copyUtility(templatesRoot, destRoot, utilityName);
};