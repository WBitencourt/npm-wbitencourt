import { spawn } from 'node:child_process';
import { rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const packageRoot = path.resolve(path.dirname(__filename), '..');
const distRoot = path.join(packageRoot, 'dist');

function run(command) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, {
      cwd: packageRoot,
      shell: true,
      stdio: 'inherit',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} failed with exit code ${code}`));
    });
  });
}

await rm(distRoot, { force: true, recursive: true });
await run('tsc');
