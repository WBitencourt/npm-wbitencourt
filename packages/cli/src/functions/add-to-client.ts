import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilityDirectories = [
  "array",
  "blob",
  "classname",
  "dom",
  "file",
  "mask",
  "object",
  "picklist",
  "string",
  "tailwind",
  "validation",
] as const;

type UtilityDirectory = (typeof utilityDirectories)[number];

const commandToDirectory = new Map<string, UtilityDirectory>(
  utilityDirectories.map((directory) => [`util-${directory}`, directory])
);

type AddToClientOptions = {
  templatesRoot?: string;
  destRoot?: string;
};

async function ensureTemplateExists(templatesRoot: string, directory: UtilityDirectory) {
  const from = path.join(templatesRoot, directory);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Utility template "${directory}" was not found in the CLI package.`);
  }
}

async function ensureDestinationAvailable(destRoot: string, directory: UtilityDirectory) {
  const to = path.join(destRoot, "src/util", directory);

  if (await fs.pathExists(to)) {
    throw new Error(`Destination "${to}" already exists. Aborting to avoid overwriting local files.`);
  }
}

async function copyUtility(templatesRoot: string, destRoot: string, directory: UtilityDirectory) {
  await ensureTemplateExists(templatesRoot, directory);
  await ensureDestinationAvailable(destRoot, directory);

  const from = path.join(templatesRoot, directory);
  const to = path.join(destRoot, "src/util", directory);

  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`util-${directory} copied to src/util/${directory}`));
}

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const templatesRoot = options.templatesRoot ?? path.resolve(__dirname, "../templates");
  const destRoot = options.destRoot ?? process.cwd();

  if (command === "util-all") {
    for (const directory of utilityDirectories) {
      await ensureTemplateExists(templatesRoot, directory);
      await ensureDestinationAvailable(destRoot, directory);
    }

    for (const directory of utilityDirectories) {
      await copyUtility(templatesRoot, destRoot, directory);
    }

    return;
  }

  const directory = commandToDirectory.get(command);

  if (!directory) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await copyUtility(templatesRoot, destRoot, directory);
};