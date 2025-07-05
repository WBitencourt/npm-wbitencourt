import chalk from "chalk";
import path from "path";
import fs from "fs-extra";
export async function copyToClient(command) {
    const srcRoot = path.resolve(__dirname, '../../util');
    const destRoot = process.cwd();
    switch (command) {
        case 'util-mask': {
            const from = path.join(srcRoot, 'mask/src');
            const to = path.join(destRoot, 'src/util/mask');
            await fs.copy(from, to);
            console.log(chalk.green('util-mask copiado para src/util/mask!'));
            break;
        }
        case 'util-all': {
            const fromMask = path.join(srcRoot, 'mask/src');
            const toMask = path.join(destRoot, 'src/util/mask');
            await fs.copy(fromMask, toMask);
            console.log(chalk.green('Todos os utils copiados!'));
            break;
        }
        default:
            console.log(chalk.red(`Util "${command}" não reconhecido.`));
            break;
    }
}
;
