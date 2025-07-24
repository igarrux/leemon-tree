import { ProviderOptions } from '../_types/provider-options.type.js';
import { PROVIDER_URLS } from './../../configs/provider-urls.config.js';

/**
 * Translates text using the Google Translate API
 * @param options - The options for the translation
 * @returns The translated text
 */
export const googleTranslate = async (options: ProviderOptions) => {
    const { apiKey, from: source, text: q, to: target, dryRun } = options;
    const url = PROVIDER_URLS.google;
    if (dryRun) return `[DRY-RUN][GOOGLE:${source}->${target}] ${q}`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
            },
            body: JSON.stringify({ q, source, target, format: 'text' }),
        });
        if (!res.ok) {
            throw new Error(`Google Translate API error: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const translated = data?.data?.translations?.[0]?.translatedText ?? '';
        if (!translated) throw new Error('No translation found');
        return translated;
    } catch (error) {
        throw new Error(`Google Translate API error: ${error}`);
    }
};
