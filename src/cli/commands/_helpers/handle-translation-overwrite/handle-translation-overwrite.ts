import { HandleTranslationOverwriteParams } from './types/handle-translation-overwrite.params.js';
import { shouldOverwriteKey } from '../should-overwrite-key/should-overwrite-key.js';
import { loadTranslations } from '../../_utils/load-translations/laod-translations.js';
import { PrintMessages } from '../../../_utils/index.js';
import { flatten } from 'flat';

/**
 * Handles the translation overwrite for a given key, text, file path, and language.
 * @returns A function that returns a string indicating whether to skip or skip all.
 */
export const handleTranslationOverwrite = (): ((
    opts: HandleTranslationOverwriteParams,
) => Promise<'overwrite' | 'overwriteAll' | 'skip' | 'skipAll' | 'none'>) => {
    let overwrite = '';

    return async ({ key, text, filePath, lang }: HandleTranslationOverwriteParams) => {
        const translations = flatten(loadTranslations(filePath)) as Record<string, string>;
        const exists = Object.prototype.hasOwnProperty.call(translations, key);
        if (exists) {
            const current = translations[key];
            if (!overwrite?.includes?.('all')) {
                overwrite = await shouldOverwriteKey(lang, key, current);
            }
            if (overwrite === 'yes') {
                translations[key] = text;
                return 'overwrite';
            }
            if (overwrite === 'yes-to-all') {
                translations[key] = text;
                return 'overwriteAll';
            }
            if (overwrite === 'no') {
                PrintMessages.skippedKey(key, lang);
                return 'skip';
            }
            if (overwrite === 'no-to-all') return 'skipAll';
            if (!overwrite) return 'skip';
        }
        return 'none';
    };
};
