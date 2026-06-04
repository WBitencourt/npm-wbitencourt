import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templateByCommand: Record<string, string> = {
  "util-array": "array",
  "util-blob": "blob",
  "util-classname": "classname",
  "util-dom": "dom",
  "util-file": "file",
  "util-mask": "mask",
  "util-object": "object",
  "util-picklist": "picklist",
  "util-string": "string",
  "util-tailwind": "tailwind",
  "util-validation": "validation",
};

async function getTemplateRoot() {
  const packagedTemplateRoot = path.resolve(__dirname, "../templates");
  if (await fs.pathExists(packagedTemplateRoot)) {
    return packagedTemplateRoot;
  }

  const workspaceTemplateRoot = path.resolve(__dirname, "../../../../packages/util/src");
  if (await fs.pathExists(workspaceTemplateRoot)) {
    return workspaceTemplateRoot;
  }

  throw new Error("Utility templates were not found in this package.");
}

async function listTemplateDirs(templateRoot: string) {
  const entries = await fs.readdir(templateRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((dir) => Object.values(templateByCommand).includes(dir));
}

async function assertDestinationsAreAvailable(destRoot: string, dirs: string[]) {
  for (const dir of dirs) {
    const to = path.join(destRoot, "src/util", dir);

    if (await fs.pathExists(to)) {
      throw new Error(`Cannot copy util-${dir}: ${to} already exists.`);
    }
  }
}

async function copyTemplateDirs(templateRoot: string, destRoot: string, dirs: string[]) {
  await assertDestinationsAreAvailable(destRoot, dirs);

  for (const dir of dirs) {
    const from = path.join(templateRoot, dir);
    const to = path.join(destRoot, "src/util", dir);

    await fs.copy(from, to);
    console.log(chalk.green(`${dir} copied to src/util/${dir}`));
  }
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();
  const templateRoot = await getTemplateRoot();

  if (command === "util-all") {
    const utilDirs = await listTemplateDirs(templateRoot);
    await copyTemplateDirs(templateRoot, destRoot, utilDirs);
    return;
  }

  const dir = templateByCommand[command];
  if (!dir) {
    throw new Error(`add command "${command}" not recognized.`);
  }

  await copyTemplateDirs(templateRoot, destRoot, [dir]);
};