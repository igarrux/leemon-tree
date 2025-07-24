import path from 'path';
import { TranslationProvider } from '../../../../_types/translation-provider.type';
import { config } from '../../../../_utils/index.js';
import { TranslatorProviderFn } from '../../../../translation-providers/_types/translator-provider-fn.type.js';

export const getTranslationProvider = async (): Promise<TranslatorProviderFn> => {
    const providerConfig = config()?.api;
    const provider = providerConfig?.provider;
    if (!providerConfig) throw new Error('Provider config is not defined');
    if (!provider) throw new Error('Provider is not defined');

    if (provider === 'plugin') {
        const pluginPath = path.join(process.cwd(), providerConfig?.plugin as string);
        return (await import(pluginPath)).default;
    }

    if (provider === 'google') {
        return (await import('../../../../translation-providers/google/google.js')).googleTranslate;
    }

    if (provider === 'microsoft') {
        return (await import('../../../../translation-providers/microsoft/microsoft.js'))
            .microsoftTranslate;
    }

    if (provider === 'deepl-free' || provider === 'deepl-pro') {
        return (await import('../../../../translation-providers/deepl/deepl.js')).deeplTranslate;
    }

    if (provider === 'yandex') {
        return (await import('../../../../translation-providers/yandex/yandex.js')).yandexTranslate;
    }

    throw new Error(`Unsupported provider: ${provider}`);
};
