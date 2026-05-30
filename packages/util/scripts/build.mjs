import { spawnSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

await rm(path.join(packageRoot, 'dist'), { recursive: true, force: true });

const tscCommand = process.platform === 'win32' ? 'tsc.cmd' : 'tsc';
const tsc = spawnSync(tscCommand, { cwd: packageRoot, stdio: 'inherit' });

if (tsc.status !== 0) {
  process.exit(tsc.status ?? 1);
}
