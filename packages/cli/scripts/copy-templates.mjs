import { cp, mkdir, readdir, rm } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilSourceRoot = path.resolve(__dirname, '../../util/src');
const templateRoot = path.resolve(__dirname, '../dist/templates');

await rm(templateRoot, { recursive: true, force: true });
await mkdir(templateRoot, { recursive: true });

const entries = await readdir(utilSourceRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  const from = path.join(utilSourceRoot, entry.name);
  const to = path.join(templateRoot, entry.name);

  await cp(from, to, {
    recursive: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
}
