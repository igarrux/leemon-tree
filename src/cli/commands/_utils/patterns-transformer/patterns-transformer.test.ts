import transformPattern from './patterns-transformer.js';
import { describe, it, expect } from 'vitest';

describe('patterns-transformer', () => {
    it('should replace variables in pattern', () => {
        expect(transformPattern('foo-{{lang}}.json', { lang: 'es' })).toBe('foo-es.json');
    });
    it('should leave unknown variables untouched', () => {
        expect(transformPattern('foo-{{unknown}}.json', {})).toBe('foo-{{unknown}}.json');
    });

    it('should apply the expression to the variable', () => {
        expect(transformPattern('foo-{{lang.toUpperCase()}}.json', { lang: 'es' })).toBe('foo-ES.json');
    });
});
