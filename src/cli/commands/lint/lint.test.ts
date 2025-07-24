import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { lintCommand } from './lint.js';

vi.mock('./_utils/load-lint-index.js', () => ({
  loadLintIndex: vi.fn(),
}));
vi.mock('../../_utils/index.js', () => ({
  PrintMessages: {
    lintKey: vi.fn(),
    lintPresent: vi.fn(),
    lintMissing: vi.fn(),
    lintEdit: vi.fn(),
    lintDelete: vi.fn(),
    lintSummary: vi.fn(),
  },
}));
vi.mock('console', () => ({
  error: vi.fn(),
  log: vi.fn(), 
  warn: vi.fn(),
}));
describe('lintCommand', () => {
  let loadLintIndex: any;
  let PrintMessages: any;
  let exitSpy: any;
  beforeEach(async () => {
    vi.resetModules();
    loadLintIndex = (await import('./_utils/load-lint-index.js')).loadLintIndex;
    PrintMessages = (await import('../../_utils/index.js')).PrintMessages;
    exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => { throw new Error('exit'); });
  });
  afterEach(() => {
    exitSpy.mockRestore();
  });

  it('does not show errors if all keys are present', async () => {
    loadLintIndex.mockReturnValue({
      keyPresence: { foo: new Set(['es', 'en']) },
      languages: ['es', 'en'],
    });
    try {
      await lintCommand();
    } catch {}
    expect(PrintMessages.lintKey).not.toHaveBeenCalled();
    expect(PrintMessages.lintSummary).toHaveBeenCalledWith({
      correctKeys: 1,
      keysWithProblems: 0,
      filesWithProblems: 0,
      totalFiles: 2,
      totalKeys: 1,
    });
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('shows errors and calls process.exit if there are missing keys', async () => {
    loadLintIndex.mockReturnValue({
      keyPresence: { foo: new Set(['es']) },
      languages: ['es', 'en'],
    });
    try {
      await lintCommand();
    } catch (e) {
      expect((e as Error).message).toBe('exit');
    }
    expect(PrintMessages.lintKey).toHaveBeenCalledWith('foo');
    expect(PrintMessages.lintPresent).toHaveBeenCalledWith(['es']);
    expect(PrintMessages.lintMissing).toHaveBeenCalledWith(['en']);
    expect(PrintMessages.lintEdit).toHaveBeenCalled();
    expect(PrintMessages.lintDelete).toHaveBeenCalled();
    expect(PrintMessages.lintSummary).toHaveBeenCalledWith({
      correctKeys: 0,
      keysWithProblems: 1,
      filesWithProblems: 1,
      totalFiles: 2,
      totalKeys: 1,
    });
    expect(exitSpy).toHaveBeenCalledWith(1);
  });

  it('shows errors for multiple keys and files', async () => {
    loadLintIndex.mockReturnValue({
      keyPresence: { foo: new Set(['es']), bar: new Set(['en']) },
      languages: ['es', 'en'],
    });
    try {
      await lintCommand();
    } catch {}
    expect(PrintMessages.lintKey).toHaveBeenCalledWith('foo');
    expect(PrintMessages.lintKey).toHaveBeenCalledWith('bar');
    expect(PrintMessages.lintPresent).toHaveBeenCalledWith(['es']);
    expect(PrintMessages.lintPresent).toHaveBeenCalledWith(['en']);
    expect(PrintMessages.lintMissing).toHaveBeenCalledWith(['en']);
    expect(PrintMessages.lintMissing).toHaveBeenCalledWith(['es']);
    expect(PrintMessages.lintSummary).toHaveBeenCalledWith({
      correctKeys: 0,
      keysWithProblems: 2,
      filesWithProblems: 2,
      totalFiles: 2,
      totalKeys: 2,
    });
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
}); 