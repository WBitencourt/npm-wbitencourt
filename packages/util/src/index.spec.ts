import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util entrypoint', () => {
  it('exports the public utility namespaces', () => {
    expect(util.mask.cpf('12345678901')).toBe('123.456.789-01');
    expect(util.string.format.stringToNumbersOnly('a1-b2')).toBe('12');
    expect(util.object.compare.isEqual({ nested: { value: 1 } }, { nested: { value: 1 } })).toBe(true);
    expect(util.picklist.uf).toContainEqual({ id: '35', sigla: 'SP', regiao: 'Sudeste' });
  });
});
