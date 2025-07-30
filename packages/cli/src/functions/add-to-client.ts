import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function addToClient(command: string) {
  const srcRoot = path.resolve(__dirname, '../../../../packages/util');
  const destRoot = process.cwd();

  switch (command) {
    case 'util-array': {
      const from = path.join(srcRoot, 'src/array');
      const to = path.join(destRoot, 'src/util/array');
      await fs.copy(from, to);
      console.log(chalk.green('util-array copied to src/util/array'));
      break;
    }

    case 'util-blob': {
      const from = path.join(srcRoot, 'src/blob');
      const to = path.join(destRoot, 'src/util/blob');
      await fs.copy(from, to);
      console.log(chalk.green('util-blob copied to src/util/blob'));
      break;
    }

    case 'util-classname': {
      const from = path.join(srcRoot, 'src/classname');
      const to = path.join(destRoot, 'src/util/classname');
      await fs.copy(from, to);
      console.log(chalk.green('util-classname copied to src/util/classname'));
      break;
    }

    case 'util-dom': {
      const from = path.join(srcRoot, 'src/dom');
      const to = path.join(destRoot, 'src/util/dom');
      await fs.copy(from, to);
      console.log(chalk.green('util-dom copied to src/util/dom'));
      break;
    }

    case 'util-file': {
      const from = path.join(srcRoot, 'src/file');
      const to = path.join(destRoot, 'src/util/file');
      await fs.copy(from, to);
      console.log(chalk.green('util-file copied to src/util/file'));
      break;
    }

    case 'util-mask': {
      const from = path.join(srcRoot, 'src/mask');
      const to = path.join(destRoot, 'src/util/mask');
      await fs.copy(from, to);
      console.log(chalk.green('util-mask copied to src/util/mask'));
      break;
    }

    case 'util-string': {
      const from = path.join(srcRoot, 'src/string');
      const to = path.join(destRoot, 'src/util/string');
      await fs.copy(from, to);
      console.log(chalk.green('util-string copied to src/util/string'));
      break;
    }

    case 'util-tailwind': {
      const from = path.join(srcRoot, 'src/tailwind');
      const to = path.join(destRoot, 'src/util/tailwind');
      await fs.copy(from, to);
      console.log(chalk.green('util-tailwind copied to src/util/tailwind'));
      break;
    }

    case 'util-validation': {
      const from = path.join(srcRoot, 'src/validation');
      const to = path.join(destRoot, 'src/util/validation');
      await fs.copy(from, to);
      console.log(chalk.green('util-validation copied to src/util/validation'));
      break;
    }

    case 'util-all': {
      const utilDirs = await fs.readdir(srcRoot);
      
      for (const dir of utilDirs) {
        const from = path.join(srcRoot, 'src', dir);
        const to = path.join(destRoot, 'src/util', dir);
    
        const fromExists = await fs.pathExists(from);
        if (!fromExists) continue;
    
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