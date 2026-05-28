import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { addToClient } from './add-to-client.js';

describe('addToClient', () => {
  let tempDir: string;
  let previousCwd: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(previousCwd);
    await fs.remove(tempDir);
  });

  it('copies a requested utility into the client project', async () => {
    await addToClient('util-mask');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).toBe(true);
  });

  it('copies every available utility for util-all', async () => {
    await addToClient('util-all');

    await expect(fs.pathExists(path.join(tempDir, 'src/util/array/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/string/index.ts'))).resolves.toBe(true);
  });

  it('refuses to overwrite an existing client utility', async () => {
    const existingFile = path.join(tempDir, 'src/util/mask/index.ts');
    await fs.outputFile(existingFile, 'custom local implementation');

    await expect(addToClient('util-mask')).rejects.toThrow('Refusing to overwrite existing utilities: src/util/mask');
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('custom local implementation');
  });
});
