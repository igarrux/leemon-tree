import { PrintMessages } from '../../_utils/index.js';
import { loadLintIndex } from './_utils/load-lint-index.js';

/**
 * Lint translations: check the missing and orphan keys.
 */
export const lintCommand = async () => {
    console.log();
    // Load all translations and build index of presence
    const { keyPresence, languages } = loadLintIndex();
    const keys = Object.keys(keyPresence);
    let filesWithProblems: string[] = [];
    let keysWithProblems = 0;
    // Determine presence/missing/orphans
    for (const key of keys) {
        const present = Array.from(keyPresence[key]).sort();
        const missing = languages.filter((lng) => !keyPresence[key].has(lng)).sort();
        filesWithProblems.push(...missing);
        if (missing.length === 0) continue;

        keysWithProblems += 1;
        PrintMessages.lintKey(key);
        PrintMessages.lintPresent(present);
        PrintMessages.lintMissing(missing);
    }
    if (keysWithProblems > 0) {
        PrintMessages.lintEdit();
        PrintMessages.lintDelete();
    }
    PrintMessages.lintSummary({
        correctKeys: keys.length - keysWithProblems,
        keysWithProblems,
        filesWithProblems: new Set(filesWithProblems).size,
        totalFiles: languages.length,
        totalKeys: keys.length,
    });
    if (keysWithProblems > 0) process.exit(1);
};
