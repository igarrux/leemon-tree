import { config, version } from '../../../_utils/index.js';
import { cliMessages as _cliMessages } from '../../_messages/messages.js';

export class PrintMessages {
    static get lang() {
        return (config()?.cliLanguage || 'en') as keyof typeof _cliMessages;
    }
    static get cliMessages() {
        return _cliMessages?.[this.lang] || _cliMessages.en;
    }
    static welcome() {
        const welcome = this.cliMessages.welcome;
        const versionText = this.cliMessages.version;
        console.log(`\x1b[93m\n${welcome} ${versionText}: ${version}\x1b[0m\n`);
    }

    static unknownCommand() {
        const unknownCommand = this.cliMessages.unknown_command;
        console.log(`\x1b[91m${unknownCommand}\x1b[0m`);
        console.log(this.cliMessages.usage);
    }

    static usage() {
        console.log(this.cliMessages.usage);
    }
    static casingConflict(dir: string, similar: string, baseName: string) {
        const message = this.cliMessages.casing_conflict
            .replace('{{dir}}', dir)
            .replace('{{similar}}', similar)
            .replace('{{baseName}}', baseName);
        console.warn(`\x1b[33m${message}\x1b[0m`);
    }
    static renamedFile(oldPath: string, newPath: string) {
        const message = this.cliMessages.renamed_file
            .replace('{{oldPath}}', oldPath)
            .replace('{{newPath}}', newPath);
        console.warn(`\x1b[33m${message}\x1b[0m`);
    }

    static keyExists(lng: string, key: string, currentValue: string) {
        const message = this.cliMessages.key_exists_in_lng
            .replace('{{lng}}', `\x1b[34m\x1b[107m 🌐 ${lng}  \x1b[33m\x1b[49m`)
            .replace('{{key}}', `\x1b[32m'${key}'\x1b[33m`)
            .replace('{{currentValue}}', `\x1b[32m'${currentValue}'\x1b[33m`);
        return `\x1b[33m${message}\x1b[0m`;
    }

    static failedToTranslate(
        key: string,
        sourceLanguage: string,
        targetLanguage: string,
        error: string,
    ) {
        const message = this.cliMessages.failed_to_translate
            .replace('{{key}}', `\x1b[32m'${key}'\x1b[33m`)
            .replace('{{sourceLanguage}}', `\x1b[32m'${sourceLanguage}'\x1b[33m`)
            .replace('{{lang}}', `\x1b[32m'${targetLanguage}'\x1b[33m`)
            .replace('{{error}}', `\x1b[32m'${error}'\x1b[33m`);
        console.warn(`\x1b[33m${message}\x1b[0m`);
    }

    static skippedKey(key: string, lang: string) {
        const message = this.cliMessages.skipped_key
            .replace('{{key}}', `\x1b[32m'${key}'\x1b[33m`)
            .replace('{{lang}}', `\x1b[32m'${lang}'\x1b[33m`);
        console.warn(`\x1b[33m${message}\x1b[0m`);
    }

    static clearTerminal() {
        process.stdout.write('\x1Bc');
    }
    static editing() {
        console.warn(`\x1b[34m${this.cliMessages.editing}\x1b[0m`);
    }
    static emptyText() {
        console.warn(`\x1b[33m${this.cliMessages.empty_text}\x1b[0m`);
    }
    static emptyKey() {
        console.warn(`\x1b[33m${this.cliMessages.empty_key}\x1b[0m`);
    }

    static overwriteAll() {
        console.warn(`\x1b[33m${this.cliMessages.overwrite_all}\x1b[0m`);
    }

    static skipAll() {
        console.warn(`\x1b[33m${this.cliMessages.skip_all}\x1b[0m`);
    }

    static translationAdded(key: string) {
        console.log(
            `\x1b[46m${this.cliMessages.translation_added.replace('{{key}}', `\x1b[0m \x1b[36m${key}\x1b[0m`)}
            `,
        );
    }

    static howToExit() {
        console.log(`\x1b[0m${this.cliMessages.how_to_exit}\x1b[0m`);
    }

    static dryRunResult(updatedFiles: string[] | Set<string> | string) {
        const files = Array.isArray(updatedFiles) ? updatedFiles : Array.from(updatedFiles);
        console.log(
            `\x1b[33m${this.cliMessages.dry_run_result.replace('{{updatedFiles}}', `\x1b[0m \x1b[36m${files.join(', ')}\x1b[0m`)}\x1b[0m`,
        );
    }

    static translationDeleted(key: string) {
        console.log(
            `\x1b[31m${this.cliMessages.translation_deleted.replace('{{key}}', `\x1b[0m\x1b[36m${key}\x1b[31m`)}\x1b[0m`,
        );
    }

    static lintKey(key: string) {
        console.log(
            `${this.cliMessages.lint_key.replace('{{key}}', `\x1b[0m\x1b[36m${key}\x1b[33m`)}`,
        );
    }

    static lintPresent(present: string[]) {
        console.log(
            `\x1b[32m${this.cliMessages.lint_present.replace('{{present}}', `\x1b[0m\x1b[36m${present.join(', ')}\x1b[33m`)}\x1b[0m`,
        );
    }

    static lintMissing(missing: string[]) {
        console.log(
            `\x1b[31m${this.cliMessages.lint_missing.replace('{{missing}}', `\x1b[0m\x1b[36m${missing.join(', ')}\x1b[33m`)}\x1b[0m\n`,
        );
    }

    static lintEdit() {
        console.log(`\x1b[33m${this.cliMessages.lint_edit}\x1b[0m`);
    }

    static lintDelete() {
        console.log(`\x1b[33m${this.cliMessages.lint_delete}\x1b[0m`);
    }

    static lintSummary({
        correctKeys,
        keysWithProblems,
        filesWithProblems,
        totalFiles,
        totalKeys,
    }: {
        correctKeys: number;
        keysWithProblems: number;
        filesWithProblems: number;
        totalFiles: number;
        totalKeys: number;
    }) {
        const message = this.cliMessages.lint_summary
            .replace('{{correctKeys}}', `\x1b[0m\x1b[36m${correctKeys}\x1b[0m`)
            .replace('{{keysWithProblems}}', `\x1b[0m\x1b[36m${keysWithProblems}\x1b[0m`)
            .replace('{{filesWithProblems}}', `\x1b[0m\x1b[36m${filesWithProblems}\x1b[0m`)
            .replace('{{totalFiles}}', `\x1b[0m\x1b[36m${totalFiles}\x1b[0m`)
            .replace('{{totalKeys}}', `\x1b[0m\x1b[36m${totalKeys}\x1b[0m`);
        console.log(message);
    }
}
