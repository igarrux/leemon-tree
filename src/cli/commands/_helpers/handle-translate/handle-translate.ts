import { config as getConfig } from '../../../../_utils/index.js';
import { writeTranslations } from '../write-translation/write-translation.js';
import { loadTranslations } from '../../_utils/load-translations/laod-translations.js';
import { PrintMessages } from '../../../_utils/index.js';
import { HandleTranslateParams } from './types/handle-translate.params.js';

export const handleTranslate = async ({
    protectedText,
    translator,
    lang,
    dryRun,
    updatedFiles,
    key,
    filePath,
}: HandleTranslateParams) => {
    const { sourceLanguage, api } = getConfig();
    const translations = loadTranslations(filePath);

    // If the language is the source language, we don't need to translate it
    if (lang === sourceLanguage) {
        const translation = protectedText.restoreProtectedTexts(protectedText.protectedText);
        translations[key] = translation;
        updatedFiles.set(filePath, { lang, translation });
        if (!dryRun) writeTranslations(filePath, translations);
        return;
    }

    // If the language is not the source language, we need to translate it
    try {
        const rawTranslation = await translator({
            text: protectedText.protectedText,
            from: sourceLanguage,
            to: lang,
            apiKey: api?.key,
            free: api.provider === 'deepl-free',
        });
        const translation = protectedText.restoreProtectedTexts(rawTranslation);
        translations[key] = translation;
        updatedFiles.set(filePath, { lang, translation });
        if (!dryRun) writeTranslations(filePath, translations);
    } catch (error) {
        PrintMessages.failedToTranslate(key, sourceLanguage, lang, (error as Error).message);
    }
};
