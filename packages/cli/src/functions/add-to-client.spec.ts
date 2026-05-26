import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addToClient } from './add-to-client.js';

const originalCwd = process.cwd();
let projectRoot: string;

describe('addToClient', () => {
  beforeEach(async () => {
    projectRoot = await mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(projectRoot);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(projectRoot, { recursive: true, force: true });
  });

  it('copies a requested utility and refuses to overwrite it later', async () => {
    await addToClient('util-string');

    const utilityIndex = path.join(projectRoot, 'src/util/string/index.ts');
    expect(await readFile(utilityIndex, 'utf8')).toContain('export const string');

    await writeFile(utilityIndex, 'local changes');
    await expect(addToClient('util-string')).rejects.toThrow(/Refusing to overwrite/);
    expect(await readFile(utilityIndex, 'utf8')).toBe('local changes');
  });

  it('copies all utility template directories', async () => {
    await addToClient('util-all');

    await expect(fs.pathExists(path.join(projectRoot, 'src/util/mask/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectRoot, 'src/util/object/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectRoot, 'src/util/picklist/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectRoot, 'src/util/README.md'))).resolves.toBe(false);
  });
});
