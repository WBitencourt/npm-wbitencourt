import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { addToClient } from './add-to-client';

describe('CLI: addToClient', () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    vi.restoreAllMocks();
    await fs.remove(tempDir);
  });

  it('copies a requested utility into the client project', async () => {
    await addToClient('util-mask');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).toBe(true);
  });

  it('copies all utility directories, including object and picklist', async () => {
    await addToClient('util-all');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/object/index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/picklist/index.ts'))).toBe(true);
  });

  it('refuses to overwrite an existing client utility', async () => {
    const existingFile = path.join(tempDir, 'src/util/mask/index.ts');
    await fs.outputFile(existingFile, 'custom user code');

    await expect(addToClient('util-mask')).rejects.toThrow('refusing to overwrite');
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('custom user code');
  });
});
