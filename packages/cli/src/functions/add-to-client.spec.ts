import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { addToClient } from './add-to-client.js';

describe('addToClient', () => {
  let previousCwd: string;
  let tempDir: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    tempDir = await mkdtemp(path.join(tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
  });

  afterEach(async () => {
    process.chdir(previousCwd);
    await rm(tempDir, { recursive: true, force: true });
  });

  it('copies the requested utility template', async () => {
    await addToClient('util-object');

    const copied = await readFile(path.join(tempDir, 'src/util/object/index.ts'), 'utf8');
    expect(copied).toContain('export const object');
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const existingFile = path.join(tempDir, 'src/util/mask/index.ts');
    await mkdir(path.dirname(existingFile), { recursive: true });
    await writeFile(existingFile, 'custom user code');

    await expect(addToClient('util-mask')).rejects.toThrow('src/util/mask already exists');
    await expect(readFile(existingFile, 'utf8')).resolves.toBe('custom user code');
  });

  it('preflights util-all before copying any templates', async () => {
    const existingFile = path.join(tempDir, 'src/util/string/index.ts');
    await mkdir(path.dirname(existingFile), { recursive: true });
    await writeFile(existingFile, 'custom user code');

    await expect(addToClient('util-all')).rejects.toThrow('src/util/string already exists');
    expect(existsSync(path.join(tempDir, 'src/util/array'))).toBe(false);
    await expect(readFile(existingFile, 'utf8')).resolves.toBe('custom user code');
  });
});
