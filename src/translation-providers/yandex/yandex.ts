import { ProviderOptions } from '../_types/provider-options.type.js';
import { PROVIDER_URLS } from '../../configs/provider-urls.config.js';

/**
 * Translates text using the Yandex Translate API
 * @param options - The options for the translation
 * @returns The translated text
 */
export const yandexTranslate = async (options: ProviderOptions) => {
    const { apiKey, from, text, to, dryRun } = options;
    const url = PROVIDER_URLS.yandex;
    if (dryRun) return `[DRY-RUN][YANDEX:${from}->${to}] ${text}`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Api-Key ${apiKey}`,
            },
            body: JSON.stringify({ texts: text, sourceLanguageCode: from, targetLanguageCode: to }),
        });
        if (!res.ok) {
            throw new Error(
                `Yandex Translate API error: ${res.status} ${res.statusText} ${await res.text()}`,
            );
        }
        const data = await res.json();
        const translated = data?.translations?.[0]?.text ?? '';
        if (!translated) throw new Error('No translation found');
        return translated;
    } catch (error) {
        if (error instanceof Error && error.message.includes('Yandex Translate API error')) {
            console.error(error.message);
        }
        console.error('Yandex Translate API error:', error);
        process.exit(5);
    }
};
