import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../_utils/index.js', () => ({
    PrintMessages: {
        welcome: vi.fn(),
        unknownCommand: vi.fn(),
        usage: vi.fn(),
        casingConflict: vi.fn(),
        renamedFile: vi.fn(),
        keyExists: vi.fn(),
        failedToTranslate: vi.fn(),
        skippedKey: vi.fn(),
        yes: vi.fn(),
        no: vi.fn(),
        yesToAll: vi.fn(),
        noToAll: vi.fn(),
        noAddTranslation: vi.fn(),
    },
}));

vi.mock('./_helpers/guided_prompts/guided_prompts.js', () => ({
    GuidedPrompts: {
        clearTerminal: vi.fn(),
        useTextAsKey: vi.fn(),
        getTextAndKey: vi.fn(),
        translationAdded: vi.fn(),
        editTextAndKey: vi.fn(),
    },
}));

vi.mock('../set/set.js', () => ({
    setCommand: vi.fn(),
}));

import { guidedCommand } from './guided.js';
import { GuidedPrompts } from './_helpers/guided_prompts/guided_prompts.js';
import { setCommand } from '../set/set.js';

describe('guidedCommand', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should exit immediately if user exits at first prompt', async () => {
        (GuidedPrompts.useTextAsKey as any).mockResolvedValue(true);
        (GuidedPrompts.getTextAndKey as any).mockResolvedValue({ key: '', text: '', isExit: true });
        await guidedCommand({ dryRun: true });
        expect(setCommand).not.toHaveBeenCalled();
    });

    it('should call setCommand with text as key and continue', async () => {
        (GuidedPrompts.useTextAsKey as any).mockResolvedValue(true);
        (GuidedPrompts.getTextAndKey as any)
            .mockResolvedValueOnce({ key: 'foo', text: 'foo', isExit: false })
            .mockResolvedValueOnce({ key: '', text: '', isExit: true });
        (GuidedPrompts.translationAdded as any).mockResolvedValueOnce('continue');
        await guidedCommand({ dryRun: true });
        expect(setCommand).toHaveBeenCalledWith({ key: 'foo', text: 'foo', dryRun: true });
    });

    it('should allow editing the text and key', async () => {
        (GuidedPrompts.useTextAsKey as any).mockResolvedValue(false);
        (GuidedPrompts.getTextAndKey as any)
            .mockResolvedValueOnce({ key: 'bar', text: 'baz', isExit: false })
            .mockResolvedValueOnce({ key: '', text: '', isExit: true });
        (GuidedPrompts.translationAdded as any)
            .mockResolvedValueOnce('edit')
            .mockResolvedValueOnce('continue');
        (GuidedPrompts.editTextAndKey as any).mockResolvedValue({
            newText: 'baz-edited',
            newKey: 'bar-edited',
        });
        await guidedCommand({ dryRun: false });
        expect(setCommand).toHaveBeenCalledWith({
            key: 'bar-edited',
            text: 'baz-edited',
            dryRun: false,
        });
    });

    it('should allow deleting a translation and not call setCommand', async () => {
        (GuidedPrompts.useTextAsKey as any).mockResolvedValue(true);
        (GuidedPrompts.getTextAndKey as any)
            .mockResolvedValueOnce({ key: 'del', text: 'del', isExit: false })
            .mockResolvedValueOnce({ key: '', text: '', isExit: true });
        (GuidedPrompts.translationAdded as any)
            .mockResolvedValueOnce('delete')
            .mockResolvedValueOnce('finished');
        await guidedCommand({ dryRun: true });
        expect(setCommand).not.toHaveBeenCalled();
    });

    it('should finish when user selects finished', async () => {
        (GuidedPrompts.useTextAsKey as any).mockResolvedValue(true);
        (GuidedPrompts.getTextAndKey as any).mockResolvedValueOnce({
            key: 'fin',
            text: 'fin',
            isExit: false,
        });
        (GuidedPrompts.translationAdded as any).mockResolvedValueOnce('finished');
        await guidedCommand({ dryRun: true });
        expect(setCommand).not.toHaveBeenCalled();
    });
});
