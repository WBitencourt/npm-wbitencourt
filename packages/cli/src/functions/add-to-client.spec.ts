import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { addToClient } from './add-to-client';

const templateDirs = ['array', 'mask', 'object', 'picklist'];

describe('addToClient', () => {
  let originalCwd: string;
  let originalTemplatesRoot: string | undefined;
  let tempRoot: string;
  let appRoot: string;
  let templatesRoot: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    originalTemplatesRoot = process.env.WBITENCOURT_TEMPLATES_ROOT;
    tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-add-'));
    appRoot = path.join(tempRoot, 'app');
    templatesRoot = path.join(tempRoot, 'templates');

    await fs.ensureDir(path.join(appRoot, 'src'));

    for (const dir of templateDirs) {
      await fs.outputFile(
        path.join(templatesRoot, dir, 'index.ts'),
        `export const ${dir} = '${dir}';\n`,
      );
    }

    process.chdir(appRoot);
    process.env.WBITENCOURT_TEMPLATES_ROOT = templatesRoot;
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    process.chdir(originalCwd);

    if (originalTemplatesRoot === undefined) {
      delete process.env.WBITENCOURT_TEMPLATES_ROOT;
    } else {
      process.env.WBITENCOURT_TEMPLATES_ROOT = originalTemplatesRoot;
    }

    vi.restoreAllMocks();
    await fs.remove(tempRoot);
  });

  it('copies a utility template from the packaged templates directory', async () => {
    await addToClient('util-mask');

    await expect(fs.readFile(path.join(appRoot, 'src/util/mask/index.ts'), 'utf8'))
      .resolves.toContain("export const mask = 'mask';");
  });

  it.each(['util-object', 'util-picklist'])('supports %s', async (command) => {
    await addToClient(command);

    const dir = command.replace('util-', '');
    await expect(fs.pathExists(path.join(appRoot, 'src/util', dir, 'index.ts')))
      .resolves.toBe(true);
  });

  it('does not overwrite an existing client utility directory', async () => {
    const clientFile = path.join(appRoot, 'src/util/mask/index.ts');
    await fs.outputFile(clientFile, 'client code\n');

    await expect(addToClient('util-mask')).rejects.toThrow('already exists');
    await expect(fs.readFile(clientFile, 'utf8')).resolves.toBe('client code\n');
  });

  it('preflights util-all before copying any template', async () => {
    await fs.outputFile(path.join(appRoot, 'src/util/array/index.ts'), 'client array\n');

    await expect(addToClient('util-all')).rejects.toThrow('already exists');
    await expect(fs.pathExists(path.join(appRoot, 'src/util/mask'))).resolves.toBe(false);
  });
});
