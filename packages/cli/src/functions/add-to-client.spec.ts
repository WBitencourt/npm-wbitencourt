import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { addToClient } from './add-to-client';

const originalCwd = process.cwd();
let tempDir = '';

describe('addToClient', () => {
  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(tempDir);
  });

  it('copies a utility template without test files', async () => {
    await addToClient('util-mask');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/mask-cpf-cnpj.spec.ts'))).toBe(false);
  });

  it('supports object and picklist utility commands', async () => {
    await addToClient('util-object');
    await addToClient('util-picklist');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/object/index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/picklist/index.ts'))).toBe(true);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    await fs.ensureDir(path.join(tempDir, 'src/util/mask'));

    await expect(addToClient('util-mask')).rejects.toThrow('src/util/mask already exists');
  });

  it('preflights util-all before copying any directories', async () => {
    await fs.ensureDir(path.join(tempDir, 'src/util/mask'));

    await expect(addToClient('util-all')).rejects.toThrow('Cannot copy util-all');
    expect(await fs.pathExists(path.join(tempDir, 'src/util/array'))).toBe(false);
  });
});
