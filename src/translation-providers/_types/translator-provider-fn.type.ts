import { ProviderOptions } from './provider-options.type';
export type TranslatorProviderFn = (options: { free?: boolean } & ProviderOptions) => Promise<string>;