import prompts from 'prompts';
import { cli } from './cli/cli.js';

export function runIfDirect(metaUrl = import.meta.url, argv = process.argv) {
    const autoYes = process.env.LT_AUTO_YES === 'true';
    if (metaUrl === `file://${argv[1]}`) {
        if (argv.includes('--yes') || autoYes) prompts.override({ delete: true });
        if (autoYes) prompts.override({ action: 'yes-to-all' });
        cli();
    }
}

runIfDirect();
