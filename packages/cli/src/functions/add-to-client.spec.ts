import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { addToClient } from './add-to-client.js';

let tempRoot: string;
let srcRoot: string;
let destRoot: string;

async function createTemplate(name: string) {
  await fs.outputFile(path.join(srcRoot, name, 'index.ts'), `export const ${name} = '${name}';\n`);
}

beforeEach(async () => {
  tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-test-'));
  srcRoot = path.join(tempRoot, 'templates');
  destRoot = path.join(tempRoot, 'client');
});

afterEach(async () => {
  await fs.remove(tempRoot);
});

describe('addToClient', () => {
  it('copies a selected util template into the client project', async () => {
    await createTemplate('mask');

    await addToClient('util-mask', { srcRoot, destRoot });

    await expect(fs.readFile(path.join(destRoot, 'src/util/mask/index.ts'), 'utf8'))
      .resolves
      .toContain("export const mask = 'mask';");
  });

  it('fails before copying util-all when any destination already exists', async () => {
    await createTemplate('mask');
    await createTemplate('string');
    await fs.outputFile(path.join(destRoot, 'src/util/string/index.ts'), 'client code');

    await expect(addToClient('util-all', { srcRoot, destRoot }))
      .rejects
      .toThrow('Refusing to overwrite existing path(s): src/util/string');

    await expect(fs.pathExists(path.join(destRoot, 'src/util/mask/index.ts'))).resolves.toBe(false);
  });

  it('supports documented object and picklist util commands', async () => {
    await createTemplate('object');
    await createTemplate('picklist');

    await addToClient('util-object', { srcRoot, destRoot });
    await addToClient('util-picklist', { srcRoot, destRoot });

    await expect(fs.pathExists(path.join(destRoot, 'src/util/object/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(destRoot, 'src/util/picklist/index.ts'))).resolves.toBe(true);
  });
});
