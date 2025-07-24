import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import * as loadConfigModule from './load-config.js';
process.env.TEST_VAR = 'test';
vi.mock('fs', () => ({
    readFileSync: vi.fn().mockImplementation(() => {
        return 'test';
    }),
}));

vi.mock('yaml', () => ({
    parse: vi.fn().mockImplementation(() => ({
        api: {
            provider: 'microsoft',
            key: 'test',
        },
        languages: ['test'],
        sourceLanguage: 'test',
        default: {
            filePattern: 'test',
            protectionPattern: 'test',
        },
    })),
}));

describe('loadConfig', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });
    it('should load the config file', () => {
        expect(loadConfigModule.loadConfig).toBeDefined();
    });

    it('should throw an error if the config file is not found', () => {
        const spyConsoleError = vi.spyOn(console, 'error');
        (readFileSync as Mock).mockImplementationOnce(() => {
            throw new Error("ENOENT: no such file or directory, open 'lemon-tree.yaml'");
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError('process.exit unexpectedly called with "1"');
        expect(spyConsoleError).toHaveBeenCalledWith('lemon-tree.yaml file not found');
    });

    it('should throw an error if the languages is not provided', () => {
        (parse as Mock).mockReturnValueOnce({
            api: {
                key: 'test',
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError(new Error('Failed to load config file: Error: languages must be an array'));
    });

    it('should throw an error if the languages is not an array', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: 'test',
            api: {
                key: 'test',
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError(new Error('Failed to load config file: Error: languages must be an array'));
    });

    it('should throw an error if the languages is an empty array', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: [],
            api: {
                key: 'test',
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError(
            new Error(
                'Failed to load config file: Error: languages must be an array with at least one language',
            ),
        );
    });

    it('should throw an error if the sourceLanguage is not provided', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: null,
            api: {
                key: 'test',
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError(
            new Error('Failed to load config file: Error: sourceLanguage must be a string'),
        );
    });

    it('should throw an error if the sourceLanguage is not a string', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 1,
            api: {
                key: 'test',
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError(
            new Error('Failed to load config file: Error: sourceLanguage must be a string'),
        );
    });

    it('should throw an error if the default.filePattern is provided but is not a string', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 'test',
            api: {
                key: 'test',
            },
            default: {
                filePattern: 1,
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError(
            new Error('Failed to load config file: Error: default.filePattern must be a string'),
        );
    });

    it('should throw an error if the default.protectionPattern is provided but is not a string', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 'test',
            api: {
                key: 'test',
            },
            default: {
                filePattern: 'test',
                protectionPattern: 1,
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError(
            new Error(
                'Failed to load config file: Error: default.protectionPattern must be a string',
            ),
        );
    });

    it('should throw an error if the api.provider is not provided', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 'test',
            default: {
                filePattern: 'test',
                protectionPattern: 'test',
            },
            api: {
                key: 'test',
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({ configFile: 'lemon-tree.yaml', admitedApiProviders: [] }),
        ).toThrowError(
            new Error('Failed to load config file: Error: api.provider must be a string'),
        );
    });

    it('should throw an error if the api.provider is not in the admitedApiProviders', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 'test',
            default: {
                filePattern: 'test',
                protectionPattern: 'test',
            },
            api: {
                provider: 'test',
                key: 'test',
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({
                configFile: 'lemon-tree.yaml',
                admitedApiProviders: ['microsoft', 'openai'],
            }),
        ).toThrowError(
            new Error(
                'Failed to load config file: Error: api.provider must be one of microsoft, openai',
            ),
        );
    });

    it('should throw an error if the api.key is not provided', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 'test',
            default: {
                filePattern: 'test',
                protectionPattern: 'test',
            },
            api: {
                provider: 'microsoft',
                key: null,
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({
                configFile: 'lemon-tree.yaml',
                admitedApiProviders: ['microsoft', 'openai'],
            }),
        ).toThrowError(new Error('Failed to load config file: Error: api.key must be a string'));
    });

    it('should resolve the api.key if it is an environment variable', () => {
        process.env.TEST_VAR = 'test';
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 'test',
            default: {
                filePattern: 'test',
                protectionPattern: 'test',
            },
            api: {
                provider: 'microsoft',
                key: '{{TEST_VAR}}',
            },
        });
        expect(
            loadConfigModule.loadConfig({
                configFile: 'lemon-tree.yaml',
                admitedApiProviders: ['microsoft', 'openai'],
            }).api.key,
        ).toBe('test');
    });

    it('should throw an error if the api.plugin is not provided', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 'test',
            default: {
                filePattern: 'test',
                protectionPattern: 'test',
            },
            api: {
                provider: 'plugin',
                plugin: null,
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({
                configFile: 'lemon-tree.yaml',
                admitedApiProviders: ['plugin'],
            }),
        ).toThrowError(new Error('Failed to load config file: Error: api.plugin must be a string'));
    });

    it('should throw an error if the api.plugin is not a string', () => {
        (parse as Mock).mockReturnValueOnce({
            languages: ['test'],
            sourceLanguage: 'test',
            default: {
                filePattern: 'test',
                protectionPattern: 'test',
            },
            api: {
                provider: 'plugin',
                plugin: 1,
            },
        });
        expect(() =>
            loadConfigModule.loadConfig({
                configFile: 'lemon-tree.yaml',
                admitedApiProviders: ['plugin'],
            }),
        ).toThrowError(new Error('Failed to load config file: Error: api.plugin must be a string'));
    });

    describe('config', () => {
        it('should return the config', () => {
            expect(loadConfigModule.config()).toBeDefined();
        });
        it('should return the config', () => {
            expect(loadConfigModule.config()).toBeDefined();
        });
        it('should only load the config once', async () => {
            (readFileSync as Mock).mockClear();
            loadConfigModule.config(true);
            loadConfigModule.config();
            loadConfigModule.config();
            expect(readFileSync).toHaveBeenCalledOnce();
        });
    });
});
