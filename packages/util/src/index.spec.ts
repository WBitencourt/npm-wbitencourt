import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util public entrypoint', () => {
  it('exports documented namespaces', () => {
    expect(util.string.format.numberBRLCurrency(1234.5)).toContain('1.234,50');
    expect(util.object.compare.isEqual({ id: 1 }, { id: 1 })).toBe(true);
    expect(util.picklist.uf.length).toBeGreaterThan(0);
  });
});
