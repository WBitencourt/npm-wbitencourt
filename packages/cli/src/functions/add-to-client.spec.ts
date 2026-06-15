import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addToClient } from "./add-to-client";

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

const createTempDir = () => fs.mkdtemp(path.join(os.tmpdir(), "wbitencourt-cli-"));

const createTemplates = async (templateRoot: string, names = templateNames) => {
  for (const name of names) {
    await fs.outputFile(
      path.join(templateRoot, name, "index.ts"),
      `export const ${name.replace("-", "")} = true;\n`,
    );
  }
};

describe("addToClient", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("copies a requested utility template into the client project", async () => {
    const destRoot = await createTempDir();
    const templateRoot = await createTempDir();
    await createTemplates(templateRoot, ["mask"]);

    await addToClient("util-mask", { destRoot, templateRoot });

    await expect(
      fs.readFile(path.join(destRoot, "src/util/mask/index.ts"), "utf8"),
    ).resolves.toContain("export const mask = true");
  });

  it("refuses to overwrite an existing client utility directory", async () => {
    const destRoot = await createTempDir();
    const templateRoot = await createTempDir();
    const existingFile = path.join(destRoot, "src/util/mask/index.ts");
    await createTemplates(templateRoot, ["mask"]);
    await fs.outputFile(existingFile, "client code\n");

    await expect(addToClient("util-mask", { destRoot, templateRoot })).rejects.toThrow(
      "Refusing to overwrite existing directory: src/util/mask",
    );
    await expect(fs.readFile(existingFile, "utf8")).resolves.toBe("client code\n");
  });

  it("preflights util-all before copying any template", async () => {
    const destRoot = await createTempDir();
    const templateRoot = await createTempDir();
    await createTemplates(templateRoot);
    await fs.outputFile(path.join(destRoot, "src/util/string/index.ts"), "client code\n");

    await expect(addToClient("util-all", { destRoot, templateRoot })).rejects.toThrow(
      "Refusing to overwrite existing directory: src/util/string",
    );
    await expect(fs.pathExists(path.join(destRoot, "src/util/array/index.ts"))).resolves.toBe(
      false,
    );
  });
});
