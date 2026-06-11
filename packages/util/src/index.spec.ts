import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util entrypoint', () => {
  it('exports the documented namespaces', () => {
    expect(typeof util.array.order.asc).toBe('function');
    expect(typeof util.mask.cpf).toBe('function');
    expect(typeof util.object.compare.isEqual).toBe('function');
    expect(util.picklist.uf.length).toBeGreaterThan(0);
    expect(typeof util.string.format.numberBRLCurrency).toBe('function');
  });
});
