import { initCommand } from './commands/init/init.js';

/**
 * Main CLI function.
 * It is the entry point of the CLI.
 * It is used to initialize the CLI and execute the commands.
 * @returns void
 */
export const cli = async () => {
    const [, , ...args] = process.argv;
    const [command, ...rest] = args;
    if (command === 'init') return initCommand();

    const { PrintMessages } = await import('./_utils/print_message/print_message.js');

    if (!args.length) return PrintMessages.welcome();
    const dryRun = rest.includes('--dry-run');

    // Linting command
    if (command === 'lint') {
        const { lintCommand } = await import('./commands/lint/lint.js');
        return lintCommand();
    }

    // Guided command
    if (command === '-g') {
        const { guidedCommand } = await import('./commands/guided/guided.js');
        return guidedCommand({ dryRun });
    }

    // Set and delete commands
    if (!['set', 'delete'].includes(command)) return PrintMessages.unknownCommand();

    const [key, text] = rest;
    if (!key) return PrintMessages.usage();
    if (command === 'set') {
        const { setCommand } = await import('./commands/set/set.js');
        return setCommand({ key, text, dryRun });
    }
    if (command === 'delete') {
        const { deleteCommand } = await import('./commands/delete/delete.js');
        return deleteCommand({ key, dryRun });
    }
};
