/**
 * Returns the key quoted with double quotes if it is not a valid TypeScript identifier.
 * @param key - The key to check.
 * @returns The quoted or raw key.
 */
export function quotedKey(
    key: string,
    singleQuote: boolean = false,
    escape: boolean = true,
): string {
    return /^[$A-Z_][0-9A-Z_$]*$/i.test(key)
        ? key
        : `${singleQuote ? "'" : '"'}${key.replace(/\"/g, escape ? '\\"' : '"')}${singleQuote ? "'" : '"'}`;
}
