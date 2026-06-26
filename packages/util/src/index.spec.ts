import { describe, expect, it } from 'vitest';
import { util } from './index.js';

describe('util entrypoint', () => {
  it('exports documented utility namespaces', () => {
    expect(typeof util.mask.cpf).toBe('function');
    expect(typeof util.string.format.numberBRLCurrency).toBe('function');
    expect(typeof util.object.compare.isEqual).toBe('function');
    expect(util.picklist.uf).toHaveLength(27);
  });
});
