import { describe, expect, it } from 'vitest';
import { util } from '.';

describe('util entrypoint', () => {
  it('exports the documented utility namespaces', () => {
    expect(typeof util.array).toBe('object');
    expect(typeof util.blob).toBe('object');
    expect(typeof util.classname).toBe('object');
    expect(typeof util.dom).toBe('object');
    expect(typeof util.file).toBe('object');
    expect(typeof util.mask).toBe('object');
    expect(typeof util.object).toBe('object');
    expect(typeof util.picklist).toBe('object');
    expect(typeof util.string).toBe('object');
    expect(typeof util.tailwind).toBe('object');
    expect(typeof util.validation).toBe('object');
  });

  it('keeps restored namespaces usable from the public entrypoint', () => {
    expect(util.string.format.stringToNumbersOnly('ab12cd34')).toBe('1234');
    expect(util.object.compare.isEqual({ id: 1 }, { id: 1 })).toBe(true);
    expect(util.picklist.uf.some((item) => item.sigla === 'SP')).toBe(true);
  });
});
