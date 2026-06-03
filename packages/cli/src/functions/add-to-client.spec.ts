import fs from "fs-extra";
import os from "os";
import path from "path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addToClient } from "./add-to-client.js";

describe("addToClient", () => {
  let originalCwd: string;
  let tempDir: string;

  beforeEach(async () => {
    originalCwd = process.cwd();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "wbitencourt-cli-"));
    process.chdir(tempDir);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    vi.restoreAllMocks();
    await fs.remove(tempDir);
  });

  it("copies a requested utility template into the current project", async () => {
    await addToClient("util-string");

    await expect(fs.pathExists(path.join(tempDir, "src/util/string/index.ts"))).resolves.toBe(true);
  });

  it("refuses to overwrite an existing utility directory", async () => {
    const existingFile = path.join(tempDir, "src/util/string/index.ts");
    await fs.outputFile(existingFile, "local changes");

    await expect(addToClient("util-string")).rejects.toThrow("already exists");
    await expect(fs.readFile(existingFile, "utf8")).resolves.toBe("local changes");
  });

  it("preflights util-all before copying any templates", async () => {
    const existingFile = path.join(tempDir, "src/util/array/index.ts");
    await fs.outputFile(existingFile, "local changes");

    await expect(addToClient("util-all")).rejects.toThrow("already exists");
    await expect(fs.readFile(existingFile, "utf8")).resolves.toBe("local changes");
    await expect(fs.pathExists(path.join(tempDir, "src/util/string/index.ts"))).resolves.toBe(false);
  });
});
