import os from "node:os";
import path from "node:path";
import fs from "fs-extra";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { addToClient } from "./add-to-client";

const originalCwd = process.cwd();
let tempProject: string;

describe("addToClient", () => {
  beforeEach(async () => {
    tempProject = await fs.mkdtemp(path.join(os.tmpdir(), "wbitencourt-cli-"));
    process.chdir(tempProject);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    await fs.remove(tempProject);
  });

  it("copies a requested utility into the current project", async () => {
    await addToClient("util-mask");

    await expect(fs.pathExists(path.join(tempProject, "src/util/mask/index.ts"))).resolves.toBe(true);
  });

  it("copies every utility for util-all", async () => {
    await addToClient("util-all");

    for (const utilityName of ["array", "blob", "classname", "dom", "file", "mask", "object", "picklist", "string", "tailwind", "validation"]) {
      await expect(fs.pathExists(path.join(tempProject, "src/util", utilityName, "index.ts"))).resolves.toBe(true);
    }
  });

  it("refuses to overwrite an existing utility directory", async () => {
    const existingFile = path.join(tempProject, "src/util/mask/index.ts");
    await fs.ensureDir(path.dirname(existingFile));
    await fs.writeFile(existingFile, "custom local code");

    await expect(addToClient("util-mask")).rejects.toThrow("Refusing to overwrite existing directory");
    await expect(fs.readFile(existingFile, "utf8")).resolves.toBe("custom local code");
  });

  it("preflights util-all before copying any directory", async () => {
    const existingFile = path.join(tempProject, "src/util/string/index.ts");
    await fs.ensureDir(path.dirname(existingFile));
    await fs.writeFile(existingFile, "custom string code");

    await expect(addToClient("util-all")).rejects.toThrow("Refusing to overwrite existing utility directories: string");
    await expect(fs.pathExists(path.join(tempProject, "src/util/array"))).resolves.toBe(false);
    await expect(fs.readFile(existingFile, "utf8")).resolves.toBe("custom string code");
  });
});
