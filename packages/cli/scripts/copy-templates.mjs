import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilSrcRoot = path.resolve(__dirname, '../../util/src');
const templatesRoot = path.resolve(__dirname, '../dist/templates');

await rm(templatesRoot, { recursive: true, force: true });
await mkdir(templatesRoot, { recursive: true });

const entries = await readdir(utilSrcRoot);

for (const entry of entries) {
  const from = path.join(utilSrcRoot, entry);
  const entryStat = await stat(from);

  if (!entryStat.isDirectory()) {
    continue;
  }

  await cp(from, path.join(templatesRoot, entry), {
    recursive: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
}
