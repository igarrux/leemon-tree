
import { writeFileSync } from "fs";

export const writeTranslations = (filePath: string, translations: Record<string, string>): void => {
    try {
        writeFileSync(filePath, JSON.stringify(translations, null, 4), 'utf-8');
    } catch (err) {
        throw new Error(`Failed to write file: ${filePath}`);
    }
}