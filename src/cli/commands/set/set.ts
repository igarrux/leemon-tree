import { SetParams } from './types/set.params.js';
import { existsSync, mkdirSync } from 'fs';
import { config as getConfig } from '../../../_utils/index.js';
import { resolveLanguageConfig } from '../_helpers/resolve-language-config/resolve-language-config.js';
import { getTranslationProvider } from '../_utils/index.js';
import { handleFileCasingConflict } from '../_helpers/handle-file-casing-conflict/handle-file-casing-conflict.js';
import { handleTranslationOverwrite } from '../_helpers/handle-translation-overwrite/handle-translation-overwrite.js';
import { ProtectedTextManager } from '../../../_utils/protected-text-manager/protected-text-manager.js';
import { handleTranslate } from '../_helpers/handle-translate/handle-translate.js';
import { PrintMessages } from '../../_utils/index.js';
import { TypeDefinition } from '../_utils/type-definition/type-definition.js';
import { runPostScripts } from '../_helpers/run-post-scripts/run-post-scripts.js';

/**
 * Set a translation for a key
 * @param param0 - The parameters for the set command
 * @returns void
 * @example
 * ```bash
 * ltr set key "Hello, world!"
 * ```
 * also you can use the key as the text
 * ```bash
 * ltr set "Hello, world!"
 * ```
 * also you can use the --dry-run flag to see what will be updated without actually updating the files
 * ```bash
 * ltr set "Hello, world!" --dry-run
 * ```
 */
export const setCommand = async ({ key, text, dryRun }: SetParams) => {
    const config = getConfig();
    const languages = config?.languages || [];
    const translator = await getTranslationProvider();
    const updatedFiles = new Map<string, { lang: string; translation: string }>();
    const handleOverwrite = handleTranslationOverwrite();
    const promisesPool = new Set<Promise<void>>();
    PrintMessages.clearTerminal();

    let overwrite: 'overwrite' | 'overwriteAll' | 'skip' | 'skipAll' | 'none' = 'none';
    for (const lang of languages) {
        const { filePath, dir, protectionPattern } = resolveLanguageConfig(config, lang);
        const protectedText = new ProtectedTextManager(text || key, protectionPattern);
        // Create dir if it doesn't exist
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

        // Handle file casing conflict
        const baseName = filePath.split('/').pop() || '';
        handleFileCasingConflict(dir, baseName);

        // Handle overwriting
        overwrite = await handleOverwrite({ key, text, filePath, lang });
        if (overwrite.includes('skip')) continue;

        const options = { translator, lang, dryRun, updatedFiles, key, filePath };
        promisesPool.add(handleTranslate({ protectedText, ...options }));
    }

    try {
        await Promise.all(promisesPool);

        for (const lang of languages) {
            await TypeDefinition.addType(key, lang);
        }
        if (overwrite === 'overwriteAll') PrintMessages.overwriteAll();
        if (overwrite === 'skipAll') PrintMessages.skipAll();

        PrintMessages.usage();
        PrintMessages.welcome();
        PrintMessages.howToExit();
        if (dryRun) PrintMessages.dryRunResult(Array.from(updatedFiles.keys()));
        else {
            PrintMessages.translationAdded(key || text || '');
            runPostScripts(`'${JSON.stringify([...updatedFiles.values()])}'`, 'set');
        }
    } catch (error) {
        console.error(error);
    }
};

