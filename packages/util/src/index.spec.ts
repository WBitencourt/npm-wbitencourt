import { describe, expect, it } from 'vitest';
import { util } from './index.js';

describe('util entrypoint', () => {
  it('exports documented utility namespaces through Node-compatible imports', () => {
    expect(util.mask.cpf('12345678901')).toBe('123.456.789-01');
    expect(util.string.format.numberBRLCurrency(1234.5).replace(/\s/u, ' ')).toBe('R$ 1.234,50');
    expect(util.object.compare.isEqual({ id: 1 }, { id: 1 })).toBe(true);
    expect(util.picklist.uf.some((uf) => uf.sigla === 'SP')).toBe(true);
  });
});
