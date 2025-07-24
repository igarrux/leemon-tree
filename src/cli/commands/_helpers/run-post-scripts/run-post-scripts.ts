import { config } from '../../../../_utils';
import { execSync } from 'child_process';

/**
 * Runs post scripts defined in the config, replacing {{result}} and {{action}}.
 * @param result - The result to inject in the script.
 * @param action - The action to inject in the script.
 */
export function runPostScripts(result: string, action: string): void {
    const scripts: string[] = config()?.postScript || [];
    for (const script of scripts) {
        const cmd = script.replace(/{{result}}/g, result).replace(/{{action}}/g, action);
        execSync(cmd, { stdio: 'inherit' });
    }
}
