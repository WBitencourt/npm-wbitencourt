
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// @ts-ignore
const packageJson = require('../../../../package.json');

import chalk from 'chalk';

export const versionPackage = () => {
  console.log(chalk.green(packageJson.version));
};