import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('Util entrypoint', () => {
  it('exports documented utility modules', () => {
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
});
