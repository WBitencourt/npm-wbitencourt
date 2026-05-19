import os from 'node:os';
import path from 'node:path';
import fs from 'fs-extra';
import { describe, expect, it } from 'vitest';
import { addToClient } from './add-to-client';

async function createTempProject() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
}

describe('addToClient', () => {
  it('copies a requested utility without test files', async () => {
    const projectRoot = await createTempProject();

    try {
      await addToClient('util-mask', projectRoot);

      await expect(fs.pathExists(path.join(projectRoot, 'src/util/mask/index.ts'))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(projectRoot, 'src/util/mask/mask-cpf-cnpj.spec.ts'))).resolves.toBe(false);
    } finally {
      await fs.remove(projectRoot);
    }
  });

  it('copies all utility directories for util-all', async () => {
    const projectRoot = await createTempProject();

    try {
      await addToClient('util-all', projectRoot);

      await expect(fs.pathExists(path.join(projectRoot, 'src/util/array/index.ts'))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(projectRoot, 'src/util/object/index.ts'))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(projectRoot, 'src/util/picklist/index.ts'))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(projectRoot, 'src/util/string/index.ts'))).resolves.toBe(true);
      await expect(fs.pathExists(path.join(projectRoot, 'src/util/README.md'))).resolves.toBe(false);
    } finally {
      await fs.remove(projectRoot);
    }
  });

  it('does not overwrite an existing utility directory', async () => {
    const projectRoot = await createTempProject();
    const customFile = path.join(projectRoot, 'src/util/mask/index.ts');
    const customContent = 'custom local changes';

    try {
      await fs.outputFile(customFile, customContent);

      await expect(addToClient('util-mask', projectRoot)).rejects.toThrow(/already exists/);
      await expect(fs.readFile(customFile, 'utf8')).resolves.toBe(customContent);
    } finally {
      await fs.remove(projectRoot);
    }
  });
});
