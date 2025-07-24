import { execSync } from 'child_process';
import { config } from '../../../../_utils/index.js';

/**
 * Runs pre scripts defined in the config.
 */
export function runPreScripts(): void {
    const scripts: string[] = config()?.preScript || [];
    for (const script of scripts) {
        execSync(script, { stdio: 'inherit' });
    }
}
