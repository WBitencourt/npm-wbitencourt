import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const distDir = 'dist';
const templatesDir = join(distDir, 'templates');
const utilSrcDir = '../util/src';

rmSync(distDir, { recursive: true, force: true });
execFileSync('tsc', { stdio: 'inherit', shell: process.platform === 'win32' });
mkdirSync(templatesDir, { recursive: true });

for (const entry of readdirSync(utilSrcDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }

  const from = join(utilSrcDir, entry.name);
  const to = join(templatesDir, entry.name);

  if (!existsSync(join(from, 'index.ts'))) {
    continue;
  }

  cpSync(from, to, {
    recursive: true,
    filter: (source) => !source.endsWith('.spec.ts'),
  });
}
