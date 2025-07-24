import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import type { TranslatorProviderFn } from '../../../../translation-providers/_types/translator-provider-fn.type.js';
import type { ProtectedTextManager } from '../../../../_utils/protected-text-manager/protected-text-manager.js';

vi.mock('../../../../_utils', () => ({
    config: vi.fn(),
}));
vi.mock('../../_utils/load-translations/laod-translations', () => ({
    loadTranslations: vi.fn(),
}));
vi.mock('../write-translation/write-translation', () => ({
    writeTranslations: vi.fn(),
}));
vi.mock('../../../_utils', () => ({
    PrintMessages: {
        failedToTranslate: vi.fn(),
    },
}));

vi.mock('../resolve-language-config/resolve-language-config', () => ({
    resolveLanguageConfig: vi.fn(() => ({
        typeDefinition: { file: '/tmp/fake.ts', exportName: 'Fake' },
        filePattern: 'fake.json',
        filePath: '/tmp/fake.json',
        dir: '/tmp',
        protectionPattern: 'PAT',
        langConfig: {},
    })),
}));

const mockProtectedTextManager: Partial<ProtectedTextManager> = {
    protectedText: 'PROTECTED',
    restoreProtectedTexts: vi.fn((t) => t + '_RESTORED'),
};

describe('handleTranslate', () => {
    let handleTranslate: typeof import('./handle-translate').handleTranslate;
    let translator: TranslatorProviderFn & { mockResolvedValue?: any; mockRejectedValue?: any };
    let updatedFiles: Map<string, { lang: string; translation: string }>;
    let translations: Partial<Record<string, string>>;
    let filePath: string;
    let key: string;
    let lang: string;

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        ({ handleTranslate } = await import('./handle-translate'));
        translator = vi.fn() as any;
        updatedFiles = new Map<string, { lang: string; translation: string }>();
        translations = {};
        filePath = '/file.json';
        key = 'hello';
        lang = 'es';
        const { config } = await import('../../../../_utils');
        (config as Mock).mockReturnValue({
            sourceLanguage: 'en',
            api: { key: 'APIKEY', provider: 'deepl-free' },
        });
        const { loadTranslations } = await import(
            '../../_utils/load-translations/laod-translations'
        );
        (loadTranslations as Mock).mockReturnValue(translations);
    });

    it('translates, updates updatedFiles, and writes if not dryRun', async () => {
        (translator as any).mockResolvedValue('TRAD');
        const { writeTranslations } = await import('../write-translation/write-translation');
        await handleTranslate({
            protectedText: mockProtectedTextManager as ProtectedTextManager,
            translator,
            lang,
            dryRun: false,
            updatedFiles,
            key,
            filePath,
        });
        expect(translator).toHaveBeenCalledWith({
            text: 'PROTECTED',
            from: 'en',
            to: 'es',
            apiKey: 'APIKEY',
            free: true,
        });
        expect(mockProtectedTextManager.restoreProtectedTexts).toHaveBeenCalledWith('TRAD');
        expect(translations[key]).toBe('TRAD_RESTORED');
        expect(updatedFiles.has(filePath)).toBe(true);
        expect(writeTranslations).toHaveBeenCalledWith(filePath, translations);
    });

    it('does not write if dryRun=true', async () => {
        (translator as any).mockResolvedValue('TRAD');
        const { writeTranslations } = await import('../write-translation/write-translation');
        await handleTranslate({
            protectedText: mockProtectedTextManager as ProtectedTextManager,
            translator,
            lang,
            dryRun: true,
            updatedFiles,
            key,
            filePath,
        });
        expect(writeTranslations).not.toHaveBeenCalled();
        expect(translations[key]).toBe('TRAD_RESTORED');
        expect(updatedFiles.has(filePath)).toBe(true);
    });

    it('calls PrintMessages.failedToTranslate if translator throws', async () => {
        const error = new Error('fail');
        (translator as any).mockRejectedValue(error);
        const { PrintMessages } = await import('../../../_utils');
        await handleTranslate({
            protectedText: mockProtectedTextManager as ProtectedTextManager,
            translator,
            lang,
            dryRun: false,
            updatedFiles,
            key,
            filePath,
        });
        expect(PrintMessages.failedToTranslate).toHaveBeenCalledWith(key, 'en', 'es', 'fail');
        expect(updatedFiles.has(filePath)).toBe(false);
    });

    it('does not translate if the language is the source language', async () => {
        lang = 'en';
        await handleTranslate({
            protectedText: mockProtectedTextManager as ProtectedTextManager,
            translator,
            lang,
            dryRun: false,
            updatedFiles,
            key,
            filePath,
        });
        expect(translator).not.toHaveBeenCalled();
        expect(updatedFiles.has(filePath)).toBe(true);
        expect(translations[key]).toBe('PROTECTED_RESTORED');
    });
});
