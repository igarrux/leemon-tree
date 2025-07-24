import path from 'path';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const GOOGLE_FN = () => 'google';
const MICROSOFT_FN = () => 'microsoft';
const DEEPL_FN = () => 'deepl';
const YANDEX_FN = () => 'yandex';
const PLUGIN_FN = () => 'plugin';

vi.mock('../../../../_utils/index.js', () => ({
    config: vi.fn(),
}));

vi.mock('../../../../translation-providers/google/google', () => ({
    googleTranslate: GOOGLE_FN,
}));
vi.mock('../../../../translation-providers/microsoft/microsoft', () => ({
    microsoftTranslate: MICROSOFT_FN,
}));
vi.mock('../../../../translation-providers/deepl/deepl', () => ({
    deeplTranslate: DEEPL_FN,
}));
vi.mock('../../../../translation-providers/yandex/yandex', () => ({
    yandexTranslate: YANDEX_FN,
}));

const pluginPath = require('path').join(process.cwd(), '__mocks__/plugin.js');
vi.mock('path', async () => {
    const actual = await vi.importActual<typeof import('path')>('path');
    return {
        ...actual,
        join: () => pluginPath,
    };
});

// Mock dynamic import for plugin
const originalImport = (globalThis as any)['__import__'] || (globalThis as any)['import'];
(globalThis as any)['import'] = async (path: any) => {
    if (path === pluginPath) return { default: PLUGIN_FN };
    throw new Error('Unknown dynamic import: ' + path);
};

describe('getTranslationProvider', () => {
    let getTranslationProvider: any;
    beforeEach(async () => {
        vi.clearAllMocks();
        ({ getTranslationProvider } = await import('./get-translation-provider'));
    });
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('returns googleTranslate for google', async () => {
        const { config } = await import('../../../../_utils/index.js');
        (config as any).mockReturnValue({ api: { provider: 'google' } });
        const fn = await getTranslationProvider();
        expect(fn).toBe(GOOGLE_FN);
    });

    it('returns microsoftTranslate for microsoft', async () => {
        const { config } = await import('../../../../_utils/index.js');
        (config as any).mockReturnValue({ api: { provider: 'microsoft' } });
        const fn = await getTranslationProvider();
        expect(fn).toBe(MICROSOFT_FN);
    });

    it('returns deeplTranslate for deepl-free', async () => {
        const { config } = await import('../../../../_utils/index.js');
        (config as any).mockReturnValue({ api: { provider: 'deepl-free' } });
        const fn = await getTranslationProvider();
        expect(fn).toBe(DEEPL_FN);
    });

    it('returns deeplTranslate for deepl-pro', async () => {
        const { config } = await import('../../../../_utils/index.js');
        (config as any).mockReturnValue({ api: { provider: 'deepl-pro' } });
        const fn = await getTranslationProvider();
        expect(fn).toBe(DEEPL_FN);
    });

    it('returns yandexTranslate for yandex', async () => {
        const { config } = await import('../../../../_utils');
        (config as any).mockReturnValue({ api: { provider: 'yandex' } });
        const fn = await getTranslationProvider();
        expect(fn).toBe(YANDEX_FN);
    });

    it('returns plugin default for plugin', async () => {
        const { config } = await import('../../../../_utils/index.js');
        const spyjoin = vi.spyOn(path, 'join');
        const spyCwd = vi.spyOn(process, 'cwd');
        (config as any).mockReturnValue({
            api: { provider: 'plugin', plugin: '__mocks__/plugin.js' },
        });
        const fn = await getTranslationProvider();
        expect(spyjoin).toHaveBeenCalledWith(process.cwd(), '__mocks__/plugin.js');
        expect(spyCwd).toHaveBeenCalled();
        expect(fn()).toBe('plugin-mock');
    });

    it('throws an error if the provider is not supported', async () => {
        const { config } = await import('../../../../_utils/index.js');
        const spyjoin = vi.spyOn(path, 'join');
        (config as any).mockReturnValue({ api: { provider: 'unsupported' } });
        await expect(getTranslationProvider()).rejects.toThrow('Unsupported provider: unsupported');
        expect(spyjoin).not.toHaveBeenCalled();
    });
    it('throws an error if the provider is not null', async () => {
        const { config } = await import('../../../../_utils/index.js');
        const spyjoin = vi.spyOn(path, 'join');
        (config as any).mockReturnValue({ api: { provider: 'unsupported' } });
        await expect(getTranslationProvider()).rejects.toThrow('Unsupported provider: unsupported');
        expect(spyjoin).not.toHaveBeenCalled();
    });

    it('throws an error if the provider is not provided', async () => {
        const { config } = await import('../../../../_utils/index.js');
        (config as any).mockReturnValue({ api: { provider: 'unsupported' } });
        await expect(getTranslationProvider()).rejects.toThrow('Unsupported provider: unsupported');
    });

    it('throws an error if the provider config is not defined', async () => {
        const { config } = await import('../../../../_utils/index.js');
        (config as any).mockReturnValue(null);
        await expect(getTranslationProvider()).rejects.toThrow('Provider config is not defined');
    });

    it('throws an error if the provider is not defined', async () => {
        const { config } = await import('../../../../_utils/index.js');
        (config as any).mockReturnValue({ api: { provider: undefined } });
        await expect(getTranslationProvider()).rejects.toThrow('Provider is not defined');
    });
});

// Restore global import
if (originalImport) (globalThis as any)['import'] = originalImport;
