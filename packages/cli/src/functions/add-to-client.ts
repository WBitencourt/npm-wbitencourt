import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getUtilSourceRoot() {
  const packagedTemplatesRoot = path.resolve(__dirname, '../../templates/util');
  if (await fs.pathExists(packagedTemplatesRoot)) {
    return packagedTemplatesRoot;
  }

  return path.resolve(__dirname, '../../../../packages/util/src');
}

async function copyUtility(srcRoot: string, destRoot: string, utilityName: string) {
  const from = path.join(srcRoot, utilityName);
  const to = path.join(destRoot, 'src/util', utilityName);

  await fs.copy(from, to);
}

export async function addToClient(command: string) {
  const srcRoot = await getUtilSourceRoot();
  const destRoot = process.cwd();

  switch (command) {
    case 'util-array': {
      await copyUtility(srcRoot, destRoot, 'array');
      console.log(chalk.green('util-array copied to src/util/array'));
      break;
    }

    case 'util-blob': {
      await copyUtility(srcRoot, destRoot, 'blob');
      console.log(chalk.green('util-blob copied to src/util/blob'));
      break;
    }

    case 'util-classname': {
      await copyUtility(srcRoot, destRoot, 'classname');
      console.log(chalk.green('util-classname copied to src/util/classname'));
      break;
    }

    case 'util-dom': {
      await copyUtility(srcRoot, destRoot, 'dom');
      console.log(chalk.green('util-dom copied to src/util/dom'));
      break;
    }

    case 'util-file': {
      await copyUtility(srcRoot, destRoot, 'file');
      console.log(chalk.green('util-file copied to src/util/file'));
      break;
    }

    case 'util-mask': {
      await copyUtility(srcRoot, destRoot, 'mask');
      console.log(chalk.green('util-mask copied to src/util/mask'));
      break;
    }

    case 'util-string': {
      await copyUtility(srcRoot, destRoot, 'string');
      console.log(chalk.green('util-string copied to src/util/string'));
      break;
    }

    case 'util-tailwind': {
      await copyUtility(srcRoot, destRoot, 'tailwind');
      console.log(chalk.green('util-tailwind copied to src/util/tailwind'));
      break;
    }

    case 'util-validation': {
      await copyUtility(srcRoot, destRoot, 'validation');
      console.log(chalk.green('util-validation copied to src/util/validation'));
      break;
    }

    case 'util-all': {
      const utilDirs = await fs.readdir(srcRoot);
      
      for (const dir of utilDirs) {
        const from = path.join(srcRoot, dir);
        const to = path.join(destRoot, 'src/util', dir);
    
        const fromExists = await fs.pathExists(from);
        if (!fromExists) continue;

        const fromStats = await fs.stat(from);
        if (!fromStats.isDirectory()) continue;
    
        await fs.copy(from, to);
        console.log(chalk.green(`${dir} copied to src/util/${dir}`));
      }
    
      break;
    }

    default:
      console.log(chalk.red(`add command "${command}" not recognized.`));
      break;
  }
};