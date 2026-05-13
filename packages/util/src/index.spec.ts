import { describe, expect, it } from 'vitest';
import { util } from '.';

describe('util public entrypoint', () => {
  it('exports the documented string helpers', () => {
    expect(util.string.format.numberBRLCurrency(1234.5)).toBe('R$ 1.234,50');
  });

  it('exports object helpers', () => {
    expect(util.object.compare.isEqual({ a: 1 }, { a: 1 })).toBe(true);
  });

  it('exports picklists', () => {
    expect(util.picklist.uf.some((item) => item.sigla === 'SP')).toBe(true);
  });
});
