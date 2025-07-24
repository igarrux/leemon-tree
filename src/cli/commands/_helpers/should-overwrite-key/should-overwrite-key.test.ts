import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import * as config from '../../../../_utils/load-config/load-config.js';
import { cliMessages } from '../../../_messages/messages.js';
import { LemonTreeConfig } from '../../../../_utils/index.js';

vi.mock('prompts', () => ({
    __esModule: true,
    default: vi.fn(),
}));
vi.mock('../../../../cli/_utils', () => ({
    PrintMessages: {
        keyExists: vi.fn((lng, key, val) => `msg:${lng}:${key}:${val}`),
        yes: vi.fn(() => 'YES'),
        no: vi.fn(() => 'NO'),
        yesToAll: vi.fn(() => 'YES-ALL'),
        noToAll: vi.fn(() => 'NO-ALL'),
    },
}));

vi.mock('../../../../_utils/load-config/load-config.js', () => ({
    config: vi.fn(),
}));

describe('shouldOverwriteKey', () => {
    let shouldOverwriteKey: typeof import('./should-overwrite-key').shouldOverwriteKey;
    let prompts: any;
    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        ({ shouldOverwriteKey } = await import('./should-overwrite-key.js'));
        prompts = (await import('prompts')).default;
    });
    it.each([['yes'], ['no'], ['yes-to-all'], ['no-to-all']])(
        'returns %s according to the answer',
        async (resp) => {
            vi.spyOn(config, 'config').mockReturnValueOnce({
                cliLanguage: 'es',
            } as unknown as LemonTreeConfig);
            prompts.mockResolvedValue({ action: resp });
            const result = await shouldOverwriteKey('es', 'foo', 'bar');

            expect(result).toBe(resp);
            expect(prompts).toHaveBeenCalledWith({
                type: 'select',
                name: 'action',
                message: 'msg:es:foo:bar',
                choices: [
                    { title: cliMessages.es.yes, value: 'yes' },
                    { title: cliMessages.es.no, value: 'no' },
                    { title: cliMessages.es.yes_to_all, value: 'yes-to-all' },
                    { title: cliMessages.es.no_to_all, value: 'no-to-all' },
                ],
                initial: 0,
            });
        },
    );

    it('should use cliMessages.en if cliMessages[cliLang] is not defined', async () => {
        prompts.mockResolvedValue({ action: 'yes' });
        vi.spyOn(config, 'config').mockReturnValueOnce({
            cliLanguage: 'ru',
        } as unknown as LemonTreeConfig);
        const result = await shouldOverwriteKey('es', 'foo', 'bar');
        expect(result).toBe('yes');
        expect(prompts).toHaveBeenCalledWith({
            type: 'select',
            name: 'action',
            message: 'msg:es:foo:bar',
            choices: [
                { title: cliMessages.en.yes, value: 'yes' },
                { title: cliMessages.en.no, value: 'no' },
                { title: cliMessages.en.yes_to_all, value: 'yes-to-all' },
                { title: cliMessages.en.no_to_all, value: 'no-to-all' },
            ],
            initial: 0,
        });
    });

    it('should use en if cliLanguage is not defined', async () => {
        prompts.mockResolvedValue({ action: 'yes' });
        vi.spyOn(config, 'config').mockReturnValueOnce({
            cliLanguage: '',
        } as unknown as LemonTreeConfig);
        const result = await shouldOverwriteKey('es', 'foo', 'bar');
        expect(result).toBe('yes');
    });
});
