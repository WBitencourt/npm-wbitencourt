import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { addToClient } from "./add-to-client";

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

const tempDirs: string[] = [];

async function createTempDir(prefix: string) {
  const dir = await mkdtemp(path.join(os.tmpdir(), prefix));
  tempDirs.push(dir);
  return dir;
}

async function createTemplate(templateRoot: string, dir: string, content = `export const ${dir} = {};\n`) {
  const target = path.join(templateRoot, dir);
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, "index.ts"), content);
}

async function pathExists(target: string) {
  try {
    await readFile(target);
    return true;
  } catch {
    return false;
  }
}

afterEach(async () => {
  vi.restoreAllMocks();

  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })),
  );
});

describe("addToClient", () => {
  it("copies a packaged utility template and refuses to overwrite it", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const templateRoot = await createTempDir("wbitencourt-template-");
    const clientRoot = await createTempDir("wbitencourt-client-");
    await createTemplate(templateRoot, "mask", "export const mask = { cpf: () => '' };\n");

    await addToClient("util-mask", { templateRoot, cwd: clientRoot });

    const copiedFile = path.join(clientRoot, "src/util/mask/index.ts");
    expect(await readFile(copiedFile, "utf8")).toContain("cpf");

    await expect(addToClient("util-mask", { templateRoot, cwd: clientRoot })).rejects.toThrow(
      "Refusing to overwrite existing src/util/mask",
    );
    expect(await readFile(copiedFile, "utf8")).toContain("cpf");
  });

  it("preflights util-all before copying to avoid partial writes", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    const templateRoot = await createTempDir("wbitencourt-template-");
    const clientRoot = await createTempDir("wbitencourt-client-");

    await Promise.all(utilDirs.map((dir) => createTemplate(templateRoot, dir)));
    await mkdir(path.join(clientRoot, "src/util/mask"), { recursive: true });
    await writeFile(path.join(clientRoot, "src/util/mask/index.ts"), "existing user file\n");

    await expect(addToClient("util-all", { templateRoot, cwd: clientRoot })).rejects.toThrow(
      "src/util/mask",
    );

    expect(await pathExists(path.join(clientRoot, "src/util/array/index.ts"))).toBe(false);
    expect(await readFile(path.join(clientRoot, "src/util/mask/index.ts"), "utf8")).toBe(
      "existing user file\n",
    );
  });
});
