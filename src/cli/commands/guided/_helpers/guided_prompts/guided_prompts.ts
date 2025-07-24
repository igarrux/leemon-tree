import prompts, { PromptObject } from 'prompts';
import { config } from '../../../../../_utils/index.js';
import { cliMessages } from '../../../../_messages/messages.js';
import { PrintMessages } from '../../../../_utils/index.js';

export class GuidedPrompts {
    static lang = (config()?.cliLanguage || 'en') as keyof typeof cliMessages;
    static messages = cliMessages?.[this.lang] || cliMessages.en;
    static yes = this.messages.yes;
    static no = this.messages.no;
    static yesToAll = this.messages.yes_to_all;
    static noToAll = this.messages.no_to_all;

    static async useTextAsKey() {
        const message = this.messages.use_text_as_key;
        const { useTextAsKey } = await prompts({
            type: 'toggle',
            name: 'useTextAsKey',
            message,
            initial: true,
            active: this.yes,
            inactive: this.no,
        });
        return useTextAsKey as boolean;
    }

    static async enterTextToTranslate() {
        const message = this.messages.enter_text_to_translate;

        const { input } = await prompts({
            type: 'text',
            name: 'input',
            message,
        });
        return input?.trim?.() as string;
    }

    static async enterKeyForTranslation() {
        const message = this.messages.enter_key_for_translation;
        const { input } = await prompts<string>({
            type: 'text',
            name: 'input',
            message,
        });
        return input?.trim?.() as string;
    }

    static async translationAdded() {
        const message = this.messages.translation_added;
        const edit = this.messages.edit;
        const _delete = this.messages.delete;
        const _continue = this.messages.continue;
        const iAlreadyFinished = this.messages.finished;

        const { act } = await prompts({
            type: 'select',
            name: 'act',
            message,
            choices: [
                { title: _continue, value: 'continue' },
                { title: edit, value: 'edit' },
                { title: _delete, value: 'delete' },
                { title: iAlreadyFinished, value: 'finished' },
            ],
        });
        return act as 'continue' | 'edit' | 'delete' | 'finished';
    }

    static async editTextAndKey(
        text: string,
        key: string,
        useTextAsKey: boolean,
    ): Promise<{ newKey: string; newText: string; isExit: boolean }> {
        PrintMessages.editing();
        let isExit = false;

        const textAsKeyConfig = [{ ...this.inputTextOptions, initial: text }];
        const keyAndTextConfig = [
            { ...this.inputKeyOptions, initial: key },
            { ...this.inputTextOptions, initial: text },
        ];
        const promptConfig = useTextAsKey ? textAsKeyConfig : keyAndTextConfig;
        const { key: newKey, text: newText } = await prompts(promptConfig, {
            onCancel: () => {
                isExit = true;
            },
        });
        return { newKey: newKey || newText, newText: newText || text, isExit };
    }

    static async deleteTranslation() {
        const message = this.messages.delete_translation;
        const { confirm } = await prompts({
            type: 'toggle',
            name: 'confirm',
            message,
            initial: false,
            active: this.yes,
            inactive: this.no,
        });
        return confirm as boolean;
    }

    static async getTextAndKey(
        useTextAsKey: boolean,
    ): Promise<{ key: string; text: string; isExit: boolean }> {
        const textAsKeyConfig = [this.inputTextOptions];
        const keyAndTextConfig = [this.inputKeyOptions, this.inputTextOptions];
        const promptConfig = useTextAsKey ? textAsKeyConfig : keyAndTextConfig;

        let isExit = false;
        const { key, text } = await prompts(promptConfig, {
            onCancel: () => {
                isExit = true;
            },
        });
        return { key: key || text, text, isExit };
    }

    static clearTerminal() {
        process.stdout.write('\x1Bc');
    }

    private static inputKeyOptions: PromptObject<'key'> = {
        type: 'text',
        name: 'key',
        message: this.messages.enter_key_for_translation,
        validate: (value) => (value?.trim() ? true : this.messages.empty_key),
    };

    private static inputTextOptions: PromptObject<'text'> = {
        type: 'text',
        name: 'text',
        message: this.messages.enter_text_to_translate,
        validate: (value) => (value?.trim() ? true : this.messages.empty_text),
    };
}
