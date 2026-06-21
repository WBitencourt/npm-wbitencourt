import { describe, expect, it } from 'vitest';
import { util } from './index';

describe('util entrypoint', () => {
  it('exports every public utility namespace', () => {
    expect(util).toEqual(expect.objectContaining({
      array: expect.any(Object),
      blob: expect.any(Object),
      classname: expect.any(Object),
      dom: expect.any(Object),
      file: expect.any(Object),
      mask: expect.any(Object),
      object: expect.any(Object),
      picklist: expect.any(Object),
      string: expect.any(Object),
      tailwind: expect.any(Object),
      validation: expect.any(Object),
    }));
  });
});
