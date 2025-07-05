import { describe, it, expect } from 'vitest';
import { mask } from '.';
const cases = [
    ['1', '+55 (1'],
    ['11', '+55 (11'],
    ['119', '+55 (11) 9'],
    ['1194545', '+55 (11) 94545'],
    ['11945457', '+55 (11) 9454-57'],
    ['119454570', '+55 (11) 9454-570'],
    ['1194545707', '+55 (11) 9454-5707'],
    ['11945457070', '+55 (11) 94545-7070'],
    ['119454570707070', '+55 (11) 94545-7070'],
];
const invalidCases = [
    ['xpto', '+55'],
    [0, ''],
    [null, ''],
    [undefined, ''],
    [NaN, ''],
    [true, ''],
    [false, ''],
    [{}, ''],
    [[], ''],
];
describe('Mask: maskPhone', () => {
    it('should be a function', () => {
        expect(typeof mask.phone).toBe('function');
    });
    it('should return a string', () => {
        expect(typeof mask.phone('11999999999')).toBe('string');
    });
    it.each(cases)('should format string input "%s" to "%s"', (input, expected) => {
        expect(mask.phone(input)).toBe(expected);
    });
    it.each(invalidCases)('should format invalid input "%s" to "%s"', (input, expected) => {
        expect(mask.phone(input)).toBe(expected);
    });
});
