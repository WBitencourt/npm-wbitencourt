import { addToClient } from '../functions/add-to-client.js';
import chalk from 'chalk';

export const add = async (command?: string) => {
  if (!command) {
    console.log(chalk.red('Please provide the name of the command to add.'));
    return;
  }

  await addToClient(command);
};