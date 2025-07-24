import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { HandleTranslationOverwriteParams } from './types/handle-translation-overwrite.params.js';
import type { Mock } from 'vitest';

vi.mock('../../_utils/load-translations/laod-translations.js', () => ({
  loadTranslations: vi.fn(),
}));
vi.mock('../should-overwrite-key/should-overwrite-key.js', () => ({
  shouldOverwriteKey: vi.fn(),
}));
vi.mock('../../../_utils/index.js', () => ({
  PrintMessages: {
    skippedKey: vi.fn(),
  },
}));

describe('handleTranslationOverwrite', () => {
  let handleTranslationOverwrite: typeof import('./handle-translation-overwrite.js').handleTranslationOverwrite;
  let loadTranslations: Mock;
  let shouldOverwriteKey: Mock;
  let PrintMessages: { skippedKey: Mock };
  let translations: Partial<Record<string, string>>;
  let key: string;
  let lang: string;
  let filePath: string;
  let text: string;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    ({ handleTranslationOverwrite } = await import('./handle-translation-overwrite.js'));
    loadTranslations = (await import('../../_utils/load-translations/laod-translations.js')).loadTranslations as Mock;
    shouldOverwriteKey = (await import('../should-overwrite-key/should-overwrite-key.js')).shouldOverwriteKey as Mock;
    PrintMessages = (await import('../../../_utils/index.js')).PrintMessages as unknown as { skippedKey: Mock };
    key = 'hello';
    lang = 'es';
    filePath = '/file.json';
    text = 'nuevo';
    translations = {};
    loadTranslations.mockReturnValue(translations);
  });

  it('returns none if the key does not exist', async () => {
    translations = {};
    loadTranslations.mockReturnValue(translations);
    const fn = handleTranslationOverwrite();
    const result = await fn({ key, text, filePath, lang } as HandleTranslationOverwriteParams);
    expect(result).toBe('none');
  });

  it('overwrites and returns overwrite if shouldOverwriteKey="yes"', async () => {
    const translations = { [key]: 'old' };
    loadTranslations.mockReturnValue(translations);
    shouldOverwriteKey.mockResolvedValue('yes');
    const fn = handleTranslationOverwrite();
    const result = await fn({ key, text, filePath, lang } as HandleTranslationOverwriteParams);
    expect(result).toBe('overwrite');
    expect(translations[key]).toBe(text);
  });

  it('overwrites and returns overwriteAll if shouldOverwriteKey="yes-to-all"', async () => {
    const translations = { [key]: 'old' };
    loadTranslations.mockReturnValue(translations);
    shouldOverwriteKey.mockResolvedValue('yes-to-all');
    const fn = handleTranslationOverwrite();
    const result = await fn({ key, text, filePath, lang } as HandleTranslationOverwriteParams);
    expect(result).toBe('overwriteAll');
    expect(translations[key]).toBe(text);
  });

  it('returns skip and calls PrintMessages.skippedKey if shouldOverwriteKey="no"', async () => {
    translations[key] = 'old';
    loadTranslations.mockReturnValue(translations);
    shouldOverwriteKey.mockResolvedValue('no');
    const fn = handleTranslationOverwrite();
    const result = await fn({ key, text, filePath, lang } as HandleTranslationOverwriteParams);
    expect(result).toBe('skip');
    expect(PrintMessages.skippedKey).toHaveBeenCalledWith(key, lang);
    expect(translations[key]).toBe('old');
  });

  it('returns skipAll if shouldOverwriteKey="no-to-all"', async () => {
    translations[key] = 'old';
    loadTranslations.mockReturnValue(translations);
    shouldOverwriteKey.mockResolvedValue('no-to-all');
    const fn = handleTranslationOverwrite();
    const result = await fn({ key, text, filePath, lang } as HandleTranslationOverwriteParams);
    expect(result).toBe('skipAll');
    expect(translations[key]).toBe('old');
  });

  it('returns skip if overwrite is empty', async () => {
    translations[key] = 'old';
    loadTranslations.mockReturnValue(translations);
    shouldOverwriteKey.mockResolvedValue(undefined);
    const fn = handleTranslationOverwrite();
    const result = await fn({ key, text, filePath, lang } as HandleTranslationOverwriteParams);
    expect(result).toBe('skip');
    expect(translations[key]).toBe('old');
  });
}); 