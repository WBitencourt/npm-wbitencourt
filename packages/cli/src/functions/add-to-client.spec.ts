import { mkdtemp, mkdir, readFile, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addToClient } from './add-to-client';

let previousCwd: string;
let tempDir: string;

async function createProject() {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
  await mkdir(path.join(tempDir, 'src'), { recursive: true });
  process.chdir(tempDir);
}

describe('addToClient', () => {
  beforeEach(async () => {
    previousCwd = process.cwd();
    await createProject();
  });

  afterEach(async () => {
    process.chdir(previousCwd);
    await rm(tempDir, { recursive: true, force: true });
  });

  it('copies a requested utility template into the client project', async () => {
    await addToClient('util-mask');

    const content = await readFile(path.join(tempDir, 'src/util/mask/index.ts'), 'utf8');

    expect(content).toContain('export const mask');
  });

  it('supports utility namespaces exposed by @wbitencourt/util', async () => {
    await addToClient('util-object');
    await addToClient('util-picklist');

    await expect(readFile(path.join(tempDir, 'src/util/object/index.ts'), 'utf8')).resolves.toContain('export const object');
    await expect(readFile(path.join(tempDir, 'src/util/picklist/index.ts'), 'utf8')).resolves.toContain('export const picklist');
  });

  it('does not overwrite an existing utility directory', async () => {
    const existingFile = path.join(tempDir, 'src/util/mask/index.ts');
    await mkdir(path.dirname(existingFile), { recursive: true });
    await writeFile(existingFile, 'custom user code');

    await expect(addToClient('util-mask')).rejects.toThrow('Destination already exists');
    await expect(readFile(existingFile, 'utf8')).resolves.toBe('custom user code');
  });

  it('preflights util-all before copying any templates', async () => {
    const existingFile = path.join(tempDir, 'src/util/array/index.ts');
    await mkdir(path.dirname(existingFile), { recursive: true });
    await writeFile(existingFile, 'custom array code');

    await expect(addToClient('util-all')).rejects.toThrow('Destination already exists');
    await expect(readFile(existingFile, 'utf8')).resolves.toBe('custom array code');
    await expect(readFile(path.join(tempDir, 'src/util/blob/index.ts'), 'utf8')).rejects.toThrow();
  });
});
