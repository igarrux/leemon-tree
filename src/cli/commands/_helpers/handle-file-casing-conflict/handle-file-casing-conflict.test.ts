import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../../cli/_utils', () => {
  return {
    PrintMessages: {
      renamedFile: vi.fn(),
      casingConflict: vi.fn(),
    },
  };
});

describe('handleFileCasingConflict', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('does nothing if dir does not exist', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn().mockReturnValue(false),
      readdirSync: vi.fn(),
      renameSync: vi.fn(),
    }));
    const { handleFileCasingConflict } = await import('./handle-file-casing-conflict');
    handleFileCasingConflict('/fake/dir', 'File.txt');
    const { PrintMessages } = await import('../../../../cli/_utils');
    expect(PrintMessages.renamedFile).not.toHaveBeenCalled();
    expect(PrintMessages.casingConflict).not.toHaveBeenCalled();
  });

  it('does nothing if no similar files', async () => {
    vi.doMock('fs', () => ({
      existsSync: vi.fn().mockImplementation((p) => p === '/dir'),
      readdirSync: vi.fn().mockReturnValue(['File.txt', 'other.txt']),
      renameSync: vi.fn(),
    }));
    const { handleFileCasingConflict } = await import('./handle-file-casing-conflict');
    handleFileCasingConflict('/dir', 'File.txt');
    const { PrintMessages } = await import('../../../../cli/_utils');
    expect(PrintMessages.renamedFile).not.toHaveBeenCalled();
    expect(PrintMessages.casingConflict).not.toHaveBeenCalled();
  });

  it('renames file if one similar file with different casing', async () => {
    const existsSync = vi.fn().mockImplementation((p) => p === '/dir' || p === '/dir/file.txt');
    const readdirSync = vi.fn().mockReturnValue(['file.txt', 'other.txt']);
    const renameSync = vi.fn();
    vi.doMock('fs', () => ({ existsSync, readdirSync, renameSync }));
    const { handleFileCasingConflict } = await import('./handle-file-casing-conflict');
    handleFileCasingConflict('/dir', 'File.txt');
    const { PrintMessages } = await import('../../../../cli/_utils');
    expect(renameSync).toHaveBeenCalledWith('/dir/file.txt', '/dir/File.txt');
    expect(PrintMessages.renamedFile).toHaveBeenCalledWith('/dir/file.txt', '/dir/File.txt');
    expect(PrintMessages.casingConflict).not.toHaveBeenCalled();
  });

  it('warns if multiple similar files', async () => {
    const existsSync = vi.fn().mockImplementation((p) => p === '/dir' || p === '/dir/file.txt' || p === '/dir/FILE.txt');
    const readdirSync = vi.fn().mockReturnValue(['file.txt', 'FILE.txt', 'File.txt']);
    const renameSync = vi.fn();
    vi.doMock('fs', () => ({ existsSync, readdirSync, renameSync }));
    const { handleFileCasingConflict } = await import('./handle-file-casing-conflict');
    handleFileCasingConflict('/dir', 'File.txt');
    const { PrintMessages } = await import('../../../../cli/_utils');
    expect(PrintMessages.casingConflict).toHaveBeenCalledWith('/dir', 'file.txt, FILE.txt', 'File.txt');
  });
}); 