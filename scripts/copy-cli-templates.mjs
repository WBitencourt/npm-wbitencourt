import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const sourceRoot = path.join(repoRoot, "packages/util/src");
const destinationRoot = path.join(repoRoot, "packages/cli/dist/templates");

await fs.rm(destinationRoot, { recursive: true, force: true });
await fs.mkdir(destinationRoot, { recursive: true });

await fs.cp(sourceRoot, destinationRoot, {
  recursive: true,
  filter: (source) => !source.endsWith(".spec.ts"),
});
