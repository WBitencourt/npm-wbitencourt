import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const utilSrcRoot = path.resolve(packageRoot, '../util/src');
const templatesRoot = path.join(packageRoot, 'dist/templates');

await rm(templatesRoot, { recursive: true, force: true });
await mkdir(templatesRoot, { recursive: true });

const entries = await readdir(utilSrcRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  await cp(path.join(utilSrcRoot, entry.name), path.join(templatesRoot, entry.name), {
    recursive: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
}
