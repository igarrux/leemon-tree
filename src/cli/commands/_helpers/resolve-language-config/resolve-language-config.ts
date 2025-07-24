import { dirname, join } from 'path';
import transformPattern from '../../_utils/patterns-transformer/patterns-transformer.js';
import { LemonTreeConfig } from '../../../../_utils/load-config/types/lemon-tree-config.type.js';
import { LemonTreeTranslationConfig } from '../../../../_utils/index.js';

/**
 * Resolves the language configuration for a given language.
 * @param config - The configuration object.
 * @param lng - The language to resolve the configuration for.
 * @returns The resolved language configuration.
 */
export const resolveLanguageConfig = (config: LemonTreeConfig, lng: string) => {
    const langConfig = (config?.translations?.find(
        (t: LemonTreeTranslationConfig) => t.lang === lng,
    ) || {}) as LemonTreeTranslationConfig;

    const filePattern = langConfig.filePattern || config?.default?.filePattern;
    const protectionPattern = (langConfig.protectionPattern ||
        config?.default?.protectionPattern) as `${string}key${string}`;
    const typeDefinition = langConfig.typeDefinition || config?.default?.typeDefinition;
    const vars = {
        lang: lng,
        provider: config?.api?.provider,
        sourceLanguage: config?.sourceLanguage,
    };
    let definitionFile;
    if (typeDefinition?.file) {
        definitionFile = join(process.cwd(), transformPattern(typeDefinition.file, vars));
    }
    const filePath = join(process.cwd(), transformPattern(filePattern, vars));
    const dir = dirname(filePath);
    return {
        filePath,
        dir,
        filePattern,
        protectionPattern,
        langConfig,
        typeDefinition: {
            ...typeDefinition,
            file: definitionFile,
        },
    };
};
