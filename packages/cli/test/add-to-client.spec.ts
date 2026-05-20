import { afterEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { addToClient } from '../src/functions/add-to-client.js';

const originalCwd = process.cwd();
let tempDir: string | undefined;

async function useTempProject() {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
  process.chdir(tempDir);
  return tempDir;
}

afterEach(async () => {
  process.chdir(originalCwd);

  if (tempDir) {
    await fs.remove(tempDir);
    tempDir = undefined;
  }
});

describe('addToClient', () => {
  it('copies a utility template into the current project', async () => {
    const projectDir = await useTempProject();

    await addToClient('util-mask');

    await expect(fs.pathExists(path.join(projectDir, 'src/util/mask/index.ts'))).resolves.toBe(true);
  });

  it('copies every utility template for util-all', async () => {
    const projectDir = await useTempProject();

    await addToClient('util-all');

    await expect(fs.pathExists(path.join(projectDir, 'src/util/array/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectDir, 'src/util/picklist/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectDir, 'src/util/object/index.ts'))).resolves.toBe(true);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const projectDir = await useTempProject();
    await fs.ensureDir(path.join(projectDir, 'src/util/mask'));
    await fs.writeFile(path.join(projectDir, 'src/util/mask/index.ts'), 'custom local implementation');

    await expect(addToClient('util-mask')).rejects.toThrow('Refusing to overwrite existing utility');
    await expect(fs.readFile(path.join(projectDir, 'src/util/mask/index.ts'), 'utf8')).resolves.toBe(
      'custom local implementation',
    );
  });
});
