import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilityNames = [
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

const sourceRoot = path.resolve(__dirname, '../../util/src');
const destinationRoot = path.resolve(__dirname, '../dist/templates');

async function copyDirectory(source, destination) {
  await mkdir(destination, { recursive: true });

  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name.endsWith('.spec.ts')) {
      continue;
    }

    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, destinationPath);
      continue;
    }

    if (entry.isFile()) {
      await copyFile(sourcePath, destinationPath);
    }
  }
}

await rm(destinationRoot, { recursive: true, force: true });

for (const utilityName of utilityNames) {
  await copyDirectory(
    path.join(sourceRoot, utilityName),
    path.join(destinationRoot, utilityName),
  );
}
