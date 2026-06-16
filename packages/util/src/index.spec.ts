import { describe, expect, it } from 'vitest';
import { util } from '.';

describe('util public index', () => {
  it('exposes documented utility groups', () => {
    expect(util.string.format.stringToNumbersOnly('R$ 1.234,50')).toBe('123450');
    expect(util.object.compare.isEqual({ nested: { value: 1 } }, { nested: { value: 1 } })).toBe(true);
    expect(util.picklist.uf.some((state) => state.sigla === 'SP')).toBe(true);
  });
});
