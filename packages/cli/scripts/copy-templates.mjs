import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const utilSrcRoot = path.resolve(__dirname, '../../util/src');
const templatesRoot = path.resolve(__dirname, '../dist/templates');

async function copyDirectory(from, to) {
  await fs.mkdir(to, { recursive: true });

  const entries = await fs.readdir(from, { withFileTypes: true });

  for (const entry of entries) {
    const source = path.join(from, entry.name);
    const destination = path.join(to, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(source, destination);
      continue;
    }

    if (entry.isFile() && !entry.name.endsWith('.spec.ts')) {
      await fs.copyFile(source, destination);
    }
  }
}

await fs.rm(templatesRoot, { recursive: true, force: true });
await fs.mkdir(templatesRoot, { recursive: true });

const entries = await fs.readdir(utilSrcRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  await copyDirectory(
    path.join(utilSrcRoot, entry.name),
    path.join(templatesRoot, entry.name)
  );
}
