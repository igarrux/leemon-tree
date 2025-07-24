import { describe, it, expect, vi } from 'vitest';
import { randomUUID } from 'crypto';
import { ProtectedTextManager } from './protected-text-manager.js';

/**
 * Helper to generate random protected patterns for fuzzing.
 */
function randomPattern() {
    const delimiters = [
        ['__key__', '__', '__'],
        ['{{key}}', '{{', '}}'],
        ['--key--', '--', '--'],
        ['<key>', '<', '>'],
        ['[key]', '[', ']'],
        ['(key)', '(', ')'],
        ['%key%', '%', '%'],
        ['#key#', '#', '#'],
        ['!key!', '!', '!'],
        ['*key*', '*', '*'],
    ];
    const [pattern] = delimiters[Math.floor(Math.random() * delimiters.length)];
    return pattern;
}

describe('ProtectedTextManager', () => {
    it('should protect and restore a single segment', () => {
        const text = 'Hello {{name}}!';
        const manager = new ProtectedTextManager(text, '{{key}}');
        expect(manager.protectedText).toBe('Hello {0{name}}!');
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should protect and restore multiple segments', () => {
        const text = 'Hi {{name}}, your code is {{code}}.';
        const manager = new ProtectedTextManager(text, '{{key}}');
        expect(manager.protectedText).toBe('Hi {0{name}}, your code is {1{code}}.');
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should work with custom patterns', () => {
        const text = 'User: __username__, Pass: __password__';
        const manager = new ProtectedTextManager(text, '__key__');
        expect(manager.protectedText).toBe('User: {0{username}}, Pass: {1{password}}');
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should work with patterns containing special regex characters', () => {
        const text = 'Value: [key] and [another]';
        const manager = new ProtectedTextManager(text, '[key]');
        expect(manager.protectedText).toBe('Value: {0{key}} and {1{another}}');
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should not alter text if no protected pattern is found', () => {
        const text = 'No protected segments here.';
        const manager = new ProtectedTextManager(text, '{{key}}');
        expect(manager.protectedText).toBe(text);
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should throw if trying to restore an unknown id', () => {
        const text = 'Hello {{name}}!';
        const manager = new ProtectedTextManager(text, '{{key}}');
        // tamper with the protectedText to use a non-existent id
        const tampered = manager.protectedText.replace('{0{name}}', '{99{hacker}}');
        expect(() => manager.restoreProtectedTexts(tampered)).toThrow(/Protected ID 99/);
    });

    it('should handle nested or overlapping patterns as separate', () => {
        const text = 'A {{outer{{inner}}}} B';
        const manager = new ProtectedTextManager(text, '{{key}}');
        // Only the outermost pattern is matched
        expect(manager.protectedText).toBe('A {0{outer{{inner}}}} B');
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should work with empty protected segments', () => {
        const text = 'Empty: {{}}';
        const manager = new ProtectedTextManager(text, '{{key}}');
        expect(manager.protectedText).toBe('Empty: {0{}}');
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should work with unicode and multiline content', () => {
        const text = 'Emoji: {{😀}}\nMultiline: {{line1\nline2}}';
        const manager = new ProtectedTextManager(text, '{{key}}');
        expect(manager.protectedText).toBe('Emoji: {0{😀}}\nMultiline: {1{line1\nline2}}');
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should escape all regex special characters in pattern', () => {
        const text = 'Special: (key) [key] {key}';
        const patterns = ['(key)', '[key]', '{key}'];
        for (const pattern of patterns) {
            const manager = new ProtectedTextManager(text, pattern as `${string}key${string}`);
            // Only the matching pattern is replaced
            if (pattern === '(key)') {
                expect(manager.protectedText).toBe('Special: {0{key}} [key] {key}');
            }
            if (pattern === '[key]') {
                expect(manager.protectedText).toBe('Special: (key) {0{key}} {key}');
            }
            if (pattern === '{key}') {
                expect(manager.protectedText).toBe('Special: (key) [key] {0{key}}');
            }
            expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
        }
    });

    it('should work with random patterns and random content', () => {
        for (let i = 0; i < 10; i++) {
            const pattern = randomPattern();
            const content = randomUUID();
            const protectedText = pattern.replace('key', content);
            const text = `foo ${protectedText} bar`;
            const manager = new ProtectedTextManager(text, pattern as `${string}key${string}`);
            expect(manager.protectedText).toBe(`foo {0{${content}}} bar`);
            expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
            const modifiedText = `foo {0{other text}} bar`;
            expect(manager.restoreProtectedTexts(modifiedText)).toBe(text);
        }
    });

    it('should not break if pattern is at the start or end', () => {
        const text = '{{start}} middle {{end}}';
        const manager = new ProtectedTextManager(text, '{{key}}');
        expect(manager.protectedText).toBe('{0{start}} middle {1{end}}');
        expect(manager.restoreProtectedTexts(manager.protectedText)).toBe(text);
    });

    it('should throw if the protected pattern does not include the literal word `key`', () => {
        const text = 'Hello {{name}}!';
        const spy = vi.spyOn(console, 'error');
        expect(
            () =>
                new ProtectedTextManager(
                    text,
                    '{{not-a-valid-pattern}}' as unknown as `${string}key${string}`,
                ),
        ).toThrow('process.exit unexpectedly called with "1"');
        expect(spy).toHaveBeenCalledWith(
            'The protected pattern must include the literal word `key`',
        );
    });
});
