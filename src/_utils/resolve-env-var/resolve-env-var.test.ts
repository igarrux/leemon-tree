import { describe, it, expect, afterAll, vi } from 'vitest';
import { resolveEnvVar } from './resolve-env-var.js';

describe('resolveEnvVar', () => {
    afterAll(() => {
        process.env.TEST_VAR = 'test';
    });
    it('should resolve environment variable', () => {
        process.env.TEST_VAR = 'test';
        expect(resolveEnvVar('{{TEST_VAR}}')).toBe('test');
    });
    it('should throw error if environment variable is not defined', () => {
        const spyConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        expect(()=>resolveEnvVar('{{TEST_VAR2}}')).toThrow('process.exit unexpectedly called with "1"');
        expect(spyConsoleError).toHaveBeenCalledWith('Environment variable TEST_VAR2 is not defined');
    });
    it('should return the same value if it is not a environment variable', () => {
        expect(resolveEnvVar('test')).toBe('test');
    });
});
