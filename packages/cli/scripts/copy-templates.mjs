import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, '..');
const sourceRoot = path.resolve(packageRoot, '../util/src');
const templatesRoot = path.resolve(packageRoot, 'dist/templates/util');

await fs.remove(templatesRoot);
await fs.ensureDir(templatesRoot);

const entries = await fs.readdir(sourceRoot, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isDirectory()) {
    continue;
  }

  await fs.copy(path.join(sourceRoot, entry.name), path.join(templatesRoot, entry.name));
}
