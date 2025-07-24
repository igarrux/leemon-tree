import { join } from 'path';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LemonTreeConfig } from '../../../../_utils/index.js';

vi.mock('../../_utils/patterns-transformer/patterns-transformer', () => ({
    __esModule: true,
    default: vi.fn((pattern, vars) => pattern.replace('{lang}', vars.lang)),
}));
vi.mock('path', () => ({
    join: vi.fn((...args) => args.join('/')),
    dirname: vi.fn((path) => path.split('/').slice(0, -1).join('/')),
}));
describe('resolveLanguageConfig', () => {
    let resolveLanguageConfig: typeof import('./resolve-language-config').resolveLanguageConfig;
    let transformPattern: typeof vi.fn;
    let originalCwd: () => string;

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        ({ resolveLanguageConfig } = await import('./resolve-language-config'));
        transformPattern = (await import('../../_utils/patterns-transformer/patterns-transformer'))
            .default as unknown as import('vitest').Mock;
        originalCwd = process.cwd;
        process.cwd = () => '/root';
    });

    afterEach(() => {
        process.cwd = originalCwd;
    });

    it('resuelve config con langConfig específico', () => {
        const config = {
            translations: [
                { lang: 'es', filePattern: 'foo/{lang}.json', protectionPattern: 'PROT' },
            ],
            default: { filePattern: 'default/{lang}.json', protectionPattern: 'DEFPROT' },
            api: { provider: 'deepl' },
            sourceLanguage: 'en',
        } as unknown as LemonTreeConfig;
        const result = resolveLanguageConfig(config, 'es');
        expect(result.filePattern).toBe('foo/{lang}.json');
        expect(result.protectionPattern).toBe('PROT');
        expect(result.filePath).toBe('/root/foo/es.json');
        expect(result.dir).toBe('/root/foo');
        expect(result.langConfig).toEqual({
            lang: 'es',
            filePattern: 'foo/{lang}.json',
            protectionPattern: 'PROT',
        });
        expect(transformPattern).toHaveBeenCalledWith('foo/{lang}.json', {
            lang: 'es',
            provider: 'deepl',
            sourceLanguage: 'en',
        });
    });

    it('resuelve config usando default si no hay langConfig', () => {
        const config = {
            default: { filePattern: 'default/{lang}.json', protectionPattern: 'DEFPROT' },
            api: { provider: 'deepl' },
            sourceLanguage: 'en',
        } as unknown as LemonTreeConfig;
        const result = resolveLanguageConfig(config, 'fr');
        expect(result.filePattern).toBe('default/{lang}.json');
        expect(result.protectionPattern).toBe('DEFPROT');
        expect(result.filePath).toBe('/root/default/fr.json');
        expect(result.dir).toBe('/root/default');
        expect(result.langConfig).toEqual({});
        expect(transformPattern).toHaveBeenCalledWith('default/{lang}.json', {
            lang: 'fr',
            provider: 'deepl',
            sourceLanguage: 'en',
        });
    });

    it('resuelve config con typeDefinition', () => {
        const config = {
            default: {
                typeDefinition: { file: './src/translations.types.ts', exportName: 'Translations' },
                filePattern: 'default/{lang}.json',
            },
        } as unknown as LemonTreeConfig;
        const result = resolveLanguageConfig(config, 'es');
        expect(result.typeDefinition).toEqual({
            file: join('/root', './src/translations.types.ts'),
            exportName: 'Translations',
        });
    });

    it('resuelve config con typeDefinition en langConfig', () => {
        const config = {
            translations: [
                {
                    lang: 'es',
                    typeDefinition: {
                        file: 'src/translations.types.ts',
                        exportName: 'Translations',
                    },
                    filePattern: 'foo/{lang}.json',
                },
            ],
        } as unknown as LemonTreeConfig;
        const result = resolveLanguageConfig(config, 'es');
        expect(result.typeDefinition).toEqual({
            file: '/root/src/translations.types.ts',
            exportName: 'Translations',
        });
    });
});
