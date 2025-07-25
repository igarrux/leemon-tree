import { ProviderOptions } from '../_types/provider-options.type.js';
import { PROVIDER_URLS } from './../../configs/provider-urls.config.js';
import { buildURL } from '../_utils/index.js';

/**
 * Translates text using the Microsoft Translator API
 * @param options - The options for the translation
 * @returns The translated text
 */
export const microsoftTranslate = async (options: ProviderOptions) => {
    const { apiKey, from, text, to, dryRun } = options;
    const url = buildURL(PROVIDER_URLS.microsoft, { from, to });
    if (dryRun) return `[DRY-RUN][MICROSOFT:${from}->${to}] ${text}`;
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{ Text: text }]),
        });
        if (!res.ok) {
            throw new Error(
                `Microsoft Translator API error: ${res.status} ${res.statusText} ${await res.text()}`,
            );
        }
        const data = await res.json();
        const translated = data?.[0]?.translations?.[0]?.text ?? '';
        if (!translated) throw new Error('No translation found');
        return translated;
    } catch (error) {
        if (error instanceof Error && error.message.includes('Microsoft Translator API error')) {
            console.error(error.message);
        }
        console.error('Microsoft Translator API error:', error);
        process.exit(5);
    }
};
