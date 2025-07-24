import { describe, it, expect } from 'vitest';
import { findDominantSeparator } from './find-dominant-separator.js';

describe('findDominantSeparator', () => {
    it('returns ; if most frequent', () => {
        expect(findDominantSeparator('a; b; c;')).toBe(';');
    });
    it('returns , if most frequent', () => {
        expect(findDominantSeparator('a, b, c,')).toBe(',');
    });
    it('returns \n if most frequent', () => {
        expect(findDominantSeparator('a\nb\nc\n')).toBe('\n');
    });
    it('returns first in tie', () => {
        expect([';', ',', '\n']).toContain(findDominantSeparator('a; b, c\n'));
    });
    it('returns ; if no separators', () => {
        expect(findDominantSeparator('abc')).toBe(';');
    });
});
