import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { deleteCommand } from './delete.js';
import { PrintMessages } from '../../_utils/index.js';
import { loadTranslations } from '../_utils/load-translations/laod-translations.js';
import { writeFileSync } from 'node:fs';
import prompt from 'prompts'
import { config } from '../../../_utils/index.js';

vi.mock('node:fs', () => ({ writeFileSync: vi.fn() }));

vi.mock('../../../_utils/index.js', () => ({
    config: vi.fn(() => ({
        cliLanguage: 'es',
        languages: ['es', 'en'],
    })),
}));

vi.mock('../_helpers/index.js', () => ({
    resolveLanguageConfig: vi.fn((_, lng) => ({ filePath: `${lng}.json` })),
}));

vi.mock('../_utils/load-translations/laod-translations.js', () => ({
    loadTranslations: vi.fn(),
}));

vi.mock('../../_utils/index.js', () => ({
    PrintMessages: {
        dryRunResult: vi.fn(),
        translationDeleted: vi.fn(),
        translationNotFound: vi.fn(),
    },
}));

vi.mock('prompts', () => ({
    __esModule: true,
    default: vi.fn(),
}));

describe('deleteCommand', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });
    it('does nothing if user does not confirm', async () => {
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: false });
        await deleteCommand({ key: 'foo', dryRun: false });
        expect(PrintMessages.translationDeleted).not.toHaveBeenCalled();
        expect(PrintMessages.dryRunResult).not.toHaveBeenCalled();
        expect(writeFileSync).not.toHaveBeenCalled();
    });

    it('deletes translation in all languages (dryRun=false)', async () => {
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: true });
        (loadTranslations as Mock).mockImplementation((filePath: string) => ({
            foo: 'bar',
            other: 'baz',
        }));
        await deleteCommand({ key: 'foo', dryRun: false });
        expect(writeFileSync).toHaveBeenCalledTimes(2);
        expect(PrintMessages.translationDeleted).toHaveBeenCalledWith('foo');
        expect(PrintMessages.dryRunResult).not.toHaveBeenCalled();
    });

    it('deletes translation in all languages (dryRun=true)', async () => {
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: true });
        (loadTranslations as Mock).mockImplementation((filePath: string) => ({
            foo: 'bar',
            other: 'baz',
        }));
        await deleteCommand({ key: 'foo', dryRun: true });
        expect(writeFileSync).not.toHaveBeenCalled();
        expect(PrintMessages.dryRunResult).toHaveBeenCalledWith(['es.json', 'en.json']);
        expect(PrintMessages.translationDeleted).toHaveBeenCalledWith('foo');
    });

    it('does not delete if key does not exist', async () => {
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: true });
        (loadTranslations as Mock).mockImplementation((filePath: string) => ({ other: 'baz' }));
        await deleteCommand({ key: 'foo', dryRun: false });
        expect(writeFileSync).not.toHaveBeenCalled();
        expect(PrintMessages.dryRunResult).not.toHaveBeenCalled();
        expect(PrintMessages.translationDeleted).not.toHaveBeenCalled();
        expect(PrintMessages.translationNotFound).toHaveBeenCalledWith('foo');
    });

    it('handles missing translations object', async () => {
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: true });
        (loadTranslations as Mock).mockImplementation(() => ({}));
        await deleteCommand({ key: 'foo', dryRun: false });
        expect(writeFileSync).not.toHaveBeenCalled();
        expect(PrintMessages.translationDeleted).not.toHaveBeenCalled();
        expect(PrintMessages.translationNotFound).toHaveBeenCalledWith('foo');
    });
    it('uses cliMessages.en if cliMessages[lang] does not exist', async () => {
        (config as Mock).mockReturnValueOnce({ cliLanguage: 'zh', languages: ['ru', 'en'] });
        const { cliMessages } = await import('../../_messages/messages');
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: false });
        await deleteCommand({ key: 'foo', dryRun: false });
        expect((prompt as unknown as Mock).mock.calls[0][0].message).toBe(cliMessages.en.delete_translation);
        vi.resetModules();
        (prompt as unknown as Mock).mockRestore();
    });

    it('uses en if cliMessages[lang] is undefined', async () => {
        (config as Mock).mockReturnValueOnce({ cliLanguage: 'fr', languages: ['es', 'en'] });
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: false });
        await deleteCommand({ key: 'foo', dryRun: false });
        vi.resetModules();
    });

    it('uses empty array if config.languages is nullish', async () => {
        (config as Mock).mockReturnValueOnce({ cliLanguage: 'es', languages: undefined });
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: false });
        await deleteCommand({ key: 'foo', dryRun: false });
        vi.resetModules();
    });

    it('should use [] if config.languages is nullish', async () => {
        (config as Mock).mockReturnValueOnce({ cliLanguage: 'es', languages: undefined });
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: false });
        await deleteCommand({ key: 'foo', dryRun: false });
        vi.resetModules();
    });

    it('should not delete if key does not exist', async () => {
        (prompt as unknown as Mock).mockResolvedValueOnce({ delete: true });
        (loadTranslations as Mock).mockImplementation((filePath: string) => ({ other: 'baz' }));
        await deleteCommand({ key: 'foo', dryRun: false });
        expect(writeFileSync).not.toHaveBeenCalled();
        expect(PrintMessages.dryRunResult).not.toHaveBeenCalled();
        expect(PrintMessages.translationDeleted).not.toHaveBeenCalled();
        expect(PrintMessages.translationNotFound).toHaveBeenCalledWith('foo');
    });
});
