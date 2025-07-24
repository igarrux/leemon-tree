import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('child_process', () => ({ execSync: vi.fn() }));
vi.mock('../../../../_utils', () => ({ config: vi.fn() }));

describe('runPreScripts', () => {
  let execSync: any;
  let config: any;
  beforeEach(async () => {
    vi.clearAllMocks();
    execSync = (await import('child_process')).execSync;
    config = (await import('../../../../_utils')).config;
  });

  it('executes preScript scripts', async () => {
    config.mockReturnValue({ preScript: ['echo hello', 'do something'] });
    const { runPreScripts } = await import('./run-pre-scripts');
    runPreScripts();
    expect(execSync).toHaveBeenCalledWith('echo hello', { stdio: 'inherit' });
    expect(execSync).toHaveBeenCalledWith('do something', { stdio: 'inherit' });
  });

  it('does nothing if no scripts', async () => {
    config.mockReturnValue({ preScript: [] });
    const { runPreScripts } = await import('./run-pre-scripts');
    runPreScripts();
    expect(execSync).not.toHaveBeenCalled();
  });

  it('does nothing if preScript is undefined', async () => {
    config.mockReturnValue({});
    const { runPreScripts } = await import('./run-pre-scripts');
    runPreScripts();
    expect(execSync).not.toHaveBeenCalled();
  });
});
