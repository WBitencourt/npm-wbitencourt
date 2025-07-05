import { describe, it, expect } from 'vitest'
import { mask } from '.';

describe('Mask: maskCurrencyBRL', () => {
  const stringCases = [
    ['0', 'R$ 0,00'],
    ['10000', 'R$ 100,00'],
    ['100000', 'R$ 1.000,00'],
    ['1000000', 'R$ 10.000,00'],
    ['10000000', 'R$ 100.000,00'],
    ['100000000', 'R$ 1.000.000,00'],
  ];

  const numberCases = [
    [0, 'R$ 0,00'],
    [10000, 'R$ 100,00'],
    [100000, 'R$ 1.000,00'],
    [1000000, 'R$ 10.000,00'],
    [10000000, 'R$ 100.000,00'],
    [100000000, 'R$ 1.000.000,00'],
  ];

  const invalidCases = [
    ['xpto', 'R$ 0,00'],
    ['', 'R$ 0,00'],
    [null as unknown as string, 'R$ 0,00'],
    [undefined as unknown as string, 'R$ 0,00'],
  ];

  it('should be a function', () => {
    expect(typeof mask.currencyBRL).toBe('function');
  });

  it('should return a string', () => {
    expect(typeof mask.currencyBRL('100')).toBe('string');
  });

  it.each(stringCases)('should format string input "%s" to "%s"', (input, expected) => {
    expect(mask.currencyBRL(input)).toBe(expected);
  });

  it.each(numberCases)('should format number input %s to "%s"', (input, expected) => {
    expect(mask.currencyBRL(input)).toBe(expected);
  });

  it.each(invalidCases)('should format invalid input "%s" to "%s"', (input, expected) => {
    expect(mask.currencyBRL(input)).toBe(expected);
  });
});

