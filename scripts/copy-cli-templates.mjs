import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const utilSourceRoot = path.join(repoRoot, 'packages/util/src');
const templateRoot = path.join(repoRoot, 'packages/cli/dist/templates');

await rm(templateRoot, { recursive: true, force: true });
await mkdir(templateRoot, { recursive: true });

const entries = await readdir(utilSourceRoot, { withFileTypes: true });
const utilDirectories = entries.filter((entry) => entry.isDirectory());

await Promise.all(
  utilDirectories.map((entry) =>
    cp(path.join(utilSourceRoot, entry.name), path.join(templateRoot, entry.name), {
      recursive: true,
      filter: (source) => !source.endsWith('.spec.ts'),
    }),
  ),
);
