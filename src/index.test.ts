import { describe, it, expect, vi, beforeEach } from 'vitest';

let cliMock: ReturnType<typeof vi.fn>;
vi.mock('./cli/cli.js', () => {
  cliMock = vi.fn();
  return { cli: cliMock };
});
vi.mock('./_utils/load-config/load-config.js', () => ({ config: vi.fn() }));

describe('index.ts', () => {
  beforeEach(() => {
    vi.resetModules();
    cliMock?.mockClear();
  });

  it('calls cli if run directly', async () => {
    const { runIfDirect } = await import('./index.js');
    runIfDirect('file:///foo/bar.js', ['/usr/bin/node', '/foo/bar.js']);
    expect(cliMock).toHaveBeenCalled();
  });

  it('does not call cli if imported as a module', async () => {
    const { runIfDirect } = await import('./index.js');
    runIfDirect('file:///foo/bar.js', ['/usr/bin/node', '/foo/other.js']);
    expect(cliMock).not.toHaveBeenCalled();
  });
});