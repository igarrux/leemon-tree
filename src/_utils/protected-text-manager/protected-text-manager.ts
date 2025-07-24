/**
 * Manages protected text segments that should not be altered during processing.
 *
 * Segments are defined using a pattern that must include the literal word `key`
 * (e.g., `__key__`, `{{key}}`, `--key--`, etc). This pattern determines how protected parts are identified.
 *
 * When protecting the text, all matches of the pattern are replaced with a unique ID in the form `{number{content}}`,
 * where `number` is an incrementing identifier and `content` is the original matched value.
 * Later, the original values can be restored using `restoreProtectedTexts(text)`.
 *
 * @example
 * //In this example, you are using a translation tool to translate the text
 * const text = 'An example text with a protected segment {{name}}'
 * const manager = new ProtectedTextManager(text, '{{key}}') // {{key}} is the delimiter pattern
 * const translatedText = yourTextProsessor(manager.protectedText, 'es') //'Un texto de ejemplo con un segmento protegido {0{nombre}}'
 * // In this example, the api changes the text `{0{name}}` to `{0{nombre}}`. now you can restore the original text
 * const restoredText = manager.restoreProtectedTexts(translatedText) //'An example text with a protected segment {{name}}'
 */
export class ProtectedTextManager {
    private readonly protectedMap = new Map<string, string>();
    private readonly protectedRegex = /\{(\d+)\{([\s\S]*?)\}\}/gmu;
    private readonly protectedContentRegex: RegExp;
    public readonly protectedText: string;
    private nextId = 0;

    /**
     * @param text The text to protect
     * @param protectedPattern The pattern to use to identify the protected segments. It must include the literal word `key`
     */
    constructor(
        private readonly text: string = '',
        private readonly protectedPattern: `${string}key${string}` = '{{key}}',
    ) {
        if (!this.protectedPattern.includes('key')) {
            console.error('The protected pattern must include the literal word `key`');
            process.exit(1);
        }
        const escapedPattern = this.escapeRegExp(this.protectedPattern).replace(
            'key',
            '([\\s\\S]*?)',
        );
        this.protectedContentRegex = new RegExp(escapedPattern, 'gmu');
        this.protectedText = this.extractProtectedSegments();
    }

    /**
     * Extracts and replaces protected segments of the text with temporary markers.
     * @returns The text with the protected segments replaced.
     */
    private extractProtectedSegments(): string {
        return this.text.replace(this.protectedContentRegex, (_match, inner) => {
            const id = (this.nextId++).toString();
            this.protectedMap.set(id, _match); // guarda el original
            return `{${id}{${inner}}}`;
        });
    }

    /**
     * Restores the original text, replacing the temporary markers with the protected segments.
     * @param modifiedText The text modified with the protected segments
     * @returns The modified text with the protected segments restored
     */
    public restoreProtectedTexts(modifiedText: string): string {
        return modifiedText.replace(this.protectedRegex, (_full, id) => {
            const original = this.protectedMap.get(id);
            if (original == null) throw new Error(`Protected ID ${id} ${_full} not found`);
            return original;
        });
    }

    /**
     * Escapes a string to be used as part of a regular expression.
     * @param string The string to escape.
     * @returns The escaped string.
     */
    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
