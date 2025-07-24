import * as fs from 'fs';
import { join } from 'path';
import { PrintMessages } from '../../../../cli/_utils/index.js';

/**
 * Handles file casing conflicts by renaming the file with the correct casing.
 * If there are more than one file with the same name but different casing, it will print a warning.
 * @param dir - The directory to check for casing conflicts.
 * @param baseName - The base name of the file to check for casing conflicts.
 */
export const handleFileCasingConflict = (dir: string, baseName: string): void => {
    if (!fs.existsSync(dir)) return;
    const filesInDir = fs.readdirSync(dir);
    const similar = filesInDir.filter(
        (f: string) => f.toLowerCase() === baseName.toLowerCase() && f !== baseName,
    );
    if (similar.length) {
        const oldPath = join(dir, similar[0]);
        const newPath = join(dir, baseName);
        if (fs.existsSync(oldPath)) {
            fs.renameSync(oldPath, newPath);
            PrintMessages.renamedFile(oldPath, newPath);
        }
    }
    if (similar.length > 1) PrintMessages.casingConflict(dir, similar.join(', '), baseName);
};
