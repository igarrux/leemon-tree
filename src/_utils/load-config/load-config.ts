import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { LemonTreeConfig } from './types/lemon-tree-config.type.js';
import { join } from 'path';
import { CONFIG_FILE } from '../../configs/config_file.js';
import { ADMITED_API_PROVIDERS } from '../../configs/admited_api_providers.js';
import { resolveEnvVar } from '../resolve-env-var/resolve-env-var.js';

/**
 * Loads the config file and returns the config object
 * @returns The config object
 */
export const loadConfig = ({
    configFile,
    admitedApiProviders,
}: {
    configFile: string;
    admitedApiProviders: string[];
}): LemonTreeConfig => {
    try {
        const content = readFileSync(join(process.cwd(), configFile), 'utf-8');
        const config = parse(content) as LemonTreeConfig;
        // Validate languages
        if (!config?.languages || !Array.isArray(config.languages)) {
            throw new Error('languages must be an array');
        }
        if (config.languages.length <= 0) {
            throw new Error('languages must be an array with at least one language');
        }

        // Validate sourceLanguage
        if (!config?.sourceLanguage || typeof config.sourceLanguage !== 'string') {
            throw new Error('sourceLanguage must be a string');
        }

        // Validate default
        if (!config?.default?.filePattern || typeof config.default.filePattern !== 'string') {
            throw new Error('default.filePattern must be a string');
        }

        // Validate default.protectionPattern
        if (config?.default?.protectionPattern && typeof config.default.protectionPattern !== 'string') {
            throw new Error('default.protectionPattern must be a string');
        }

        // Validate api
        if (!config?.api?.provider || typeof config.api.provider !== 'string') {
            throw new Error('api.provider must be a string');
        }
        if (!admitedApiProviders.includes(config?.api?.provider)) {
            throw new Error(`api.provider must be one of ${admitedApiProviders.join(', ')}`);
        }
        if (config.api.provider !== 'plugin' && (!config?.api?.key || typeof config.api.key !== 'string')) {
            throw new Error('api.key must be a string');
        }
        if (config.api.provider === 'plugin' && (!config?.api?.plugin || typeof config.api.plugin !== 'string')) {
            throw new Error('api.plugin must be a string');
        }
        config.api.key = resolveEnvVar(config?.api?.key);
        return config;
    } catch (error) {
        if (error instanceof Error && error.message.includes('ENOENT')) {
            console.error('lemon-tree.yaml file not found');
            process.exit(1);
        }
        throw new Error(`Failed to load config file: ${error}`);
    }
};

let config_cache: LemonTreeConfig|null = null;
export const config = (resetCache: boolean = false): LemonTreeConfig => {
    if (resetCache) config_cache = null;
    if (config_cache) return config_cache;
    config_cache = loadConfig({
        configFile: CONFIG_FILE,
        admitedApiProviders: ADMITED_API_PROVIDERS,
    });
    return config_cache;
};

export default {
    config,
    loadConfig,
};