import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';

vi.mock('fs', () => ({
    existsSync: vi.fn(),
    readFileSync: vi.fn(),
}));

describe('loadTranslations', () => {
    let loadTranslations: typeof import('./laod-translations').loadTranslations;
    let existsSync: Mock;
    let readFileSync: Mock;
    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        ({ loadTranslations } = await import('./laod-translations'));
        const fs = await import('fs');
        existsSync = fs.existsSync as Mock;
        readFileSync = fs.readFileSync as Mock;
    });

    it('returns {} if the file does not exist', () => {
        existsSync.mockReturnValue(false);
        expect(loadTranslations('/foo.json')).toEqual({});
        expect(existsSync).toHaveBeenCalledWith('/foo.json');
    });

    it('returns the object if the file exists and is valid JSON', () => {
        existsSync.mockReturnValue(true);
        readFileSync.mockReturnValue('{"a":"b"}');
        expect(loadTranslations('/foo.json')).toEqual({ a: 'b' });
        expect(readFileSync).toHaveBeenCalledWith('/foo.json', 'utf-8');
    });

    it('returns {} and logs error if the file exists but is invalid JSON', () => {
        existsSync.mockReturnValue(true);
        readFileSync.mockReturnValue('not json');
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(loadTranslations('/foo.json')).toEqual({});
        expect(spy).toHaveBeenCalledWith('Failed to parse translations file: /foo.json');
        spy.mockRestore();
    });

    it('returns {} if the file exists but is empty', () => {
        existsSync.mockReturnValue(true);
        readFileSync.mockReturnValue('');
        expect(loadTranslations('/foo.json')).toEqual({});
        expect(readFileSync).toHaveBeenCalledWith('/foo.json', 'utf-8');
    });
});
