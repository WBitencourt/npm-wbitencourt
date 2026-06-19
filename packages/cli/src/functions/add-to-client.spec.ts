import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addToClient } from './add-to-client';

const originalCwd = process.cwd();

describe('addToClient', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    vi.restoreAllMocks();
    await fs.remove(tempDir);
  });

  it('copies a utility template without test files', async () => {
    await addToClient('util-mask');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/mask-cpf-cnpj.spec.ts'))).toBe(false);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const existingFile = path.join(tempDir, 'src/util/mask/index.ts');
    await fs.outputFile(existingFile, 'existing user code');

    await expect(addToClient('util-mask')).rejects.toThrow('Refusing to overwrite existing directory');
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('existing user code');
  });

  it('preflights util-all before copying any template', async () => {
    await fs.ensureDir(path.join(tempDir, 'src/util/mask'));

    await expect(addToClient('util-all')).rejects.toThrow('Refusing to overwrite existing directory');
    expect(await fs.pathExists(path.join(tempDir, 'src/util/array'))).toBe(false);
  });
});
