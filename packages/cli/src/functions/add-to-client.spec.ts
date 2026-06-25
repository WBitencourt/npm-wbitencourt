import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';

import { addToClient } from './add-to-client';

describe('addToClient', () => {
  const originalCwd = process.cwd();
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(tempDir, { recursive: true, force: true });
  });

  it('copies a utility template without test files', async () => {
    await addToClient('util-mask');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/mask-cpf-cnpj.spec.ts'))).toBe(false);
  });

  it('supports object and picklist templates', async () => {
    await addToClient('util-object');
    await addToClient('util-picklist');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/object/index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/picklist/index.ts'))).toBe(true);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const existingFile = path.join(tempDir, 'src/util/mask/index.ts');
    await fs.ensureDir(path.dirname(existingFile));
    await writeFile(existingFile, 'const custom = true;\n');

    await expect(addToClient('util-mask')).rejects.toThrow('Refusing to overwrite existing directory');
    await expect(readFile(existingFile, 'utf8')).resolves.toBe('const custom = true;\n');
  });

  it('preflights util-all before copying any template', async () => {
    await fs.ensureDir(path.join(tempDir, 'src/util/array'));

    await expect(addToClient('util-all')).rejects.toThrow('Refusing to overwrite existing directory');
    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask'))).toBe(false);
  });
});
