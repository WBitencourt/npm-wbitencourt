import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { addToClient } from './add-to-client.js';

describe('addToClient', () => {
  const originalCwd = process.cwd();
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(tempDir);
  });

  it('copies a requested utility into the current project', async () => {
    await addToClient('util-mask');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/mask-cpf-cnpj.spec.ts'))).toBe(false);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const existingFile = path.join(tempDir, 'src/util/mask/index.ts');
    await fs.outputFile(existingFile, 'custom implementation');

    await expect(addToClient('util-mask')).rejects.toThrow('Refusing to overwrite');
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('custom implementation');
  });

  it('preflights util-all before copying any utilities', async () => {
    await fs.outputFile(path.join(tempDir, 'src/util/string/index.ts'), 'custom implementation');

    await expect(addToClient('util-all')).rejects.toThrow('Refusing to overwrite');
    expect(await fs.pathExists(path.join(tempDir, 'src/util/array/index.ts'))).toBe(false);
  });
});
