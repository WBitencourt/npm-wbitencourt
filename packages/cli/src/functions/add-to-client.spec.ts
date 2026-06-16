import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { addToClient } from './add-to-client';

let originalCwd: string;
let tempDir: string;

describe('addToClient', () => {
  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    vi.restoreAllMocks();
    await fs.remove(tempDir);
  });

  it('copies every util directory when adding util-all from the monorepo source fallback', async () => {
    await addToClient('util-all');

    await expect(fs.pathExists(path.join(tempDir, 'src/util/array/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/validation/index.ts'))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(tempDir, 'src/util/index.ts'))).resolves.toBe(false);
  });
});
