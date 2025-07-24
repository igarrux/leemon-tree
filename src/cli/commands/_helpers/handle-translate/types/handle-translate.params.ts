import { ProtectedTextManager } from '../../../../../_utils/protected-text-manager/protected-text-manager';
import { TranslatorProviderFn } from '../../../../../translation-providers/_types/translator-provider-fn.type';

export interface HandleTranslateParams {
    protectedText: ProtectedTextManager;
    translator: TranslatorProviderFn;
    lang: string;
    dryRun: boolean;
    updatedFiles: Map<string, {lang: string, translation: string}>;
    key: string;
    filePath: string;
}
