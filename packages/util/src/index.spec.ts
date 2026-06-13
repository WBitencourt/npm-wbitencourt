import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util entrypoint', () => {
  it('exports all public utility namespaces', () => {
    expect(util.mask.cpf('12345678901')).toBe('123.456.789-01');
    expect(util.string.format.numberBRLCurrency(1234.5)).toBe('R$ 1.234,50');
    expect(util.object.compare.isEqual({ a: 1 }, { a: 1 })).toBe(true);
    expect(util.picklist.uf).toContainEqual({ id: '35', sigla: 'SP', regiao: 'Sudeste' });
  });
});
