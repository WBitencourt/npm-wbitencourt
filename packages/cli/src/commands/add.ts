import { addToClient } from '../functions/add-to-client.js';

export const add = async (command?: string) => {
  if (!command) {
    throw new Error('Please provide the name of the command to add.');
  }

  await addToClient(command);
};