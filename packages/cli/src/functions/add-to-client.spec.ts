import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { addToClient } from './add-to-client';

const templateNames = [
  'array',
  'blob',
  'classname',
  'dom',
  'file',
  'mask',
  'object',
  'picklist',
  'string',
  'tailwind',
  'validation',
];

const tempDirs: string[] = [];

async function makeTempDir() {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
  tempDirs.push(tempDir);
  return tempDir;
}

async function createTemplateRoot(templateNamesToCreate = templateNames) {
  const templateRoot = await makeTempDir();

  for (const templateName of templateNamesToCreate) {
    await fs.outputFile(
      path.join(templateRoot, templateName, 'index.ts'),
      `export const ${templateName.replace('-', '')} = {};`
    );
  }

  return templateRoot;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((tempDir) => fs.remove(tempDir)));
});

describe('addToClient', () => {
  it('copies a requested utility template into the client project', async () => {
    const templateRoot = await createTemplateRoot(['mask']);
    const destRoot = await makeTempDir();

    await addToClient('util-mask', { destRoot, templateRoot });

    await expect(fs.pathExists(path.join(destRoot, 'src/util/mask/index.ts'))).resolves.toBe(true);
  });

  it('supports object and picklist utility commands', async () => {
    const templateRoot = await createTemplateRoot(['object', 'picklist']);
    const destRoot = await makeTempDir();

    await addToClient('util-object', { destRoot, templateRoot });
    await addToClient('util-picklist', { destRoot, templateRoot });

    await expect(fs.pathExists(path.join(destRoot, 'src/util/object/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(destRoot, 'src/util/picklist/index.ts'))).resolves.toBe(true);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    const templateRoot = await createTemplateRoot(['mask']);
    const destRoot = await makeTempDir();
    const existingFile = path.join(destRoot, 'src/util/mask/index.ts');
    await fs.outputFile(existingFile, 'export const existing = true;');

    await expect(addToClient('util-mask', { destRoot, templateRoot }))
      .rejects
      .toThrow('Refusing to overwrite existing src/util/mask.');

    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('export const existing = true;');
  });

  it('preflights util-all before copying to avoid partial writes', async () => {
    const templateRoot = await createTemplateRoot();
    const destRoot = await makeTempDir();
    await fs.outputFile(path.join(destRoot, 'src/util/mask/index.ts'), 'export const existing = true;');

    await expect(addToClient('util-all', { destRoot, templateRoot }))
      .rejects
      .toThrow('Refusing to overwrite existing src/util/mask.');

    await expect(fs.pathExists(path.join(destRoot, 'src/util/array/index.ts'))).resolves.toBe(false);
  });
});
