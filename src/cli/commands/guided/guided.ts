import { GuidedPrompts } from './_helpers/guided_prompts/guided_prompts.js';
import { PrintMessages } from '../../_utils/index.js';
import { setCommand } from '../set/set.js';

/**
 * Guided command
 * It is used to guide the user through the process of adding a translation
 * @param param0 - The parameters for the guided command
 * @returns void
 * @example
 * ```bash
 * ltr -g
 * ```
 */
export const guidedCommand = async ({ dryRun }: { dryRun?: boolean } = {}) => {
    GuidedPrompts.clearTerminal();
    PrintMessages.welcome();
    const isTextAsKey = await GuidedPrompts.useTextAsKey();
    let running = true;

    while (running) {
        const { key, text, isExit } = await GuidedPrompts.getTextAndKey(isTextAsKey);

        if (isExit) {
            running = false;
            break;
        }

        let translation = [text, key];
        let action = '';
        while (!action) {
            const act = await GuidedPrompts.translationAdded(key);
            if (act === 'finished') {
                running = false;
                break;
            }

            if (act === 'edit') {
                const { newText, newKey } = await GuidedPrompts.editTextAndKey(
                    text,
                    key,
                    isTextAsKey,
                );
                translation = [newText, newKey];
            }

            if (act === 'delete') {
                translation = [];
                PrintMessages.noAddTranslation(key);
                break;
            }

            if (act === 'continue') {
                const [text, key] = translation;
                await setCommand({
                    key,
                    text,
                    dryRun: !!dryRun,
                });
                break;
            }
        }
    }
};
