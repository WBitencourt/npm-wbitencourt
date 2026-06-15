import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilTemplatesByCommand = {
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

type UtilCommand = keyof typeof utilTemplatesByCommand;

type AddToClientOptions = {
  destRoot?: string;
  templateRoot?: string;
};

const getDefaultTemplateRoot = () => path.resolve(__dirname, "../templates");

const isUtilCommand = (command: string): command is UtilCommand =>
  Object.hasOwn(utilTemplatesByCommand, command);

const getCopyPaths = (
  templateName: string,
  destRoot: string,
  templateRoot: string,
) => ({
  from: path.join(templateRoot, templateName),
  to: path.join(destRoot, "src/util", templateName),
});

const assertTemplateCanBeCopied = async (
  templateName: string,
  destRoot: string,
  templateRoot: string,
) => {
  const { from, to } = getCopyPaths(templateName, destRoot, templateRoot);

  const fromExists = await fs.pathExists(from);
  if (!fromExists) {
    throw new Error(`Template "${templateName}" was not found in the installed package.`);
  }

  const toExists = await fs.pathExists(to);
  if (toExists) {
    throw new Error(`Refusing to overwrite existing directory: src/util/${templateName}`);
  }
};

const copyTemplate = async (
  templateName: string,
  destRoot: string,
  templateRoot: string,
) => {
  await assertTemplateCanBeCopied(templateName, destRoot, templateRoot);

  const { from, to } = getCopyPaths(templateName, destRoot, templateRoot);
  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${templateName} copied to src/util/${templateName}`));
};

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const destRoot = options.destRoot ?? process.cwd();
  const templateRoot = options.templateRoot ?? getDefaultTemplateRoot();

  if (command === "util-all") {
    const templateNames = Object.values(utilTemplatesByCommand);

    for (const templateName of templateNames) {
      await assertTemplateCanBeCopied(templateName, destRoot, templateRoot);
    }

    for (const templateName of templateNames) {
      await copyTemplate(templateName, destRoot, templateRoot);
    }

    return;
  }

  if (!isUtilCommand(command)) {
    console.log(chalk.red(`add command "${command}" not recognized.`));
    return;
  }

  await copyTemplate(utilTemplatesByCommand[command], destRoot, templateRoot);
};