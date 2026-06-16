import fs from 'fs-extra';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addToClient } from './add-to-client';

describe('addToClient', () => {
  let previousCwd: string;
  let tempDir: string;

  beforeEach(async () => {
    previousCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    process.chdir(previousCwd);
    await fs.remove(tempDir);
  });

  it('copies all utility directories for util-all', async () => {
    await addToClient('util-all');

    await expect(fs.pathExists(path.join(tempDir, 'src/util/array/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/object/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/picklist/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/string/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/README.md'))).resolves.toBe(false);
  });
});
