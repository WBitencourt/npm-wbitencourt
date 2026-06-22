import { cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourceRoot = resolve(__dirname, '../../util/src');
const templatesRoot = resolve(__dirname, '../dist/templates');

await rm(templatesRoot, { recursive: true, force: true });
await cp(sourceRoot, templatesRoot, {
  recursive: true,
  filter: (src) => !src.endsWith('.spec.ts'),
});
