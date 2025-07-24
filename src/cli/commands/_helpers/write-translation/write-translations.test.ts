import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('fs', () => ({
  writeFileSync: vi.fn(),
}));

describe('writeTranslations', () => {
  let writeTranslations: typeof import('./write-translation').writeTranslations;
  let writeFileSync: ReturnType<typeof vi.fn>;
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    ({ writeTranslations } = await import('./write-translation'));
    writeFileSync = (await import('fs')).writeFileSync as any;
  });

  it('writes the file correctly', () => {
    writeTranslations('/foo.json', { a: 'b' });
    expect(writeFileSync).toHaveBeenCalledWith('/foo.json', JSON.stringify({ a: 'b' }, null, 4), 'utf-8');
  });

  it('throws a custom error if writing fails', () => {
    writeFileSync.mockImplementation(() => { throw new Error('fail'); });
    expect(() => writeTranslations('/foo.json', { a: 'b' })).toThrow('Failed to write file: /foo.json');
  });
});
