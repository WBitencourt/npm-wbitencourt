import { describe, it, expect } from 'vitest';
import { mask } from '.';
const cases = [
    ['joao.frango@oito.srv.br', 'joao.frango@oito.srv.br'],
    ['joao_frango@oito.srv.br', 'joao_frango@oito.srv.br'],
    ['joao+frango@oito.srv.br', 'joao+frango@oito.srv.br'],
    ['joao-frango@oito.srv.br', 'joao-frango@oito.srv.br'],
];
const invalidCases = [
    ['joao!#$%¨&*()=§frango@oito.srv.br', 'joaofrango@oito.srv.br'],
    ['joao@frango@oito.srv.br', 'joao@frango'],
    [0, ''],
    [null, ''],
    [undefined, ''],
    [NaN, ''],
    [true, ''],
    [false, ''],
    [{}, ''],
    [[], ''],
];
describe('Mask: maskEmail', () => {
    it('should be a function', () => {
        expect(typeof mask.email).toBe('function');
    });
    it('should return a string', () => {
        expect(typeof mask.email('joao.frango@oito.srv.br')).toBe('string');
    });
    it.each(cases)('should format string input "%s" to "%s"', (input, expected) => {
        expect(mask.email(input)).toBe(expected);
    });
    it.each(invalidCases)('should format invalid input "%s" to "%s"', (input, expected) => {
        expect(mask.email(input)).toBe(expected);
    });
});
