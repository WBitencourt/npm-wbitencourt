import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type AddToClientOptions = {
  destRoot?: string;
  templatesRoot?: string;
};

const commandPrefix = "util-";

async function getUtilityNames(templatesRoot: string) {
  const entries = await fs.readdir(templatesRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

async function assertCanCopy(destRoot: string, utilityNames: string[]) {
  const existingDestinations = [];

  for (const utilityName of utilityNames) {
    const destination = path.join(destRoot, "src/util", utilityName);

    if (await fs.pathExists(destination)) {
      existingDestinations.push(path.relative(destRoot, destination));
    }
  }

  if (existingDestinations.length > 0) {
    throw new Error(
      `Refusing to overwrite existing util directories: ${existingDestinations.join(", ")}`
    );
  }
}

async function copyUtility(templatesRoot: string, destRoot: string, utilityName: string) {
  const from = path.join(templatesRoot, utilityName);
  const to = path.join(destRoot, "src/util", utilityName);

  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${commandPrefix}${utilityName} copied to src/util/${utilityName}`));
}

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const templatesRoot = options.templatesRoot ?? path.resolve(__dirname, "../templates");
  const destRoot = options.destRoot ?? process.cwd();

  if (!(await fs.pathExists(templatesRoot))) {
    throw new Error(`Utility templates not found at ${templatesRoot}. Please rebuild the CLI package.`);
  }

  const utilityNames = await getUtilityNames(templatesRoot);

  if (command === "util-all") {
    await assertCanCopy(destRoot, utilityNames);

    for (const utilityName of utilityNames) {
      await copyUtility(templatesRoot, destRoot, utilityName);
    }

    return;
  }

  if (!command.startsWith(commandPrefix)) {
    throw new Error(`add command "${command}" not recognized.`);
  }

  const utilityName = command.slice(commandPrefix.length);

  if (!utilityNames.includes(utilityName)) {
    throw new Error(`add command "${command}" not recognized.`);
  }

  await assertCanCopy(destRoot, [utilityName]);
  await copyUtility(templatesRoot, destRoot, utilityName);
};