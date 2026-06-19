import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const cliRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = resolve(cliRoot, '../..');
const utilSrcRoot = resolve(repoRoot, 'packages/util/src');
const templatesRoot = resolve(cliRoot, 'dist/templates');

await rm(templatesRoot, { recursive: true, force: true });
await mkdir(templatesRoot, { recursive: true });

const entries = await readdir(utilSrcRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  await cp(
    join(utilSrcRoot, entry.name),
    join(templatesRoot, entry.name),
    {
      recursive: true,
      filter: (source) => !source.endsWith('.spec.ts'),
    },
  );
}
