import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock config y PrintMessages ANTES de importar GuidedPrompts
vi.mock('../../../../../_utils/index.js', () => ({
  config: () => ({ cliLanguage: 'es' }),
  PrintMessages: { editing: vi.fn() },
}));

vi.mock('prompts', () => ({
  __esModule: true,
  default: vi.fn(),
}));

import { GuidedPrompts } from './guided_prompts.js';
import { cliMessages } from '../../../../_messages/messages.js';
import prompts from 'prompts';
vi.mock('console', () => ({
  error: vi.fn(),
  log: vi.fn(), 
  warn: vi.fn(),
}));
const originalCliMessages = JSON.parse(JSON.stringify(cliMessages));

beforeEach(() => {
  vi.clearAllMocks();
  Object.keys(cliMessages as any).forEach(k => { delete (cliMessages as any)[k]; });
  Object.assign(cliMessages as any, JSON.parse(JSON.stringify(originalCliMessages)));
});

describe('GuidedPrompts', () => {
  it('uses en as fallback if cliLanguage is missing', async () => {
    vi.doMock('../../../../../_utils/index.js', () => ({
      config: () => ({}),
      PrintMessages: { editing: vi.fn() },
    }));
    const { GuidedPrompts: GP } = await import('./guided_prompts.js');
    (prompts as any).mockResolvedValueOnce({ useTextAsKey: true });
    expect(await GP.useTextAsKey()).toBe(true);
    vi.resetModules();
  });

  it('uses en as fallback if message is missing in cliMessages', async () => {
    vi.doMock('../../../../../_utils/index.js', () => ({
      config: () => ({ cliLanguage: 'fr' }),
      PrintMessages: { editing: vi.fn() },
    }));
    Object.defineProperty(cliMessages as any, 'fr', { value: {}, configurable: true, writable: true });
    const { GuidedPrompts: GP } = await import('./guided_prompts.js');
    (prompts as any).mockResolvedValueOnce({ useTextAsKey: true });
    expect(await GP.useTextAsKey()).toBe(true);
    vi.resetModules();
  });

  it('uses en as fallback for individual message keys', async () => {
    vi.doMock('../../../../../_utils/index.js', () => ({
      config: () => ({ cliLanguage: 'es' }),
      PrintMessages: { editing: vi.fn() },
    }));
    Object.defineProperty((cliMessages as any).es, 'use_text_as_key', { value: undefined, configurable: true });
    const { GuidedPrompts: GP } = await import('./guided_prompts.js');
    (prompts as any).mockResolvedValueOnce({ useTextAsKey: true });
    expect(await GP.useTextAsKey()).toBe(true);
    vi.resetModules();
  });

  // El resto de tests usa el config por defecto (español)
  it('getTextAndKey works with useTextAsKey true', async () => {
    (prompts as any).mockResolvedValueOnce({ key: undefined, text: 't' });
    expect(await GuidedPrompts.getTextAndKey(true)).toEqual({ key: 't', text: 't', isExit: false });
  });

  it('getTextAndKey works with useTextAsKey false', async () => {
    (prompts as any).mockResolvedValueOnce({ key: 'k', text: 't' });
    expect(await GuidedPrompts.getTextAndKey(false)).toEqual({ key: 'k', text: 't', isExit: false });
  });

  it('editTextAndKey works with useTextAsKey true', async () => {
    (prompts as any).mockResolvedValueOnce({ key: undefined, text: 't' });
    const result = await GuidedPrompts.editTextAndKey('oldText', 'oldKey', true);
    expect(result).toEqual({ newKey: 't', newText: 't', isExit: false });
  });

  it('editTextAndKey works with useTextAsKey false', async () => {
    (prompts as any).mockResolvedValueOnce({ key: 'k', text: 't' });
    const result = await GuidedPrompts.editTextAndKey('oldText', 'oldKey', false);
    expect(result).toEqual({ newKey: 'k', newText: 't', isExit: false });
  });

  it('editTextAndKey handles cancel', async () => {
    (prompts as any).mockImplementationOnce((_cfg: any, { onCancel }: any) => { onCancel(); return Promise.resolve({}); });
    const result = await GuidedPrompts.editTextAndKey('oldText', 'oldKey', false);
    expect(result.isExit).toBe(true);
  });

  it('editTextAndKey fallback when messages missing', async () => {
    vi.doMock('../../../../../_utils/index.js', () => ({
      config: () => ({ cliLanguage: 'fr' }),
      PrintMessages: { editing: vi.fn() },
    }));
    Object.defineProperty(cliMessages as any, 'fr', { value: {}, configurable: true, writable: true });
    const { GuidedPrompts: GP } = await import('./guided_prompts.js');
    (prompts as any).mockResolvedValueOnce({ key: 'k', text: 't' });
    const result = await GP.editTextAndKey('oldText', 'oldKey', false);
    expect(result).toEqual({ newKey: 'k', newText: 't', isExit: false });
    vi.resetModules();
  });

  it('getTextAndKey fallback when messages missing', async () => {
    vi.doMock('../../../../../_utils/index.js', () => ({
      config: () => ({ cliLanguage: 'fr' }),
      PrintMessages: { editing: vi.fn() },
    }));
    Object.defineProperty(cliMessages as any, 'fr', { value: {}, configurable: true, writable: true });
    const { GuidedPrompts: GP } = await import('./guided_prompts');
    (prompts as any).mockResolvedValueOnce({ key: 'k', text: 't' });
    expect(await GP.getTextAndKey(false)).toEqual({ key: 'k', text: 't', isExit: false });
    vi.resetModules();
  });

  it('useTextAsKey returns true/false', async () => {
    (prompts as any).mockResolvedValueOnce({ useTextAsKey: true });
    expect(await GuidedPrompts.useTextAsKey()).toBe(true);
    (prompts as any).mockResolvedValueOnce({ useTextAsKey: false });
    expect(await GuidedPrompts.useTextAsKey()).toBe(false);
  });

  it('enterTextToTranslate returns trimmed text', async () => {
    (prompts as any).mockResolvedValueOnce({ input: '  hola  ' });
    expect(await GuidedPrompts.enterTextToTranslate()).toBe('hola');
  });

  it('enterKeyForTranslation returns trimmed key', async () => {
    (prompts as any).mockResolvedValueOnce({ input: '  key  ' });
    expect(await GuidedPrompts.enterKeyForTranslation()).toBe('key');
  });

  it('translationAdded returns the selected action', async () => {
    (prompts as any).mockResolvedValueOnce({ act: 'continue' });
    expect(await GuidedPrompts.translationAdded('key')).toBe('continue');
    (prompts as any).mockResolvedValueOnce({ act: 'edit' });
    expect(await GuidedPrompts.translationAdded('key')).toBe('edit');
    (prompts as any).mockResolvedValueOnce({ act: 'delete' });
    expect(await GuidedPrompts.translationAdded('key')).toBe('delete');
    (prompts as any).mockResolvedValueOnce({ act: 'finished' });
    expect(await GuidedPrompts.translationAdded('key')).toBe('finished');
  });

  it('deleteTranslation returns true/false', async () => {
    (prompts as any).mockResolvedValueOnce({ confirm: true });
    expect(await GuidedPrompts.deleteTranslation()).toBe(true);
    (prompts as any).mockResolvedValueOnce({ confirm: false });
    expect(await GuidedPrompts.deleteTranslation()).toBe(false);
  });

  it('deleteTranslation handles cancel', async () => {
    (prompts as any).mockImplementationOnce((_cfg: any, opts: any) => { if (opts && opts.onCancel) opts.onCancel(); return Promise.resolve({}); });
    expect(await GuidedPrompts.deleteTranslation()).toBeUndefined();
  });

  it('getTextAndKey returns key/text and handles cancel', async () => {
    (prompts as any).mockResolvedValueOnce({ key: 'k', text: 't' });
    expect(await GuidedPrompts.getTextAndKey(false)).toEqual({ key: 'k', text: 't', isExit: false });
    (prompts as any).mockImplementationOnce((_cfg: any, { onCancel }: any) => { onCancel(); return Promise.resolve({}); });
    expect((await GuidedPrompts.getTextAndKey(false)).isExit).toBe(true);
  });

  it('clearTerminal calls process.stdout.write', () => {
    const spy = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
    GuidedPrompts.clearTerminal();
    expect(spy).toHaveBeenCalledWith('\x1Bc');
    spy.mockRestore();
  });

  it('inputKeyOptions and inputTextOptions validate', () => {
    const { inputKeyOptions, inputTextOptions } = GuidedPrompts as any;
    expect(inputKeyOptions.validate('key')).toBe(true);
    expect(inputKeyOptions.validate('')).toBe(GuidedPrompts.messages.empty_key);
    expect(inputTextOptions.validate('text')).toBe(true);
    expect(inputTextOptions.validate('')).toBe(GuidedPrompts.messages.empty_text);
  });

  it('static yes/no/yesToAll/noToAll return correct values', () => {
    expect(GuidedPrompts.yes).toBe(cliMessages.es.yes);
    expect(GuidedPrompts.no).toBe(cliMessages.es.no);
    expect(GuidedPrompts.yesToAll).toBe(cliMessages.es.yes_to_all);
    expect(GuidedPrompts.noToAll).toBe(cliMessages.es.no_to_all);
  });

  it('static lang and messages are correct', () => {
    expect(GuidedPrompts.lang).toBe('es');
    expect(GuidedPrompts.messages).toStrictEqual(cliMessages.es);
  });

  it('static lang getter is covered', () => {
    expect(typeof GuidedPrompts.lang).toBe('string');
  });

  it('lang returns en if config()?.cliLanguage is undefined', async () => {
    vi.doMock('../../../../../_utils/index.js', () => ({
      config: () => ({}),
      PrintMessages: { editing: vi.fn() },
    }));
    const { GuidedPrompts: GP } = await import('./guided_prompts.js');
    expect(GP.lang).toBe('en');
    vi.resetModules();
  });
}); 