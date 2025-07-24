import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

vi.mock('../../../../_utils/index.js', () => ({
  config: vi.fn(),
}));
vi.mock('../../_helpers/index.js', () => ({
  resolveLanguageConfig: vi.fn(),
}));
vi.mock('../../_utils/load-translations/laod-translations.js', () => ({
  loadTranslations: vi.fn(),
}));

import { loadLintIndex } from './load-lint-index.js';
import { config } from '../../../../_utils/index.js';
import { resolveLanguageConfig } from '../../_helpers/index.js';
import { loadTranslations } from '../../_utils/load-translations/laod-translations.js';

describe('loadLintIndex', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty if there are no languages', () => {
    (config as Mock).mockReturnValue({ languages: [] });
    const result = loadLintIndex();
    expect(result.keyPresence).toEqual({});
    expect(result.languages).toEqual([]);
  });

  it('returns empty if there are no keys', () => {
    (config as Mock).mockReturnValue({ languages: ['es'] });
    (resolveLanguageConfig as Mock).mockReturnValue({ filePath: 'es.json' });
    (loadTranslations as Mock).mockReturnValue({});
    const result = loadLintIndex();
    expect(result.keyPresence).toEqual({});
    expect(result.languages).toEqual(['es']);
  });

  it('indexes keys present in a single language', () => {
    (config as Mock).mockReturnValue({ languages: ['es'] });
    (resolveLanguageConfig as Mock).mockReturnValue({ filePath: 'es.json' });
    (loadTranslations as Mock).mockReturnValue({ foo: 'a', bar: 'b' });
    const result = loadLintIndex();
    expect(result.keyPresence).toEqual({ foo: new Set(['es']), bar: new Set(['es']) });
    expect(result.languages).toEqual(['es']);
  });

  it('indexes keys across multiple languages', () => {
    (config as Mock).mockReturnValue({ languages: ['es', 'en'] });
    (resolveLanguageConfig as Mock).mockImplementation((_cfg: unknown, lng: unknown) => ({ filePath: `${lng}.json` }));
    (loadTranslations as Mock).mockImplementation((fp: unknown) => fp === 'es.json' ? { foo: 'a', bar: 'b' } : { foo: 'a', baz: 'c' });
    const result = loadLintIndex();
    expect(result.keyPresence.foo).toEqual(new Set(['es', 'en']));
    expect(result.keyPresence.bar).toEqual(new Set(['es']));
    expect(result.keyPresence.baz).toEqual(new Set(['en']));
    expect(result.languages).toEqual(['es', 'en']);
  });

  it('supports empty files and repeated keys', () => {
    (config as Mock).mockReturnValue({ languages: ['es', 'en'] });
    (resolveLanguageConfig as Mock).mockImplementation((_cfg: unknown, lng: unknown) => ({ filePath: `${lng}.json` }));
    (loadTranslations as Mock).mockImplementation((fp: unknown) => fp === 'es.json' ? {} : { foo: 'a' });
    const result = loadLintIndex();
    expect(result.keyPresence.foo).toEqual(new Set(['en']));
    expect(result.languages).toEqual(['es', 'en']);
  });

  it('returns empty array if config().languages is nullish', () => {
    (config as Mock).mockReturnValue({});
    const result = loadLintIndex();
    expect(result.languages).toEqual([]);
    expect(result.keyPresence).toEqual({});
  });
}); 