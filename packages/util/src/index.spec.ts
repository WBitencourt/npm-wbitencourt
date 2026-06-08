import { describe, expect, it } from "vitest";
import { util } from "./index";

describe("util entrypoint", () => {
  it("exposes documented utility namespaces", () => {
    expect(typeof util.mask.cpf).toBe("function");
    expect(typeof util.validation.format.email).toBe("function");
    expect(typeof util.string.format.numberBRLCurrency).toBe("function");
    expect(typeof util.object.compare.isEqual).toBe("function");
    expect(util.picklist.uf).toHaveLength(27);
  });

  it("keeps documented helpers callable from the aggregate API", () => {
    expect(util.mask.cpf("12345678901")).toBe("123.456.789-01");
    expect(util.string.format.numberBRLCurrency(1234.5).replace(/\s/g, " ")).toBe("R$ 1.234,50");
    expect(util.object.compare.isEqual({ a: 1 }, { a: 1 })).toBe(true);
  });
});
