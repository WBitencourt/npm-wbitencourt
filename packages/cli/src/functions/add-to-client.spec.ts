import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { addToClient } from "./add-to-client";

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
] as const;

describe("addToClient", () => {
  let workspaceRoot: string;
  let templatesRoot: string;
  let destRoot: string;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), "wbitencourt-cli-"));
    templatesRoot = path.join(workspaceRoot, "templates");
    destRoot = path.join(workspaceRoot, "client");
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    for (const directory of utilityDirectories) {
      await fs.outputFile(
        path.join(templatesRoot, directory, "index.ts"),
        `export const ${directory.replace("-", "")} = true;\n`
      );
    }
  });

  afterEach(async () => {
    logSpy.mockRestore();
    await fs.remove(workspaceRoot);
  });

  it("copies a requested utility template into the client project", async () => {
    await addToClient("util-array", { templatesRoot, destRoot });

    await expect(fs.pathExists(path.join(destRoot, "src/util/array/index.ts"))).resolves.toBe(true);
  });

  it("aborts util-all before copying anything when a destination already exists", async () => {
    await fs.outputFile(path.join(destRoot, "src/util/blob/index.ts"), "local client file\n");

    await expect(addToClient("util-all", { templatesRoot, destRoot })).rejects.toThrow(
      /already exists/
    );

    await expect(fs.pathExists(path.join(destRoot, "src/util/array/index.ts"))).resolves.toBe(false);
    await expect(fs.readFile(path.join(destRoot, "src/util/blob/index.ts"), "utf8")).resolves.toBe(
      "local client file\n"
    );
  });
});
