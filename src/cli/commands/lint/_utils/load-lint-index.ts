import { config } from '../../../../_utils/index.js';
import { resolveLanguageConfig } from '../../_helpers/index.js';
import { loadTranslations } from '../../_utils/load-translations/laod-translations.js';

/**
 * Loads all translations and builds an index of key presence per language.
 * @returns Object with translationsByLang, keyPresence, and languages
 */
export const loadLintIndex = (): {
    keyPresence: Record<string, Set<string>>;
    languages: string[];
} => {
    const cfg = config();
    const languages: string[] = cfg?.languages || [];
    const keyPresence: Record<string, Set<string>> = {};
    for (const lng of languages) {
        const { filePath } = resolveLanguageConfig(cfg, lng);
        const translations = loadTranslations(filePath);

        // Build index of key presence per language
        for (const key of Object.keys(translations)) {
            if (!keyPresence[key]) keyPresence[key] = new Set();
            keyPresence[key].add(lng);
        }
    }
    return { keyPresence, languages };
};
