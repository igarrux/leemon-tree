import { describe, it, expect, vi, beforeEach, afterEach, Mock, MockInstance } from 'vitest';
import { initCommand } from './init.js';
import { existsSync, copyFileSync } from 'node:fs';

vi.mock('node:fs', () => ({
  existsSync: vi.fn(),
  copyFileSync: vi.fn(),
}));

describe('initCommand', () => {
  let logSpy: MockInstance;
  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    (existsSync as Mock).mockReset();
    (copyFileSync as Mock).mockReset();
  });
  afterEach(() => {
    logSpy.mockRestore();
  });

  it('copies config and logs creation if lemon-tree.yaml does not exist', () => {
    (existsSync as Mock).mockReturnValue(false);
    initCommand();
    expect(copyFileSync).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Config file created: lemon-tree.yaml');
  });

  it('does not copy and logs already exists if lemon-tree.yaml exists', () => {
    (existsSync as Mock).mockReturnValue(true);
    initCommand();
    expect(copyFileSync).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith('Config file already exists.');
  });
}); 