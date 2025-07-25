import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../../_utils', () => ({
    config: vi.fn().mockReturnValue({ cliLanguage: 'en' }),
    version: '1.2.3',
}));

import { PrintMessages } from './print_message';
import { cliMessages } from '../../_messages/messages';
import { config } from '../../../_utils';

let logSpy: any;
let warnSpy: any;
let writeSpy: any;

beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    writeSpy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
});

afterEach(() => {
    logSpy.mockRestore();
    warnSpy.mockRestore();
    writeSpy.mockRestore();
    vi.resetModules();
    vi.clearAllMocks();
});

describe('PrintMessages', () => {
    it('welcome prints welcome and version', () => {
        PrintMessages.welcome();
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.welcome));
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.version));
    });

    it('unknownCommand prints unknown and usage', () => {
        PrintMessages.unknownCommand();
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining(cliMessages.en.unknown_command),
        );
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.usage));
    });

    it('usage prints usage', () => {
        PrintMessages.usage();
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.usage));
    });

    it('casingConflict prints warning', () => {
        PrintMessages.casingConflict('dir', 'similar', 'base');
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                cliMessages.en.casing_conflict
                    .replace('{{dir}}', 'dir')
                    .replace('{{similar}}', 'similar')
                    .replace('{{baseName}}', 'base'),
            ),
        );
    });

    it('renamedFile prints warning', () => {
        PrintMessages.renamedFile('old', 'new');
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                cliMessages.en.renamed_file
                    .replace('{{oldPath}}', 'old')
                    .replace('{{newPath}}', 'new'),
            ),
        );
    });

    it('keyExists returns formatted string', () => {
        const msg = PrintMessages.keyExists('es', 'key', 'val');
        expect(msg).toEqual(
            expect.stringMatching(
                cliMessages.en.key_exists_in_lng
                    .replace('{{lng}}', '.*es.*')
                    .replace('{{key}}', '.*key.*')
                    .replace('{{currentValue}}', '.*val.*'),
            ),
        );
    });

    it('failedToTranslate prints warning', () => {
        PrintMessages.failedToTranslate('key', 'en', 'es', 'err');
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringMatching(
                cliMessages.en.failed_to_translate
                    .replace('{{key}}', '.*')
                    .replace('{{sourceLanguage}}', '.*')
                    .replace('{{lang}}', '.*')
                    .replace('{{error}}', '.*'),
            ),
        );
    });

    it('skippedKey prints warning', () => {
        PrintMessages.skippedKey('key', 'es');
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringMatching(
                cliMessages.en.skipped_key.replace('{{key}}', '.+').replace('{{lang}}', '.+'),
            ),
        );
    });

    it('clearTerminal calls process.stdout.write', () => {
        PrintMessages.clearTerminal();
        expect(writeSpy).toHaveBeenCalledWith('\x1Bc');
    });

    it('editing prints editing', () => {
        PrintMessages.editing();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.editing));
    });

    it('emptyText prints empty_text', () => {
        PrintMessages.emptyText();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.empty_text));
    });

    it('emptyKey prints empty_key', () => {
        PrintMessages.emptyKey();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.empty_key));
    });

    it('overwriteAll prints overwrite_all', () => {
        PrintMessages.overwriteAll();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.overwrite_all));
    });

    it('skipAll prints skip_all', () => {
        PrintMessages.skipAll();
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.skip_all));
    });

    it('translationAdded prints translation_added', () => {
        PrintMessages.translationAdded('key');
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringMatching(cliMessages.en.translation_added.replace('{{key}}', '.*')),
        );
    });

    it('howToExit prints how_to_exit', () => {
        PrintMessages.howToExit();
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.how_to_exit));
    });

    it('dryRunResult prints updated files', () => {
        PrintMessages.dryRunResult(['a', 'b']);
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                cliMessages.en.dry_run_result.replace('{{updatedFiles}}', 'a, b'),
            ),
        );
        PrintMessages.dryRunResult(new Set(['c', 'd']));
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining(
                cliMessages.en.dry_run_result.replace('{{updatedFiles}}', 'c, d'),
            ),
        );
        PrintMessages.dryRunResult('e');
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringContaining(cliMessages.en.dry_run_result.replace('{{updatedFiles}}', 'e')),
        );
    });

    it('translationDeleted prints translation_deleted', () => {
        PrintMessages.translationDeleted('key');
        expect(logSpy).toHaveBeenCalledWith(
            expect.stringMatching(cliMessages.en.translation_deleted.replace('{{key}}', '.*')),
        );
    });

    it('lintKey prints lint_key', () => {
        PrintMessages.lintKey('foo');
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('foo'));
    });

    it('lintPresent prints lint_present', () => {
        PrintMessages.lintPresent(['es', 'en']);
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('es, en'));
    });

    it('lintMissing prints lint_missing', () => {
        PrintMessages.lintMissing(['fr']);
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('fr'));
    });

    it('lintEdit prints lint_edit', () => {
        PrintMessages.lintEdit();
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.lint_edit));
    });

    it('lintDelete prints lint_delete', () => {
        PrintMessages.lintDelete();
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.lint_delete));
    });

    it('lintSummary prints lint_summary', () => {
        PrintMessages.lintSummary({
            correctKeys: 1,
            keysWithProblems: 2,
            filesWithProblems: 3,
            totalFiles: 4,
            totalKeys: 5,
        });
        const call = logSpy.mock.calls.find(
            ([msg]: [string]) =>
                typeof msg === 'string' &&
                /2 keys with problems[\s\S]*3 files with problems[\s\S]*4 total files[\s\S]*5 total keys[\s\S]*1 keys without problems/.test(
                    msg.replace(/\x1B\[[0-9;]*m/g, ''), // quita colores ANSI
                ),
        );
        if (!call) {
            // eslint-disable-next-line no-console
            console.error('logSpy.mock.calls:', logSpy.mock.calls);
        }
        expect(call).toBeTruthy();
    });

    it('covers fallback to en if cliLanguage is missing', async () => {
        (config as any).mockReturnValueOnce({ cliLanguage: '' });

        const { PrintMessages: PM } = await import('./print_message');
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        PM.welcome();
        expect(spy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.welcome));
        vi.resetModules();
        spy.mockRestore();
    });

    it('covers fallback to en for missing message keys', async () => {
        (config as any).mockReturnValueOnce({ cliLanguage: 'zh' });

        const { PrintMessages: PM } = await import('./print_message');
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        PM.welcome();
        expect(spy).toHaveBeenCalledWith(expect.stringContaining(cliMessages.en.welcome));
        vi.resetModules();
        spy.mockRestore();
    });

    it('should use en if cliLanguage is not set', async () => {
        (config as any).mockReturnValueOnce({ cliLanguage: '' });
        const { PrintMessages: PM } = await import('./print_message');
        expect(PM.lang).toBe('en');
    });

    it('should use cliLanguage if set', async () => {
        (config as any).mockReturnValueOnce({ cliLanguage: 'es' });
        const { PrintMessages: PM } = await import('./print_message');
        expect(PM.lang).toBe('es');
    });

    it('noAddTranslation prints no_add_translation', () => {
        PrintMessages.noAddTranslation('key');
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('key'));
    });

    it('translationNotFound prints translation_not_found', () => {
        expect(() => PrintMessages.translationNotFound('key')).toThrow(
            'process.exit unexpectedly called with "4"',
        );
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('key'));
        vi.resetModules();
    });

    it('typeDefinitionNotFound prints type_definition_not_found', () => {
        expect(() => PrintMessages.typeDefinitionNotFound('key')).toThrow(
            'process.exit unexpectedly called with "4"',
        );
        expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('key'));
        vi.resetModules();
    });
});
