import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const utilSourceRoot = path.resolve(__dirname, "../../util/src");
const templateRoot = path.resolve(__dirname, "../dist/templates");

const templateNames = [
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

await rm(templateRoot, { recursive: true, force: true });
await mkdir(templateRoot, { recursive: true });

for (const templateName of templateNames) {
  await cp(
    path.join(utilSourceRoot, templateName),
    path.join(templateRoot, templateName),
    {
      recursive: true,
      filter: (source) => !source.endsWith(".spec.ts"),
    },
  );
}
