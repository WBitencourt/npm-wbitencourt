import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const utilSourceRoot = path.resolve(__dirname, '../../util/src');
const templateRoot = path.resolve(__dirname, '../dist/templates');

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.endsWith('.spec.ts')) {
      continue;
    }

    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(from, to);
      continue;
    }

    if (entry.isFile()) {
      await fs.copyFile(from, to);
    }
  }
}

await fs.rm(templateRoot, { recursive: true, force: true });
await fs.mkdir(templateRoot, { recursive: true });

const entries = await fs.readdir(utilSourceRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  await copyDirectory(
    path.join(utilSourceRoot, entry.name),
    path.join(templateRoot, entry.name),
  );
}
