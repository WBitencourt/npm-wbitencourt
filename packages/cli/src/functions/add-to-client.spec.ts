import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addToClient } from './add-to-client';

describe('addToClient', () => {
  let originalCwd: string;
  let projectRoot: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    projectRoot = await mkdtemp(path.join(tmpdir(), 'wbitencourt-cli-'));
    process.chdir(projectRoot);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    vi.restoreAllMocks();
    await rm(projectRoot, { recursive: true, force: true });
  });

  it('copies an individual utility template into the client project', async () => {
    await addToClient('util-mask');

    const copiedTemplate = await readFile(path.join(projectRoot, 'src/util/mask/index.ts'), 'utf8');
    expect(copiedTemplate).toContain('export const mask');
  });

  it('copies all utility template directories', async () => {
    await addToClient('util-all');

    await expect(readFile(path.join(projectRoot, 'src/util/array/index.ts'), 'utf8')).resolves.toContain('export const array');
    await expect(readFile(path.join(projectRoot, 'src/util/mask/index.ts'), 'utf8')).resolves.toContain('export const mask');
    await expect(readFile(path.join(projectRoot, 'src/util/object/index.ts'), 'utf8')).resolves.toContain('export const object');
    await expect(readFile(path.join(projectRoot, 'src/util/picklist/index.ts'), 'utf8')).resolves.toContain('export const picklist');
    await expect(readFile(path.join(projectRoot, 'src/util/string/index.ts'), 'utf8')).resolves.toContain('export const string');
  });

  it('refuses to overwrite an existing client utility', async () => {
    const existingTemplate = path.join(projectRoot, 'src/util/mask/index.ts');
    await mkdir(path.dirname(existingTemplate), { recursive: true });
    await writeFile(existingTemplate, 'custom client code');

    await expect(addToClient('util-mask')).rejects.toThrow('Destination already exists');
    await expect(readFile(existingTemplate, 'utf8')).resolves.toBe('custom client code');
  });
});
