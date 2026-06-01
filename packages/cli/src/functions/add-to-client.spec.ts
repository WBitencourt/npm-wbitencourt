import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { addToClient } from './add-to-client';

describe('addToClient', () => {
  const originalCwd = process.cwd();
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    process.chdir(originalCwd);
    await fs.remove(tempDir);
  });

  it('copies a utility directory into the client project', async () => {
    await addToClient('util-array');

    await expect(fs.pathExists(path.join(tempDir, 'src/util/array/index.ts'))).resolves.toBe(true);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const existingFile = path.join(tempDir, 'src/util/array/index.ts');
    await fs.outputFile(existingFile, 'custom client implementation');

    await expect(addToClient('util-array')).rejects.toThrow('Refusing to overwrite existing directory');
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('custom client implementation');
  });

  it('checks util-all destinations before copying any directory', async () => {
    await fs.ensureDir(path.join(tempDir, 'src/util/array'));

    await expect(addToClient('util-all')).rejects.toThrow('Refusing to overwrite existing directory');
    await expect(fs.pathExists(path.join(tempDir, 'src/util/blob'))).resolves.toBe(false);
  });
});
