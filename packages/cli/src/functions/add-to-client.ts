import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilCommands = {
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
} as const;

type AddToClientOptions = {
  cwd?: string;
  templateRoot?: string;
};

const defaultTemplateRoot = path.resolve(__dirname, "../templates/util");

async function copyUtilTemplate(templateRoot: string, destRoot: string, dir: string) {
  const from = path.join(templateRoot, dir);
  const to = path.join(destRoot, "src/util", dir);

  if (!(await fs.pathExists(from))) {
    throw new Error(`Template "${dir}" not found in ${templateRoot}.`);
  }

  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing src/util/${dir}.`);
  }

  await fs.copy(from, to);
  console.log(chalk.green(`${dir} copied to src/util/${dir}`));
}

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const templateRoot = options.templateRoot ?? defaultTemplateRoot;
  const destRoot = options.cwd ?? process.cwd();

  switch (command) {
    case "util-all": {
      const dirs = Object.values(utilCommands);
      const existingDirs: string[] = [];

      for (const dir of dirs) {
        if (await fs.pathExists(path.join(destRoot, "src/util", dir))) {
          existingDirs.push(`src/util/${dir}`);
        }
      }

      if (existingDirs.length > 0) {
        throw new Error(`Refusing to overwrite existing utilities: ${existingDirs.join(", ")}.`);
      }

      for (const dir of dirs) {
        await copyUtilTemplate(templateRoot, destRoot, dir);
      }

      break;
    }

    default: {
      const dir = utilCommands[command as keyof typeof utilCommands];

      if (!dir) {
        console.log(chalk.red(`add command "${command}" not recognized.`));
        break;
      }

      await copyUtilTemplate(templateRoot, destRoot, dir);
      break;
    }
  }
};
