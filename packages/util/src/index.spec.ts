import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util entrypoint', () => {
  it('exports all documented utility namespaces', () => {
    expect(util.array).toBeDefined();
    expect(util.blob).toBeDefined();
    expect(util.classname).toBeDefined();
    expect(util.dom).toBeDefined();
    expect(util.file).toBeDefined();
    expect(util.mask).toBeDefined();
    expect(util.object).toBeDefined();
    expect(util.picklist).toBeDefined();
    expect(util.string).toBeDefined();
    expect(util.tailwind).toBeDefined();
    expect(util.validation).toBeDefined();
  });

  it('keeps common nested APIs available from the entrypoint', () => {
    expect(util.mask.cpf('12345678901')).toBe('123.456.789-01');
    expect(util.string.format.numberBRLCurrency(1234.5)).toMatch(/^R\$\s?1\.234,50$/);
    expect(util.object.compare.isEqual({ value: 1 }, { value: 1 })).toBe(true);
    expect(util.picklist.uf).toHaveLength(27);
  });
});
