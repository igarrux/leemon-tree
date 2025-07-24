import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('../../../_utils/index.js', () => ({ config: vi.fn() }));
vi.mock('../_utils/index.js', () => ({ getTranslationProvider: vi.fn() }));
vi.mock('../_helpers/resolve-language-config/resolve-language-config.js', () => ({ resolveLanguageConfig: vi.fn() }));
vi.mock('../_helpers/handle-file-casing-conflict/handle-file-casing-conflict.js', () => ({ handleFileCasingConflict: vi.fn() }));
vi.mock('../_helpers/handle-translation-overwrite/handle-translation-overwrite.js', () => ({ handleTranslationOverwrite: vi.fn() }));
vi.mock('../../../_utils/protected-text-manager/protected-text-manager.js', () => ({ ProtectedTextManager: vi.fn().mockImplementation((text, pattern) => ({ protectedText: text, restoreProtectedTexts: vi.fn((t) => t + '_RESTORED') })) }));
vi.mock('../_helpers/handle-translate/handle-translate.js', () => ({ handleTranslate: vi.fn() }));
vi.mock('../../_utils', () => ({ PrintMessages: { clearTerminal: vi.fn(), overwriteAll: vi.fn(), skipAll: vi.fn(), usage: vi.fn(), welcome: vi.fn(), howToExit: vi.fn(), dryRunResult: vi.fn(), translationAdded: vi.fn() } }));
vi.mock('fs', () => ({ existsSync: vi.fn(), mkdirSync: vi.fn() }));

describe('setCommand', () => {
  let setCommand: typeof import('./set').setCommand;
  let config: ReturnType<typeof vi.fn>;
  let getTranslationProvider: ReturnType<typeof vi.fn>;
  let resolveLanguageConfig: ReturnType<typeof vi.fn>;
  let handleFileCasingConflict: ReturnType<typeof vi.fn>;
  let handleTranslationOverwrite: ReturnType<typeof vi.fn>;
  let ProtectedTextManager: any;
  let handleTranslate: ReturnType<typeof vi.fn>;
  let PrintMessages: any;
  let existsSync: ReturnType<typeof vi.fn>;
  let mkdirSync: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    ({ setCommand } = await import('./set.js'));
    config = (await import('../../../_utils/index.js')).config as any;
    getTranslationProvider = (await import('../_utils/index.js')).getTranslationProvider as any;
    resolveLanguageConfig = (await import('../_helpers/resolve-language-config/resolve-language-config.js')).resolveLanguageConfig as any;
    handleFileCasingConflict = (await import('../_helpers/handle-file-casing-conflict/handle-file-casing-conflict.js')).handleFileCasingConflict as any;
    handleTranslationOverwrite = (await import('../_helpers/handle-translation-overwrite/handle-translation-overwrite.js')).handleTranslationOverwrite as any;
    ProtectedTextManager = (await import('../../../_utils/protected-text-manager/protected-text-manager.js')).ProtectedTextManager;
    handleTranslate = (await import('../_helpers/handle-translate/handle-translate.js')).handleTranslate as any;
    PrintMessages = (await import('../../_utils/index.js')).PrintMessages;
    existsSync = (await import('fs')).existsSync as any;
    mkdirSync = (await import('fs')).mkdirSync as any;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('translates for all languages and dryRun false', async () => {
    config.mockReturnValue({ languages: ['es', 'fr'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockImplementation((_cfg, lng) => ({ filePath: `/root/${lng}.json`, dir: '/root', protectionPattern: 'PAT' }));
    existsSync.mockReturnValue(false);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(mkdirSync).toHaveBeenCalledWith('/root', { recursive: true });
    expect(handleFileCasingConflict).toHaveBeenCalledWith('/root', 'es.json');
    expect(handleFileCasingConflict).toHaveBeenCalledWith('/root', 'fr.json');
    expect(overwriteMock).toHaveBeenCalledTimes(2);
    expect(ProtectedTextManager).toHaveBeenCalledTimes(2);
    expect(handleTranslate).toHaveBeenCalledTimes(2);
    expect(PrintMessages.usage).toHaveBeenCalled();
    expect(PrintMessages.welcome).toHaveBeenCalled();
    expect(PrintMessages.howToExit).toHaveBeenCalled();
    expect(PrintMessages.translationAdded).toHaveBeenCalledWith('k');
  });

  it('does not translate if overwrite=skip', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('skip');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(handleTranslate).not.toHaveBeenCalled();
  });

  it('shows overwriteAll message', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwriteAll');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(PrintMessages.overwriteAll).toHaveBeenCalled();
  });

  it('shows skipAll message', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('skipAll');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(PrintMessages.skipAll).toHaveBeenCalled();
  });

  it('shows dryRun message', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: 't', dryRun: true });
    expect(PrintMessages.dryRunResult).toHaveBeenCalled();
  });

  it('handles errors in Promise.all and logs error', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockRejectedValue(new Error('fail'));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(errorSpy).toHaveBeenCalledWith(expect.any(Error));
    errorSpy.mockRestore();
  });

  it('does nothing if languages is nullish', async () => {
    config.mockReturnValue({ languages: undefined });
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(handleTranslate).not.toHaveBeenCalled();
    expect(mkdirSync).not.toHaveBeenCalled();
  });

  it('ProtectedTextManager uses key if text is nullish', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(false);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: undefined, dryRun: false } as any);
    expect(ProtectedTextManager).toHaveBeenCalledWith('k', 'PAT');
  });

  it('handleFileCasingConflict uses "" if filePath.split("/").pop() is nullish', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(false);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(handleFileCasingConflict).toHaveBeenCalledWith('/root', '');
  });

  it('does not call mkdirSync if existsSync(dir) is true', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(mkdirSync).not.toHaveBeenCalled();
  });

  it('calls translationAdded with key if present', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: 'k', text: 't', dryRun: false });
    expect(PrintMessages.translationAdded).toHaveBeenCalledWith('k');
  });

  it('calls translationAdded with text if key is falsy', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: '', text: 't', dryRun: false });
    expect(PrintMessages.translationAdded).toHaveBeenCalledWith('t');
  });

  it('calls translationAdded with empty string if key and text are falsy', async () => {
    config.mockReturnValue({ languages: ['es'], api: {}, default: {}, sourceLanguage: 'en' });
    getTranslationProvider.mockResolvedValue('TRANSLATOR');
    resolveLanguageConfig.mockReturnValue({ filePath: '/root/es.json', dir: '/root', protectionPattern: 'PAT' });
    existsSync.mockReturnValue(true);
    handleFileCasingConflict.mockReturnValue(undefined);
    const overwriteMock = vi.fn().mockResolvedValue('overwrite');
    handleTranslationOverwrite.mockReturnValue(overwriteMock);
    handleTranslate.mockResolvedValue(undefined);
    await setCommand({ key: '', text: '', dryRun: false });
    expect(PrintMessages.translationAdded).toHaveBeenCalledWith('');
  });
});
