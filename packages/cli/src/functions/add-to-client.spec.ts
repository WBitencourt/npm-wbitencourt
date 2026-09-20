import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addToClient } from './add-to-client.js';

let originalCwd: string;
let projectDir: string;

async function pathExists(filePath: string) {
  try {
    await readFile(filePath);
    return true;
  } catch {
    return false;
  }
}

describe('addToClient', () => {
  beforeEach(async () => {
    originalCwd = process.cwd();
    projectDir = await mkdtemp(path.join(tmpdir(), 'wbitencourt-cli-'));
    await mkdir(path.join(projectDir, 'src'), { recursive: true });
    process.chdir(projectDir);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await rm(projectDir, { recursive: true, force: true });
  });

  it('copies a requested utility without specs', async () => {
    await addToClient('util-mask');

    expect(await pathExists(path.join(projectDir, 'src/util/mask/index.ts'))).toBe(true);
    expect(await pathExists(path.join(projectDir, 'src/util/mask/mask-cpf-cnpj.spec.ts'))).toBe(false);
  });

  it('refuses to overwrite an existing utility', async () => {
    const existingFile = path.join(projectDir, 'src/util/mask/index.ts');
    await mkdir(path.dirname(existingFile), { recursive: true });
    await writeFile(existingFile, 'custom local changes');

    await expect(addToClient('util-mask')).rejects.toThrow('Refusing to overwrite');
    await expect(readFile(existingFile, 'utf8')).resolves.toBe('custom local changes');
  });

  it('preflights util-all before copying any utilities', async () => {
    const existingFile = path.join(projectDir, 'src/util/array/index.ts');
    await mkdir(path.dirname(existingFile), { recursive: true });
    await writeFile(existingFile, 'custom local changes');

    await expect(addToClient('util-all')).rejects.toThrow('Refusing to overwrite');
    expect(await pathExists(path.join(projectDir, 'src/util/mask/index.ts'))).toBe(false);
    await expect(readFile(existingFile, 'utf8')).resolves.toBe('custom local changes');
  });
});
