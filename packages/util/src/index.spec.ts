import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('Util: entrypoint', () => {
  it('exports documented utility namespaces', () => {
    expect(util.string.format.numberBRLCurrency(1234.5)).toBe('R$ 1.234,50');
    expect(util.object.compare.isEqual({ id: 1 }, { id: 1 })).toBe(true);
    expect(util.picklist.uf.some((uf) => uf.sigla === 'SP')).toBe(true);
  });
});
