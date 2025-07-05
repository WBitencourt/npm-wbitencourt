import { describe, it, expect } from 'vitest'
import { mask } from '.';

const cases = [
  ['123', '123'],
  ['1234', '123.4'],
  ['123456', '123.456'],
  ['1234567', '123.456.7'],
  ['123456789', '123.456.789'],
  ['1234567890', '123.456.789-0'],
  ['12345678901', '123.456.789-01'],

  ['123456789012', '12.345.678/9012'],
  ['1234567890123', '12.345.678/9012-3'],
  ['12345678901234', '12.345.678/9012-34'],
]

const invalidCases = [
  [0 as unknown as string, ''],
  [null as unknown as string, ''],
  [undefined as unknown as string, ''],
  [NaN as unknown as string, ''],
  [true as unknown as string, ''],
  [false as unknown as string, ''],
  [{} as unknown as string, ''],
  [[] as unknown as string, ''],
];

describe('Mask: maskCpfCnpj', () => {
  it('should be a function', () => {
    expect(typeof mask.cpfCnpj).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof mask.cpfCnpj('12345678901')).toBe('string');
  });

  it.each(cases)('should format string input "%s" to "%s"', (input, expected) => {
    expect(mask.cpfCnpj(input)).toBe(expected);
  });
  
  it.each(invalidCases)('should format invalid string input "%s" to "%s"', (input, expected) => {
    expect(mask.cpfCnpj(input)).toBe(expected);
  });
});