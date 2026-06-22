import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import fs from 'fs-extra';
import { addToClient } from './add-to-client.js';

describe('addToClient', () => {
  const originalCwd = process.cwd();
  let projectDir: string;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    projectDir = await mkdtemp(join(tmpdir(), 'wbitencourt-cli-'));
    process.chdir(projectDir);
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    logSpy.mockRestore();
    await rm(projectDir, { recursive: true, force: true });
  });

  it('copies a utility template without test files', async () => {
    await addToClient('util-mask');

    expect(await fs.pathExists(join(projectDir, 'src/util/mask/index.ts'))).toBe(true);
    expect(await fs.pathExists(join(projectDir, 'src/util/mask/mask-cpf-cnpj.spec.ts'))).toBe(false);
  });

  it('supports object and picklist utility commands', async () => {
    await addToClient('util-object');
    await addToClient('util-picklist');

    expect(await fs.pathExists(join(projectDir, 'src/util/object/index.ts'))).toBe(true);
    expect(await fs.pathExists(join(projectDir, 'src/util/picklist/index.ts'))).toBe(true);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const existingFile = join(projectDir, 'src/util/mask/index.ts');
    await fs.outputFile(existingFile, 'custom implementation');

    await expect(addToClient('util-mask')).rejects.toThrow('src/util/mask already exists');
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('custom implementation');
  });

  it('preflights util-all before copying any templates', async () => {
    await fs.outputFile(join(projectDir, 'src/util/array/index.ts'), 'custom implementation');

    await expect(addToClient('util-all')).rejects.toThrow('src/util/array already exists');

    expect(await fs.pathExists(join(projectDir, 'src/util/mask/index.ts'))).toBe(false);
    await expect(fs.readFile(join(projectDir, 'src/util/array/index.ts'), 'utf8')).resolves.toBe('custom implementation');
  });
});
