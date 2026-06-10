import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageRoot = path.resolve(__dirname, "..");
const utilSourceRoot = path.resolve(packageRoot, "../util/src");
const templatesRoot = path.join(packageRoot, "dist/templates");

await fs.remove(templatesRoot);
await fs.ensureDir(templatesRoot);

const entries = await fs.readdir(utilSourceRoot, { withFileTypes: true });
const utilityDirs = entries.filter((entry) => entry.isDirectory());

await Promise.all(
  utilityDirs.map((entry) =>
    fs.copy(path.join(utilSourceRoot, entry.name), path.join(templatesRoot, entry.name), {
      filter: (source) => !source.endsWith(".spec.ts"),
    })
  )
);
