import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(scriptDir, "..");
const repoRoot = path.resolve(packageRoot, "../..");
const distRoot = path.join(packageRoot, "dist");
const utilSourceRoot = path.join(repoRoot, "packages/util/src");
const utilTemplateRoot = path.join(distRoot, "templates/util");
const utilDirs = [
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

function copyDirectoryWithoutSpecs(from, to) {
  mkdirSync(to, { recursive: true });

  for (const entry of readdirSync(from)) {
    const source = path.join(from, entry);
    const target = path.join(to, entry);
    const stats = statSync(source);

    if (stats.isDirectory()) {
      copyDirectoryWithoutSpecs(source, target);
      continue;
    }

    if (entry.endsWith(".spec.ts")) {
      continue;
    }

    copyFileSync(source, target);
  }
}

rmSync(distRoot, { recursive: true, force: true });
execFileSync("npx", ["tsc"], {
  cwd: packageRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (!existsSync(utilSourceRoot)) {
  throw new Error(`Utility source directory not found: ${utilSourceRoot}`);
}

for (const dir of utilDirs) {
  copyDirectoryWithoutSpecs(path.join(utilSourceRoot, dir), path.join(utilTemplateRoot, dir));
}
