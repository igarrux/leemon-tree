/**
 * Finds the dominant separator (;, ,, or \n) in a type/interface body.
 * @param body - The string body to analyze.
 * @returns The dominant separator.
 */
export function findDominantSeparator(body: string): ';' | ',' | '\n' {
    const counts = {
        ';': (body.match(/;/g) || []).length,
        ',': (body.match(/,/g) || []).length,
        '\n': (body.match(/\n/g) || []).length,
    };
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as ';' | ',' | '\n';
}
