import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addToClient } from './add-to-client';

describe('addToClient', () => {
  const originalCwd = process.cwd();
  let tempDir: string | undefined;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    vi.restoreAllMocks();

    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = undefined;
    }
  });

  it('copies all utility directories for util-all', async () => {
    await addToClient('util-all');

    await expect(
      readFile(path.join(tempDir!, 'src/util/array/index.ts'), 'utf8')
    ).resolves.toContain('array');
    await expect(
      readFile(path.join(tempDir!, 'src/util/mask/index.ts'), 'utf8')
    ).resolves.toContain('mask');
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const existingMaskFile = path.join(tempDir!, 'src/util/mask/index.ts');
    await mkdir(path.dirname(existingMaskFile), { recursive: true });
    await writeFile(existingMaskFile, 'custom mask implementation');

    await expect(addToClient('util-mask')).rejects.toThrow(
      'Refusing to overwrite existing util files: src/util/mask'
    );
    await expect(readFile(existingMaskFile, 'utf8')).resolves.toBe(
      'custom mask implementation'
    );
  });

  it('preflights util-all destinations before copying any directory', async () => {
    const existingMaskFile = path.join(tempDir!, 'src/util/mask/index.ts');
    await mkdir(path.dirname(existingMaskFile), { recursive: true });
    await writeFile(existingMaskFile, 'custom mask implementation');

    await expect(addToClient('util-all')).rejects.toThrow(
      'Refusing to overwrite existing util files'
    );
    await expect(readFile(existingMaskFile, 'utf8')).resolves.toBe(
      'custom mask implementation'
    );
    await expect(
      readFile(path.join(tempDir!, 'src/util/array/index.ts'), 'utf8')
    ).rejects.toThrow();
  });
});
