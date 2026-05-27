import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addToClient } from './add-to-client';

async function pathExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

describe('addToClient', () => {
  let cwd: string;
  let tmpDir: string;

  beforeEach(async () => {
    cwd = process.cwd();
    tmpDir = await mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tmpDir);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    process.chdir(cwd);
    vi.restoreAllMocks();
    await rm(tmpDir, { force: true, recursive: true });
  });

  it('copies a utility from the bundled templates without test files', async () => {
    await addToClient('util-mask');

    expect(await pathExists(path.join(tmpDir, 'src/util/mask/index.ts'))).toBe(true);
    expect(await pathExists(path.join(tmpDir, 'src/util/mask/mask-cpf-cnpj.spec.ts'))).toBe(false);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    await addToClient('util-mask');
    await writeFile(path.join(tmpDir, 'src/util/mask/index.ts'), 'custom local changes');

    await expect(addToClient('util-mask')).rejects.toThrow(/Refusing to overwrite/);
    await expect(readFile(path.join(tmpDir, 'src/util/mask/index.ts'), 'utf8')).resolves.toBe('custom local changes');
  });

  it('preflights util-all before copying to avoid partial writes', async () => {
    await addToClient('util-mask');

    await expect(addToClient('util-all')).rejects.toThrow(/Refusing to overwrite/);
    expect(await pathExists(path.join(tmpDir, 'src/util/array/index.ts'))).toBe(false);
  });

  it('copies every available utility with util-all', async () => {
    await addToClient('util-all');

    for (const utility of ['array', 'blob', 'classname', 'dom', 'file', 'mask', 'object', 'picklist', 'string', 'tailwind', 'validation']) {
      expect(await pathExists(path.join(tmpDir, 'src/util', utility, 'index.ts'))).toBe(true);
    }
  });
});
