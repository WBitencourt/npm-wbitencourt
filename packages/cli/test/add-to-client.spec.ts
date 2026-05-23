import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addToClient } from '../src/functions/add-to-client';

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

describe('CLI: addToClient', () => {
  it('copies every utility directory for util-all', async () => {
    await addToClient('util-all');

    await expect(fs.pathExists(path.join(tempDir, 'src/util/array/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/object/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/picklist/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/string/index.ts'))).resolves.toBe(true);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const existingFile = path.join(tempDir, 'src/util/array/index.ts');
    await fs.outputFile(existingFile, 'custom implementation');

    await expect(addToClient('util-array')).rejects.toThrow('Refusing to overwrite existing src/util/array.');
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('custom implementation');
  });
});
