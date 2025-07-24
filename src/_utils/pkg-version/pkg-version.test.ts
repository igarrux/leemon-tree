import { describe, it, expect } from 'vitest';
import { getPkgVersion } from './pkg-version.js';

describe('getPkgVersion', () => {
    it('should return the version of the package', () => {
        expect(getPkgVersion()).toMatch(/^\d+\.\d+\.\d+$/);
    });
});
