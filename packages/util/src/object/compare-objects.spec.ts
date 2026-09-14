import { describe, expect, it } from 'vitest';
import { object } from './index.js';

describe('object.compare.isEqual', () => {
  it('compares plain objects', () => {
    expect(object.compare.isEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(true);
    expect(object.compare.isEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('handles circular references without overflowing the stack', () => {
    const left: Record<string, unknown> = { x: 1 };
    left.self = left;

    const right: Record<string, unknown> = { x: 1 };
    right.self = right;

    expect(object.compare.isEqual(left, right)).toBe(true);

    const different: Record<string, unknown> = { x: 2 };
    different.self = different;

    expect(object.compare.isEqual(left, different)).toBe(false);
  });
});
