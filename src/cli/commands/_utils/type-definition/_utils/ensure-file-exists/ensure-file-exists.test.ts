import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ensureFileExists } from './ensure-file-exists.js';
import fs from 'fs-extra';
import { Project } from 'ts-morph';

vi.mock('fs-extra', () => {
  const mock = {
    ensureDir: vi.fn(),
    existsSync: vi.fn(),
    writeFileSync: vi.fn(),
  };
  return {
    ...mock,
    default: mock,
  };
});

vi.mock('ts-morph', async () => {
  const actual = await vi.importActual<typeof import('ts-morph')>('ts-morph');
  return {
    ...actual,
    Project: vi.fn(() => ({
      addSourceFileAtPathIfExists: vi.fn(),
      createSourceFile: vi.fn(),
    })),
  };
});

describe('ensureFileExists', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('creates file and export if file does not exist', async () => {
    (fs.existsSync as any).mockReturnValue(false);
    await ensureFileExists('/foo/bar.ts', 'Exported');
    expect(fs.ensureDir).toHaveBeenCalledWith('/foo');
    expect(fs.writeFileSync).toHaveBeenCalledWith('/foo/bar.ts', expect.stringContaining('export interface Exported'));
  });
  it('adds interface if export does not exist', async () => {
    (fs.existsSync as any).mockReturnValue(true);
    const addSourceFileAtPathIfExists = vi.fn().mockReturnValue({
      getInterface: vi.fn().mockReturnValue(undefined),
      getTypeAlias: vi.fn().mockReturnValue(undefined),
      addInterface: vi.fn(),
      save: vi.fn(),
    });
    (Project as any).mockImplementation(() => ({
      addSourceFileAtPathIfExists,
      createSourceFile: vi.fn(),
    }));
    await ensureFileExists('/foo/bar.ts', 'Exported');
    expect(addSourceFileAtPathIfExists).toHaveBeenCalledWith('/foo/bar.ts');
  });
  it('does nothing if export exists', async () => {
    (fs.existsSync as any).mockReturnValue(true);
    const addSourceFileAtPathIfExists = vi.fn().mockReturnValue({
      getInterface: vi.fn().mockReturnValue(true),
      getTypeAlias: vi.fn().mockReturnValue(undefined),
      addInterface: vi.fn(),
      save: vi.fn(),
    });
    (Project as any).mockImplementation(() => ({
      addSourceFileAtPathIfExists,
      createSourceFile: vi.fn(),
    }));
    await ensureFileExists('/foo/bar.ts', 'Exported');
    expect(addSourceFileAtPathIfExists).toHaveBeenCalledWith('/foo/bar.ts');
  });
  it('calls createSourceFile if addSourceFileAtPathIfExists returns nullish', async () => {
    (fs.existsSync as any).mockReturnValue(true);
    const addSourceFileAtPathIfExists = vi.fn().mockReturnValue(undefined);
    const createSourceFile = vi.fn().mockReturnValue({
      getInterface: vi.fn().mockReturnValue(undefined),
      getTypeAlias: vi.fn().mockReturnValue(undefined),
      addInterface: vi.fn(),
      save: vi.fn(),
    });
    (Project as any).mockImplementation(() => ({
      addSourceFileAtPathIfExists,
      createSourceFile,
    }));
    await ensureFileExists('/foo/bar.ts', 'Exported');
    expect(addSourceFileAtPathIfExists).toHaveBeenCalledWith('/foo/bar.ts');
    expect(createSourceFile).toHaveBeenCalledWith('/foo/bar.ts', '', { overwrite: false });
  });
}); 