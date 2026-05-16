import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util public entrypoint', () => {
  it('exports the documented utility namespaces', () => {
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

  it('keeps documented helpers reachable from the root import', () => {
    expect(util.string.format.numberBRLCurrency(1234.5).replace(/\s/g, ' ')).toBe('R$ 1.234,50');
    expect(util.object.compare.isEqual({ id: 1 }, { id: 1 })).toBe(true);
    expect(util.picklist.uf).toHaveLength(27);
  });
});
