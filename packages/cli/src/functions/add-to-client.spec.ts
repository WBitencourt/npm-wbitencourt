import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { addToClient } from "./add-to-client.js";

let tempRoot: string;
let templatesRoot: string;
let destRoot: string;

async function writeTemplate(utilityName: string, files: Record<string, string>) {
  for (const [fileName, contents] of Object.entries(files)) {
    await fs.outputFile(path.join(templatesRoot, utilityName, fileName), contents);
  }
}

describe("addToClient", () => {
  beforeEach(async () => {
    tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "wbitencourt-cli-"));
    templatesRoot = path.join(tempRoot, "templates");
    destRoot = path.join(tempRoot, "app");

    await fs.ensureDir(templatesRoot);
    await fs.ensureDir(destRoot);
  });

  afterEach(async () => {
    await fs.remove(tempRoot);
  });

  it("copies a requested utility from the packaged templates", async () => {
    await writeTemplate("array", { "index.ts": "export const array = {};" });

    await addToClient("util-array", { templatesRoot, destRoot });

    await expect(fs.readFile(path.join(destRoot, "src/util/array/index.ts"), "utf8")).resolves.toBe(
      "export const array = {};"
    );
  });

  it("supports utility commands generated from template directory names", async () => {
    await writeTemplate("object", { "index.ts": "export const object = {};" });
    await writeTemplate("picklist", { "index.ts": "export const picklist = {};" });

    await addToClient("util-object", { templatesRoot, destRoot });
    await addToClient("util-picklist", { templatesRoot, destRoot });

    await expect(fs.pathExists(path.join(destRoot, "src/util/object/index.ts"))).resolves.toBe(true);
    await expect(fs.pathExists(path.join(destRoot, "src/util/picklist/index.ts"))).resolves.toBe(true);
  });

  it("refuses to overwrite an existing utility directory", async () => {
    await writeTemplate("array", { "index.ts": "export const array = {};" });
    await fs.outputFile(path.join(destRoot, "src/util/array/index.ts"), "local edits");

    await expect(addToClient("util-array", { templatesRoot, destRoot })).rejects.toThrow(
      "Refusing to overwrite existing util directories: src/util/array"
    );
    await expect(fs.readFile(path.join(destRoot, "src/util/array/index.ts"), "utf8")).resolves.toBe(
      "local edits"
    );
  });

  it("preflights util-all before copying to avoid partial writes", async () => {
    await writeTemplate("array", { "index.ts": "export const array = {};" });
    await writeTemplate("mask", { "index.ts": "export const mask = {};" });
    await fs.outputFile(path.join(destRoot, "src/util/mask/index.ts"), "local mask edits");

    await expect(addToClient("util-all", { templatesRoot, destRoot })).rejects.toThrow(
      "Refusing to overwrite existing util directories: src/util/mask"
    );
    await expect(fs.pathExists(path.join(destRoot, "src/util/array/index.ts"))).resolves.toBe(false);
    await expect(fs.readFile(path.join(destRoot, "src/util/mask/index.ts"), "utf8")).resolves.toBe(
      "local mask edits"
    );
  });
});
