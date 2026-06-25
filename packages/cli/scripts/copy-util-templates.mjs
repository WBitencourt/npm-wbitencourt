import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(packageRoot, '..', '..');
const utilSourceRoot = path.join(workspaceRoot, 'packages', 'util', 'src');
const templatesRoot = path.join(packageRoot, 'dist', 'templates', 'util');

const shouldCopy = (source) => {
  return !source.endsWith('.spec.ts') && !source.endsWith('.spec.js') && !source.endsWith('.spec.d.ts');
};

await rm(templatesRoot, { recursive: true, force: true });
await mkdir(templatesRoot, { recursive: true });

const entries = await readdir(utilSourceRoot, { withFileTypes: true });
for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  await cp(path.join(utilSourceRoot, entry.name), path.join(templatesRoot, entry.name), {
    recursive: true,
    filter: shouldCopy,
  });
}
