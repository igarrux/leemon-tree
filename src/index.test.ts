import { vi, describe, it, beforeEach, afterEach, expect } from 'vitest';

vi.mock('prompts', () => ({ default: { override: vi.fn() } }));
vi.mock('./cli/cli.js', () => ({ cli: vi.fn() }));

import prompts from 'prompts';
import { cli } from './cli/cli.js';

describe('src/index.ts', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('calls cli()', async () => {
        await import('./index.js');
        expect(cli).toHaveBeenCalled();
    });

    it('overrides prompts with LT_AUTO_YES', async () => {
        process.env.LT_AUTO_YES = 'true';
        await import('./index.js');
        expect(prompts.override).toHaveBeenCalledWith({ action: 'yes-to-all', delete: true });
    });
});
