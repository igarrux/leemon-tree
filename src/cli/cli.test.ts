import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cli } from './cli.js';
import { config } from '../_utils/index.js';

vi.mock('./commands/init/init.js', () => ({ initCommand: vi.fn() }));
vi.mock('./_utils/print_message/print_message.js', () => ({
    PrintMessages: {
        welcome: vi.fn(),
        unknownCommand: vi.fn(),
        usage: vi.fn(),
    },
}));
vi.mock('./commands/lint/lint.js', () => ({ lintCommand: vi.fn() }));
vi.mock('./commands/guided/guided.js', () => ({ guidedCommand: vi.fn() }));
vi.mock('./commands/set/set.js', () => ({ setCommand: vi.fn() }));
vi.mock('./commands/delete/delete.js', () => ({ deleteCommand: vi.fn() }));

vi.mock('../_utils/index.js', () => ({ config: vi.fn(() => ({})) }));
const originalArgv = process.argv;

describe('cli', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    afterEach(() => {
        process.argv = originalArgv;
    });

    it('calls initCommand for init', async () => {
        process.argv = ['node', 'cli', 'init'];
        const { initCommand } = await import('./commands/init/init.js');
        await cli();
        expect(initCommand).toHaveBeenCalled();
    });

    it('calls PrintMessages.welcome if no args', async () => {
        process.argv = ['node', 'cli'];
        const { PrintMessages } = await import('./_utils/print_message/print_message.js');
        await cli();
        expect(PrintMessages.welcome).toHaveBeenCalled();
    });

    it('calls lintCommand for lint', async () => {
        process.argv = ['node', 'cli', 'lint'];
        const { lintCommand } = await import('./commands/lint/lint.js');
        await cli();
        expect(lintCommand).toHaveBeenCalled();
    });

    it('calls guidedCommand for -g', async () => {
        process.argv = ['node', 'cli', '-g'];
        const { guidedCommand } = await import('./commands/guided/guided.js');
        await cli();
        expect(guidedCommand).toHaveBeenCalledWith({ dryRun: false });
    });

    it('calls guidedCommand for -g with --dry-run', async () => {
        process.argv = ['node', 'cli', '-g', '--dry-run'];
        const { guidedCommand } = await import('./commands/guided/guided.js');
        await cli();
        expect(guidedCommand).toHaveBeenCalledWith({ dryRun: true });
    });

    it('calls setCommand for set', async () => {
        process.argv = ['node', 'cli', 'set', 'foo', 'bar'];
        const { setCommand } = await import('./commands/set/set.js');
        await cli();
        expect(setCommand).toHaveBeenCalledWith({ key: 'foo', text: 'bar', dryRun: false });
    });

    it('calls setCommand for set with --dry-run', async () => {
        process.argv = ['node', 'cli', 'set', 'foo', 'bar', '--dry-run'];
        const { setCommand } = await import('./commands/set/set.js');
        await cli();
        expect(setCommand).toHaveBeenCalledWith({ key: 'foo', text: 'bar', dryRun: true });
    });

    it('calls deleteCommand for delete', async () => {
        process.argv = ['node', 'cli', 'delete', 'foo'];
        const { deleteCommand } = await import('./commands/delete/delete.js');
        await cli();
        expect(deleteCommand).toHaveBeenCalledWith({ key: 'foo', dryRun: false });
    });

    it('calls deleteCommand for delete with --dry-run', async () => {
        process.argv = ['node', 'cli', 'delete', 'foo', '--dry-run'];
        const { deleteCommand } = await import('./commands/delete/delete.js');
        await cli();
        expect(deleteCommand).toHaveBeenCalledWith({ key: 'foo', dryRun: true });
    });

    it('calls PrintMessages.usage if set/delete without key', async () => {
        process.argv = ['node', 'cli', 'set'];
        const { PrintMessages } = await import('./_utils/print_message/print_message.js');
        await cli();
        expect(PrintMessages.usage).toHaveBeenCalled();
    });

    it('calls PrintMessages.unknownCommand for unknown command', async () => {
        process.argv = ['node', 'cli', 'foobar'];
        const { PrintMessages } = await import('./_utils/print_message/print_message.js');
        await cli();
        expect(PrintMessages.unknownCommand).toHaveBeenCalled();
    });
});
