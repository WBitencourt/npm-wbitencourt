#!/usr/bin/env node
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const args = process.argv.slice(2);
const showHello = () => {
    console.log(chalk.green('Hello world!'));
};
const copyUtil = async (util) => {
    const srcRoot = path.resolve(__dirname, '../../util');
    const destRoot = process.cwd();
    if (util === 'util-mask') {
        const from = path.join(srcRoot, 'mask/src');
        const to = path.join(destRoot, 'src/util/mask');
        await fs.copy(from, to);
        console.log(chalk.green('util-mask copiado para src/util/mask!'));
    }
    else if (util === 'util-all') {
        const fromMask = path.join(srcRoot, 'mask/src');
        const toMask = path.join(destRoot, 'src/util/mask');
        await fs.copy(fromMask, toMask);
        console.log(chalk.green('Todos os utils copiados!'));
    }
    else {
        console.log(chalk.red(`Util "${util}" não reconhecido.`));
    }
};
const run = async () => {
    if (args[0] === 'init') {
        if (args[1] === 'add') {
            const util = args[2];
            await copyUtil(util);
        }
        else {
            showHello();
        }
    }
    else {
        console.log(chalk.yellow('Comando desconhecido.'));
    }
};
run();
