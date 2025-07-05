#!/usr/bin/env node
import chalk from 'chalk';
import { init } from './commands/init.js';
import { add } from './commands/add.js';
const args = process.argv.slice(2);
const main = async () => {
    const command = args[0];
    switch (command) {
        case 'init':
            init();
            break;
        case 'add':
            await add(args[1]);
            break;
        default:
            console.log(chalk.yellow(`Unknown command: ${command}`));
            break;
    }
};
main();
