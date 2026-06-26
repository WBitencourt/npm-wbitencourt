import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const workspaceRoot = path.resolve(packageRoot, '../..');
const utilSrcRoot = path.join(workspaceRoot, 'packages/util/src');
const templatesRoot = path.join(packageRoot, 'dist/templates/util');

await rm(templatesRoot, { recursive: true, force: true });
await mkdir(templatesRoot, { recursive: true });

const entries = await readdir(utilSrcRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  await cp(
    path.join(utilSrcRoot, entry.name),
    path.join(templatesRoot, entry.name),
    {
      recursive: true,
      filter: (source) => !source.endsWith('.spec.ts'),
    },
  );
}
