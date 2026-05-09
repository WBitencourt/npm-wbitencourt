import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilityDirectories = [
  'array',
  'blob',
  'classname',
  'dom',
  'file',
  'mask',
  'object',
  'picklist',
  'string',
  'tailwind',
  'validation',
];

const srcRoot = path.resolve(__dirname, '../../util/src');
const destRoot = path.resolve(__dirname, '../dist/util');

await fs.emptyDir(destRoot);

for (const directory of utilityDirectories) {
  await fs.copy(path.join(srcRoot, directory), path.join(destRoot, directory));
}
