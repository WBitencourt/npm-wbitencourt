import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilTemplates = [
  'array',
  'blob',
  'classname',
  'dom',
  'file',
  'mask',
  'object',
  'picklist',
  'string',
  'tailwind',
  'validation',
];

const commandTemplateMap = new Map(
  utilTemplates.map((templateName) => [`util-${templateName}`, templateName]),
);

type AddToClientOptions = {
  destRoot?: string;
  templatesRoot?: string;
};

async function copyTemplate(templateName: string, srcRoot: string, destRoot: string) {
  const from = path.join(srcRoot, templateName);
  const to = path.join(destRoot, 'src/util', templateName);

  if (await fs.pathExists(to)) {
    throw new Error(`src/util/${templateName} already exists. Remove it before running this command.`);
  }

  await fs.copy(from, to, { overwrite: false, errorOnExist: true });
  console.log(chalk.green(`${templateName} copied to src/util/${templateName}`));
}

export async function addToClient(command: string, options: AddToClientOptions = {}) {
  const srcRoot = options.templatesRoot ?? path.resolve(__dirname, '../templates');
  const destRoot = options.destRoot ?? process.cwd();

  switch (command) {
    case 'util-array': {
      await copyTemplate('array', srcRoot, destRoot);
      break;
    }

    case 'util-blob': {
      await copyTemplate('blob', srcRoot, destRoot);
      break;
    }

    case 'util-classname': {
      await copyTemplate('classname', srcRoot, destRoot);
      break;
    }

    case 'util-dom': {
      await copyTemplate('dom', srcRoot, destRoot);
      break;
    }

    case 'util-file': {
      await copyTemplate('file', srcRoot, destRoot);
      break;
    }

    case 'util-mask': {
      await copyTemplate('mask', srcRoot, destRoot);
      break;
    }

    case 'util-object': {
      await copyTemplate('object', srcRoot, destRoot);
      break;
    }

    case 'util-picklist': {
      await copyTemplate('picklist', srcRoot, destRoot);
      break;
    }

    case 'util-string': {
      await copyTemplate('string', srcRoot, destRoot);
      break;
    }

    case 'util-tailwind': {
      await copyTemplate('tailwind', srcRoot, destRoot);
      break;
    }

    case 'util-validation': {
      await copyTemplate('validation', srcRoot, destRoot);
      break;
    }

    case 'util-all': {
      const existingTemplates = [];

      for (const templateName of utilTemplates) {
        const to = path.join(destRoot, 'src/util', templateName);
        if (await fs.pathExists(to)) {
          existingTemplates.push(`src/util/${templateName}`);
        }
      }

      if (existingTemplates.length > 0) {
        throw new Error(`Cannot copy util-all because these paths already exist: ${existingTemplates.join(', ')}`);
      }

      for (const templateName of utilTemplates) {
        if (!commandTemplateMap.has(`util-${templateName}`)) continue;

        await copyTemplate(templateName, srcRoot, destRoot);
      }
    
      break;
    }

    default:
      throw new Error(`add command "${command}" not recognized.`);
  }
};