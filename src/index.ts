import prompts from 'prompts';
import { cli } from './cli/cli.js';

export function runIfDirect(metaUrl = import.meta.url, argv = process.argv) {
    if (metaUrl === `file://${argv[1]}`) {
        if (argv.includes('--yes')) prompts.override({ delete: true });
        cli();
    }
}

runIfDirect();
