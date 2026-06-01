import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util entrypoint', () => {
  it('exposes documented utilities from the package root', () => {
    expect(util.mask.cpf('12345678901')).toBe('123.456.789-01');
    expect(util.string.format.numberBRLCurrency(1234.5)).toMatch(/^R\$\s?1\.234,50$/u);
    expect(util.object.compare.isEqual({ nested: { value: 1 } }, { nested: { value: 1 } })).toBe(true);
    expect(util.picklist.uf).toHaveLength(27);
  });
});
