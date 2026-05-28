import { describe, expect, it } from 'vitest';
import { util } from './index.js';

describe('util entrypoint', () => {
  it('exports all documented utility namespaces', () => {
    expect(Object.keys(util).sort()).toEqual([
      'array',
      'blob',
      'classname',
      'dom',
      'file',
      'mask',
      'object',
      'picklist',
      'string',
      'tailwind',
      'validation',
    ]);
  });

  it('keeps restored namespaces usable from the package entrypoint', () => {
    expect(util.object.compare.isEqual({ nested: { value: 1 } }, { nested: { value: 1 } })).toBe(true);
    expect(util.picklist.uf).toHaveLength(27);
    expect(util.string.format.stringToNumbersOnly('CPF 123.456.789-01')).toBe('12345678901');
  });
});
