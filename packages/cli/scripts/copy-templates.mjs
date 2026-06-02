import { cp, mkdir, rm } from 'node:fs/promises';
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

const utilSourceRoot = path.resolve(__dirname, '../../util/src');
const templatesRoot = path.resolve(__dirname, '../dist/templates');

await rm(templatesRoot, { recursive: true, force: true });
await mkdir(templatesRoot, { recursive: true });

for (const directory of utilityDirectories) {
  await cp(
    path.join(utilSourceRoot, directory),
    path.join(templatesRoot, directory),
    {
      recursive: true,
      filter: (source) => !source.endsWith('.spec.ts'),
    }
  );
}
