import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { addToClient } from './add-to-client';

const originalCwd = process.cwd();

async function createTempProject() {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
  await mkdir(path.join(projectRoot, 'src'), { recursive: true });
  process.chdir(projectRoot);

  return projectRoot;
}

afterEach(() => {
  process.chdir(originalCwd);
});

describe('addToClient', () => {
  it('copies a utility template into the current project', async () => {
    const projectRoot = await createTempProject();

    await addToClient('util-mask');

    const copiedTemplate = await readFile(
      path.join(projectRoot, 'src/util/mask/index.ts'),
      'utf8',
    );

    expect(copiedTemplate).toContain('export const mask');

    await rm(projectRoot, { recursive: true, force: true });
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const projectRoot = await createTempProject();
    const existingIndex = path.join(projectRoot, 'src/util/mask/index.ts');
    await mkdir(path.dirname(existingIndex), { recursive: true });
    await writeFile(existingIndex, 'custom local implementation');

    await expect(addToClient('util-mask')).rejects.toThrow('Refusing to overwrite');
    await expect(readFile(existingIndex, 'utf8')).resolves.toBe('custom local implementation');

    await rm(projectRoot, { recursive: true, force: true });
  });

  it('preflights util-all before copying any template', async () => {
    const projectRoot = await createTempProject();
    await mkdir(path.join(projectRoot, 'src/util/mask'), { recursive: true });

    await expect(addToClient('util-all')).rejects.toThrow('Refusing to overwrite');
    await expect(readFile(path.join(projectRoot, 'src/util/array/index.ts'), 'utf8')).rejects.toThrow();

    await rm(projectRoot, { recursive: true, force: true });
  });
});
