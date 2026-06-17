import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util entrypoint', () => {
  it('exports all utility namespaces from the public API', () => {
    expect(typeof util.array.order.asc).toBe('function');
    expect(typeof util.blob.convert.toString).toBe('function');
    expect(typeof util.classname.cn).toBe('function');
    expect(typeof util.dom.copyClipBoard).toBe('function');
    expect(typeof util.file.convert.toBytes).toBe('function');
    expect(typeof util.mask.cpf).toBe('function');
    expect(typeof util.object.compare.isEqual).toBe('function');
    expect(util.picklist.uf).toHaveLength(27);
    expect(typeof util.string.format.numberBRLCurrency).toBe('function');
    expect(typeof util.tailwind.cn).toBe('function');
    expect(typeof util.validation.check.cpf).toBe('function');
  });
});
