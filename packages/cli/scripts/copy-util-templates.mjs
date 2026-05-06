import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cliRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(cliRoot, '../util/src');
const templateRoot = path.resolve(cliRoot, 'templates/util');

await fs.remove(templateRoot);
await fs.copy(sourceRoot, templateRoot);
