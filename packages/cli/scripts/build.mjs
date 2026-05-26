import { spawn } from 'node:child_process';
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptPath = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(scriptPath), '..');
const repoRoot = path.resolve(packageRoot, '../..');
const distRoot = path.join(packageRoot, 'dist');
const templatesRoot = path.join(distRoot, 'templates');
const utilSourceRoot = path.join(repoRoot, 'packages/util/src');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: packageRoot,
      shell: process.platform === 'win32',
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

await rm(distRoot, { recursive: true, force: true });
await run('npx', ['tsc', '-p', path.join(packageRoot, 'tsconfig.json')]);
await mkdir(templatesRoot, { recursive: true });

const entries = await readdir(utilSourceRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  await cp(path.join(utilSourceRoot, entry.name), path.join(templatesRoot, entry.name), {
    recursive: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
}
