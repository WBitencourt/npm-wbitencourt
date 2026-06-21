import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const utilSourceRoot = path.resolve(__dirname, '../../util/src');
const templateRoot = path.resolve(__dirname, '../dist/templates');

async function copyDirectory(source, destination) {
  await fs.mkdir(destination, { recursive: true });

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.includes('.spec.')) continue;

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
  if (!entry.isDirectory()) continue;

  await copyDirectory(
    path.join(utilSourceRoot, entry.name),
    path.join(templateRoot, entry.name),
  );
}
