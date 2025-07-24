import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('child_process', () => ({ execSync: vi.fn() }));
vi.mock('../../../../_utils', () => ({ config: vi.fn() }));

describe('runPostScripts', () => {
  let execSync: any;
  let config: any;
  beforeEach(async () => {
    vi.clearAllMocks();
    execSync = (await import('child_process')).execSync;
    config = (await import('../../../../_utils')).config;
  });

  it('executes scripts with result and action replaced', async () => {
    config.mockReturnValue({ postScript: ['echo {{result}}-{{action}}', 'do {{action}}'] });
    const { runPostScripts } = await import('./run-post-scripts');
    runPostScripts('ok', 'save');
    expect(execSync).toHaveBeenCalledWith('echo ok-save', { stdio: 'inherit' });
    expect(execSync).toHaveBeenCalledWith('do save', { stdio: 'inherit' });
  });

  it('does nothing if no scripts', async () => {
    config.mockReturnValue({ postScript: [] });
    const { runPostScripts } = await import('./run-post-scripts');
    runPostScripts('foo', 'bar');
    expect(execSync).not.toHaveBeenCalled();
  });

  it('does nothing if postScript is undefined', async () => {
    config.mockReturnValue({});
    const { runPostScripts } = await import('./run-post-scripts');
    runPostScripts('foo', 'bar');
    expect(execSync).not.toHaveBeenCalled();
  });
});
 