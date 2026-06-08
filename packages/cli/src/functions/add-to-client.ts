import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilityNames = [
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

type UtilityName = typeof utilityNames[number];

async function getTemplateRoot() {
  const bundledTemplateRoot = path.resolve(__dirname, "../templates");
  if (await fs.pathExists(bundledTemplateRoot)) {
    return bundledTemplateRoot;
  }

  return path.resolve(__dirname, "../../../../packages/util/src");
}

async function assertDestinationIsAvailable(to: string) {
  if (await fs.pathExists(to)) {
    throw new Error(`Refusing to overwrite existing directory: ${to}`);
  }
}

async function copyUtility(templateRoot: string, destRoot: string, utilityName: UtilityName) {
  const from = path.join(templateRoot, utilityName);
  const to = path.join(destRoot, "src/util", utilityName);

  await assertDestinationIsAvailable(to);
  await fs.copy(from, to);
  console.log(chalk.green(`util-${utilityName} copied to src/util/${utilityName}`));
}

export async function addToClient(command: string) {
  const destRoot = process.cwd();
  const templateRoot = await getTemplateRoot();

  switch (command) {
    case 'util-array': {
      await copyUtility(templateRoot, destRoot, "array");
      break;
    }

    case 'util-blob': {
      await copyUtility(templateRoot, destRoot, "blob");
      break;
    }

    case 'util-classname': {
      await copyUtility(templateRoot, destRoot, "classname");
      break;
    }

    case 'util-dom': {
      await copyUtility(templateRoot, destRoot, "dom");
      break;
    }

    case 'util-file': {
      await copyUtility(templateRoot, destRoot, "file");
      break;
    }

    case 'util-mask': {
      await copyUtility(templateRoot, destRoot, "mask");
      break;
    }

    case 'util-object': {
      await copyUtility(templateRoot, destRoot, "object");
      break;
    }

    case 'util-picklist': {
      await copyUtility(templateRoot, destRoot, "picklist");
      break;
    }

    case 'util-string': {
      await copyUtility(templateRoot, destRoot, "string");
      break;
    }

    case 'util-tailwind': {
      await copyUtility(templateRoot, destRoot, "tailwind");
      break;
    }

    case 'util-validation': {
      await copyUtility(templateRoot, destRoot, "validation");
      break;
    }

    case 'util-all': {
      const existingUtilities = [];

      for (const utilityName of utilityNames) {
        const to = path.join(destRoot, "src/util", utilityName);
        if (await fs.pathExists(to)) {
          existingUtilities.push(utilityName);
        }
      }

      if (existingUtilities.length > 0) {
        throw new Error(`Refusing to overwrite existing utility directories: ${existingUtilities.join(", ")}`);
      }

      for (const utilityName of utilityNames) {
        await copyUtility(templateRoot, destRoot, utilityName);
      }
    
      break;
    }

    default:
      console.log(chalk.red(`add command "${command}" not recognized.`));
      break;
  }
};