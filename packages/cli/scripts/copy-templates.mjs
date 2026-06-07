import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const utilSourceRoot = path.resolve(packageRoot, "../util/src");
const templatesRoot = path.resolve(packageRoot, "dist/templates");

const utilityDirectories = [
  "array",
  "blob",
  "classname",
  "dom",
  "file",
  "mask",
  "object",
  "picklist",
  "string",
  "tailwind",
  "validation",
];

await rm(templatesRoot, { recursive: true, force: true });
await mkdir(templatesRoot, { recursive: true });

for (const directory of utilityDirectories) {
  await cp(
    path.join(utilSourceRoot, directory),
    path.join(templatesRoot, directory),
    {
      recursive: true,
      filter: (source) => !source.endsWith(".spec.ts"),
    }
  );
}
