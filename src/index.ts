import { cli } from './cli/cli.js';
import { runPreScripts } from './cli/commands/_helpers/run-pre-scripts/run-pre-scripts.js';

export function runIfDirect(metaUrl = import.meta.url, argv = process.argv) {
  if (metaUrl === `file://${argv[1]}`) {
    runPreScripts();
    cli();
  }
}

runIfDirect();
