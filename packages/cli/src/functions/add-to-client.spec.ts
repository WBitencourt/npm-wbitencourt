import { mkdtemp, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { afterEach, describe, expect, it } from 'vitest';
import { addToClient } from './add-to-client.js';

const originalCwd = process.cwd();
let tempDir: string | undefined;

async function useTempProject() {
  tempDir = await mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
  process.chdir(tempDir);

  return tempDir;
}

afterEach(async () => {
  process.chdir(originalCwd);

  if (tempDir) {
    await rm(tempDir, { recursive: true, force: true });
    tempDir = undefined;
  }
});

describe('addToClient', () => {
  it('copies a utility template into the current project', async () => {
    const projectDir = await useTempProject();

    await addToClient('util-string');

    await expect(
      fs.pathExists(path.join(projectDir, 'src/util/string/index.ts')),
    ).resolves.toBe(true);
  });

  it('refuses to overwrite an existing client utility', async () => {
    const projectDir = await useTempProject();
    const existingFile = path.join(projectDir, 'src/util/string/index.ts');
    const existingContents = 'export const string = "client-owned";\n';

    await fs.ensureDir(path.dirname(existingFile));
    await writeFile(existingFile, existingContents);

    await expect(addToClient('util-string')).rejects.toThrow(
      'Refusing to overwrite existing src/util/string.',
    );
    await expect(fs.readFile(existingFile, 'utf8')).resolves.toBe(existingContents);
  });
});
