import { readFileSync } from "node:fs";
import { dirname } from "node:path";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Get the version of the package
 * @returns The version of the package
 */
export const getPkgVersion = (): string => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(readFileSync(join(__dirname, '../../../package.json'), 'utf-8'));
    return pkg.version;
};

export const version = getPkgVersion();