import { execFileSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('util package entrypoint', () => {
  it('loads the compiled ESM entrypoint and exposes documented modules', async () => {
    execFileSync('npm', ['run', 'build'], {
      cwd: packageRoot,
      stdio: 'pipe',
    });

    const entrypoint = pathToFileURL(resolve(packageRoot, 'dist', 'index.js')).href;
    const { util } = await import(entrypoint);

    expect(util.mask.cpf('12345678901')).toBe('123.456.789-01');
    expect(util.string.format.numberBRLCurrency(1234.5)).toBe('R$ 1.234,50');
    expect(util.object.compare.isEqual({ id: 1 }, { id: 1 })).toBe(true);
    expect(util.picklist.uf.length).toBeGreaterThan(0);
  });
});
