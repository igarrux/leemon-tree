import prompts from 'prompts';
import { PrintMessages } from '../../../../cli/_utils/index.js';
import { cliMessages } from '../../../_messages/messages.js';
import { config } from '../../../../_utils/load-config/load-config.js';

export const shouldOverwriteKey = async (
    lng: string,
    key: string,
    currentValue: string,
): Promise<'yes' | 'no' | 'yes-to-all' | 'no-to-all'> => {
    const cliLang = (config()?.cliLanguage || 'en') as keyof typeof cliMessages;
    const messages = cliMessages[cliLang] || cliMessages.en;
    const response = await prompts({
        type: 'select',
        name: 'action',
        message: PrintMessages.keyExists(lng, key, currentValue),
        choices: [
            { title: messages.yes, value: 'yes' },
            { title: messages.no, value: 'no' },
            { title: messages.yes_to_all, value: 'yes-to-all' },
            { title: messages.no_to_all, value: 'no-to-all' },
        ],
        initial: 0,
    });
    return response.action as 'yes' | 'no' | 'yes-to-all' | 'no-to-all';
};
