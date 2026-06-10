import { describe, expect, it } from "vitest";
import { util } from "./index.js";

describe("util entrypoint", () => {
  it("exports every documented utility namespace", () => {
    expect(util.array).toBeDefined();
    expect(util.blob).toBeDefined();
    expect(util.classname).toBeDefined();
    expect(util.dom).toBeDefined();
    expect(util.file).toBeDefined();
    expect(util.mask).toBeDefined();
    expect(util.object.compare.isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(util.picklist.uf).toHaveLength(27);
    expect(util.string.format.numberBRLCurrency(1234.5)).toMatch(/^R\$\s1\.234,50$/u);
    expect(util.tailwind).toBeDefined();
    expect(util.validation).toBeDefined();
  });
});
