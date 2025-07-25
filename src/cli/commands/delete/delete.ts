import { writeFileSync } from 'node:fs';
import { config as getConfig } from '../../../_utils/index.js';
import { resolveLanguageConfig } from '../_helpers/index.js';
import { loadTranslations } from '../_utils/load-translations/laod-translations.js';
import { PrintMessages } from '../../_utils/index.js';
import prompt from 'prompts';
import { cliMessages } from '../../_messages/messages.js';
import { TypeDefinition } from '../_utils/type-definition/type-definition.js';
import { removeEmptyObjects } from '../_utils/remove-empty-objects/remove-empty-objects.js';
import { runPostScripts } from '../_helpers/run-post-scripts/run-post-scripts.js';
/**
 * Delete a translation from all languages
 * @param param0 - The key to delete and whether to run in dry run mode
 * @returns void
 */
export const deleteCommand = async ({ key, dryRun }: { key: string; dryRun: boolean }) => {
    const config = getConfig();
    const messages = cliMessages[config.cliLanguage as keyof typeof cliMessages] || cliMessages.en;
    const langs = config?.languages || [];
    // confirm if the user wants to delete the tra  nslation
    const answer = await prompt({
        type: 'confirm',
        name: 'delete',
        message: messages.delete_translation,
    });

    if (!answer?.delete) return;
    let updatedFiles: string[] = [];
    let someIsNotFound = false;
    for (const lng of langs) {
        const { filePath } = resolveLanguageConfig(config, lng);
        let translations = loadTranslations(filePath) as Record<string, string>;

        if (Object.prototype.hasOwnProperty.call(translations, key)) {
            delete translations[key];
            translations = removeEmptyObjects(translations) as Record<string, string>;
            updatedFiles.push(filePath);
            if (!dryRun) {
                writeFileSync(filePath, JSON.stringify(translations, null, 2), 'utf-8');
                TypeDefinition.removeType(key, lng);
            }
        } else {
            someIsNotFound = true;
        }
    }
    runPostScripts(`'{"key": "${key}"}'`, 'delete');
    if (dryRun) PrintMessages.dryRunResult(updatedFiles);
    if (someIsNotFound) PrintMessages.translationNotFound(key);
    PrintMessages.translationDeleted(key);
};
