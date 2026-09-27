import { describe, expect, it } from 'vitest';
import { util } from './index.js';

describe('util entrypoint', () => {
  it('exposes all utility namespaces', () => {
    expect(util.mask.cpf('12345678901')).toBe('123.456.789-01');
    expect(util.string.format.stringToNumbersOnly('R$ 1.234,50')).toBe('123450');
    expect(util.object.compare.isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(util.picklist.uf).toHaveLength(27);
  });
});
