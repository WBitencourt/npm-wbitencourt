import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { addToClient } from './add-to-client.js';

const utilityDirectories = [
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

async function makeTempRoot() {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
  tempRoots.push(tempRoot);
  return tempRoot;
}

async function writeTemplate(templatesRoot: string, dir: string, content = `export const ${dir} = {};`) {
  await fs.outputFile(path.join(templatesRoot, dir, 'index.ts'), content);
}

afterEach(async () => {
  await Promise.all(tempRoots.splice(0).map((tempRoot) => fs.remove(tempRoot)));
});

describe('addToClient', () => {
  it('copies a selected utility template into the client project', async () => {
    const tempRoot = await makeTempRoot();
    const templatesRoot = path.join(tempRoot, 'templates');
    const destRoot = path.join(tempRoot, 'client');

    await writeTemplate(templatesRoot, 'mask', 'export const mask = {};');

    await addToClient('util-mask', { templatesRoot, destRoot });

    await expect(fs.readFile(path.join(destRoot, 'src/util/mask/index.ts'), 'utf8')).resolves.toBe(
      'export const mask = {};',
    );
  });

  it('refuses to overwrite an existing client utility directory', async () => {
    const tempRoot = await makeTempRoot();
    const templatesRoot = path.join(tempRoot, 'templates');
    const destRoot = path.join(tempRoot, 'client');
    const existingFile = path.join(destRoot, 'src/util/mask/index.ts');

    await writeTemplate(templatesRoot, 'mask', 'export const mask = "template";');
    await fs.outputFile(existingFile, 'export const mask = "custom";');

    await expect(addToClient('util-mask', { templatesRoot, destRoot })).rejects.toThrow(
      'Destination already exists',
    );
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('export const mask = "custom";');
  });

  it('checks every destination before util-all writes any template', async () => {
    const tempRoot = await makeTempRoot();
    const templatesRoot = path.join(tempRoot, 'templates');
    const destRoot = path.join(tempRoot, 'client');
    const existingFile = path.join(destRoot, 'src/util/string/index.ts');

    await Promise.all(utilityDirectories.map((dir) => writeTemplate(templatesRoot, dir)));
    await fs.outputFile(existingFile, 'export const string = "custom";');

    await expect(addToClient('util-all', { templatesRoot, destRoot })).rejects.toThrow(
      'Destination already exists',
    );
    await expect(fs.pathExists(path.join(destRoot, 'src/util/array'))).resolves.toBe(false);
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe('export const string = "custom";');
  });
});
