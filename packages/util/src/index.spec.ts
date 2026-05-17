import { describe, expect, it } from 'vitest'
import { util } from '.';

describe('util entrypoint', () => {
  it('exports all documented utility namespaces', () => {
    expect(util.array).toBeDefined();
    expect(util.blob).toBeDefined();
    expect(util.classname).toBeDefined();
    expect(util.dom).toBeDefined();
    expect(util.file).toBeDefined();
    expect(util.mask).toBeDefined();
    expect(util.object).toBeDefined();
    expect(util.picklist).toBeDefined();
    expect(util.string).toBeDefined();
    expect(util.tailwind).toBeDefined();
    expect(util.validation).toBeDefined();
  });
});
