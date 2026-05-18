import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addToClient } from './add-to-client';

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

describe('addToClient', () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'wbitencourt-cli-'));
    process.chdir(tempDir);
    vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    process.chdir(originalCwd);
    await fs.remove(tempDir);
  });

  it('copies a single requested utility', async () => {
    await addToClient('util-mask');

    expect(await fs.pathExists(path.join(tempDir, 'src/util/mask/index.ts'))).toBe(true);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/array/index.ts'))).toBe(false);
  });

  it('copies every utility directory for util-all', async () => {
    await addToClient('util-all');

    for (const directory of utilityDirectories) {
      expect(await fs.pathExists(path.join(tempDir, 'src/util', directory, 'index.ts'))).toBe(true);
    }

    expect(await fs.pathExists(path.join(tempDir, 'src/util/README.md'))).toBe(false);
    expect(await fs.pathExists(path.join(tempDir, 'src/util/index.ts'))).toBe(false);
  });
});
