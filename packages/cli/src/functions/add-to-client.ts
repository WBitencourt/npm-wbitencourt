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
    case 'util-mask': {
      const from = path.join(srcRoot, 'mask/src');
      const to = path.join(destRoot, 'src/util/mask');
      await fs.copy(from, to);
      console.log(chalk.green('util-mask copied to src/util/mask!'));
      break;
    }

    case 'util-all': {
      const utilDirs = await fs.readdir(srcRoot);
      
      for (const dir of utilDirs) {
        const from = path.join(srcRoot, dir, 'src');
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