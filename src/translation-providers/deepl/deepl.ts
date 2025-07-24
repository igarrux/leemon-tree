import { ProviderOptions } from '../_types/provider-options.type.js';
import { PROVIDER_URLS } from './../../configs/provider-urls.config.js';

interface DeeplOptions extends ProviderOptions {
    free?: boolean;
}

/**
 * Translates text using the Deepl API
 * @param options - The options for the translation
 * @returns The translated text
 */
export const deeplTranslate = async (options: DeeplOptions) => {
    const { apiKey, from, text, to, dryRun, free = false } = options;
    if (dryRun) return `[DRY-RUN][DEEPL:${from}->${to}] ${text}`;
    const url = free ? PROVIDER_URLS.deepl : PROVIDER_URLS.deeplPro;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `DeepL-Auth-Key ${apiKey}`,
            },
            body: JSON.stringify({ text: [text], source_lang: from, target_lang: to }),
        });
        if (!res.ok) {
            throw new Error(
                `Deepl Translate API error: ${res.status} ${res.statusText} ${await res.text()}`,
            );
        }
        const data = await res.json();
        const translated = data?.translations?.[0]?.text ?? '';
        if (!translated) throw new Error('No translation found');
        return translated;
    } catch (error) {
        throw new Error(`Deepl Translate API error: ${error}`);
    }
};
