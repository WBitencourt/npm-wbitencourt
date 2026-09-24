import { describe, expect, it } from 'vitest';
import { array } from './index.js';

describe('array.compare.isEqual', () => {
  it('compares arrays of plain objects', () => {
    expect(array.compare.isEqual([{ a: 1 }], [{ a: 1 }])).toBe(true);
    expect(array.compare.isEqual([{ a: 1 }], [{ a: 2 }])).toBe(false);
  });

  it('does not throw when an element contains a circular reference', () => {
    const left: Record<string, unknown> = { id: 1 };
    left.self = left;

    const right: Record<string, unknown> = { id: 1 };
    right.self = right;

    const different: Record<string, unknown> = { id: 2 };
    different.self = different;

    expect(array.compare.isEqual([left], [left])).toBe(true);
    expect(array.compare.isEqual([left], [right])).toBe(true);
    expect(array.compare.isEqual([left], [different])).toBe(false);
  });
});
