import { existsSync, readFileSync } from 'fs';

/**
 * Loads the translations from a file.
 * @param filePath - The path to the translations file.
 * @returns The translations.
 */
export const loadTranslations = (filePath: string): Record<string, string> => {
    if (existsSync(filePath)) {
        try {
            return JSON.parse(readFileSync(filePath, 'utf-8') || '{}');
        } catch (err) {
            console.error(`Failed to parse translations file: ${filePath}`);
            return {};
        }
    }
    return {};
};
