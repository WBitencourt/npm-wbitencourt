import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, '..');
const utilSrcRoot = path.resolve(packageRoot, '../util/src');
const templatesDestRoot = path.resolve(packageRoot, 'dist/templates');

await rm(templatesDestRoot, { recursive: true, force: true });
await mkdir(templatesDestRoot, { recursive: true });

const entries = await readdir(utilSrcRoot, { withFileTypes: true });
const utilDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

for (const utilDir of utilDirs) {
  await cp(path.join(utilSrcRoot, utilDir), path.join(templatesDestRoot, utilDir), {
    recursive: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
}
