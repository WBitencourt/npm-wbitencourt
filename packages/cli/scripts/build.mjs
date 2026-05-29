import { spawnSync } from 'node:child_process';
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = path.join(packageRoot, 'dist');
const utilSrcRoot = path.resolve(packageRoot, '../util/src');
const templatesRoot = path.join(distRoot, 'templates');

await rm(distRoot, { recursive: true, force: true });

const tscCommand = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
const tsc = spawnSync(tscCommand, { cwd: packageRoot, stdio: 'inherit' });

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}

await mkdir(templatesRoot, { recursive: true });

for (const entry of await readdir(utilSrcRoot, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;

  await cp(path.join(utilSrcRoot, entry.name), path.join(templatesRoot, entry.name), {
    recursive: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
}
