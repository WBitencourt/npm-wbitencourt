import { afterEach, describe, expect, it } from 'vitest';
import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { addToClient } from './add-to-client';

const utilTemplates = [
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

const tempRoots: string[] = [];

async function createTempRoot() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-add-test-'));
  tempRoots.push(tempRoot);

  return tempRoot;
}

async function createTemplate(templatesRoot: string, templateName: string, content = `export const ${templateName} = {};`) {
  const templateRoot = path.join(templatesRoot, templateName);
  await fs.ensureDir(templateRoot);
  await fs.writeFile(path.join(templateRoot, 'index.ts'), content);
}

describe('addToClient', () => {
  afterEach(async () => {
    await Promise.all(tempRoots.splice(0).map((tempRoot) => fs.remove(tempRoot)));
  });

  it('copies a requested utility template into the client project', async () => {
    const tempRoot = await createTempRoot();
    const templatesRoot = path.join(tempRoot, 'templates');
    const destRoot = path.join(tempRoot, 'project');
    await createTemplate(templatesRoot, 'object', 'export const object = { compare: {} };');

    await addToClient('util-object', { destRoot, templatesRoot });

    await expect(fs.pathExists(path.join(destRoot, 'src/util/object/index.ts'))).resolves.toBe(true);
  });

  it('refuses to overwrite an existing client utility directory', async () => {
    const tempRoot = await createTempRoot();
    const templatesRoot = path.join(tempRoot, 'templates');
    const destRoot = path.join(tempRoot, 'project');
    const clientFile = path.join(destRoot, 'src/util/mask/index.ts');
    await createTemplate(templatesRoot, 'mask', 'export const mask = { fromTemplate: true };');
    await fs.outputFile(clientFile, 'export const mask = { customized: true };');

    await expect(addToClient('util-mask', { destRoot, templatesRoot })).rejects.toThrow('src/util/mask already exists');
    await expect(fs.readFile(clientFile, 'utf8')).resolves.toBe('export const mask = { customized: true };');
  });

  it('preflights util-all before copying so existing files do not leave partial writes', async () => {
    const tempRoot = await createTempRoot();
    const templatesRoot = path.join(tempRoot, 'templates');
    const destRoot = path.join(tempRoot, 'project');
    await Promise.all(utilTemplates.map((templateName) => createTemplate(templatesRoot, templateName)));
    await fs.outputFile(path.join(destRoot, 'src/util/string/index.ts'), 'export const string = { customized: true };');

    await expect(addToClient('util-all', { destRoot, templatesRoot })).rejects.toThrow('src/util/string');
    await expect(fs.pathExists(path.join(destRoot, 'src/util/array/index.ts'))).resolves.toBe(false);
  });
});
