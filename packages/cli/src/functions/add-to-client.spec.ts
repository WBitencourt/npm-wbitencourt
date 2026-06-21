import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addToClient } from './add-to-client';

let tempRoot: string;
let templateRoot: string;
let projectRoot: string;

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

async function createTemplate(name: string) {
  await fs.outputFile(path.join(templateRoot, name, 'index.ts'), `export const ${name} = {};`);
}

beforeEach(async () => {
  tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
  templateRoot = path.join(tempRoot, 'templates');
  projectRoot = path.join(tempRoot, 'project');

  await fs.ensureDir(projectRoot);
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await fs.remove(tempRoot);
});

describe('addToClient', () => {
  it('copies a published utility template into the current project', async () => {
    await createTemplate('mask');

    await addToClient('util-mask', { cwd: projectRoot, templateRoot });

    await expect(fs.pathExists(path.join(projectRoot, 'src/util/mask/index.ts'))).resolves.toBe(true);
  });

  it('supports object and picklist utility commands', async () => {
    await createTemplate('object');
    await createTemplate('picklist');

    await addToClient('util-object', { cwd: projectRoot, templateRoot });
    await addToClient('util-picklist', { cwd: projectRoot, templateRoot });

    await expect(fs.pathExists(path.join(projectRoot, 'src/util/object/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(projectRoot, 'src/util/picklist/index.ts'))).resolves.toBe(true);
  });

  it('refuses to overwrite an existing utility directory', async () => {
    await createTemplate('mask');
    await fs.outputFile(path.join(projectRoot, 'src/util/mask/index.ts'), 'custom code');

    await expect(addToClient('util-mask', { cwd: projectRoot, templateRoot }))
      .rejects.toThrow('already exists');

    await expect(fs.readFile(path.join(projectRoot, 'src/util/mask/index.ts'), 'utf8')).resolves.toBe('custom code');
  });

  it('preflights util-all before copying anything', async () => {
    await Promise.all(templateNames.map(createTemplate));
    await fs.outputFile(path.join(projectRoot, 'src/util/mask/index.ts'), 'custom code');

    await expect(addToClient('util-all', { cwd: projectRoot, templateRoot }))
      .rejects.toThrow('already exists');

    await expect(fs.pathExists(path.join(projectRoot, 'src/util/array/index.ts'))).resolves.toBe(false);
    await expect(fs.readFile(path.join(projectRoot, 'src/util/mask/index.ts'), 'utf8')).resolves.toBe('custom code');
  });
});
