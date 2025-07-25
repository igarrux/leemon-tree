import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';

// Mock helpers BEFORE importing TypeDefinition
vi.mock('../../_helpers/index.js', () => ({
    resolveLanguageConfig: vi.fn(() => ({
        typeDefinition: { file: undefined, exportName: undefined },
    })),
}));

import { TypeDefinition } from './type-definition.js';

const TMP = path.join(__dirname, '__tmp__');
const FILE = path.join(TMP, 'translations.types.ts');
const EXPORT = 'Translations';

function readFile() {
    return fs.readFileSync(FILE, 'utf-8');
}

function getInterfaceBody() {
    const project = new Project();
    const sf = project.addSourceFileAtPath(FILE);
    const iface = sf.getInterface(EXPORT);
    return iface?.getText() || '';
}
vi.mock('../../../../_utils/index.js', () => ({
    config: vi.fn().mockImplementation(() => ({
        cliLanguage: 'es',
    })),
}));
vi.mock('./../../../_utils/print_message/print_message.js', () => ({
    PrintMessages: {
        typeDefinitionNotFound: vi.fn(),
    },
}));

describe('TypeDefinition', () => {
    beforeEach(async () => {
        await fs.ensureDir(TMP);
        if (fs.existsSync(FILE)) fs.unlinkSync(FILE);
    });
    afterEach(async () => {
        if (fs.existsSync(FILE)) fs.unlinkSync(FILE);
    });

    describe('addType', () => {
        it('adds a nested key', async () => {
            await TypeDefinition.addType('user.profile.email', 'test');
            const body = getInterfaceBody();
            expect(body).toContain('user:');
            expect(body).toContain('profile:');
            expect(body).toContain('email: string');
        });
        it('adds a simple key', async () => {
            await TypeDefinition.addType('foo', 'test');
            expect(readFile()).toContain('foo: string');
        });
        it('adds a key with spaces', async () => {
            await TypeDefinition.addType('foo bar', 'test');
            expect(readFile()).toContain('"foo bar": string');
        });

        it('creates the file if it does not exist', async () => {
            expect(fs.existsSync(FILE)).toBe(false);
            await TypeDefinition.addType('foo', 'test');
            expect(fs.existsSync(FILE)).toBe(true);
        });

        it('creates the export if it does not exist', async () => {
            fs.writeFileSync(FILE, '// empty');
            await TypeDefinition.addType('foo', 'test');
            expect(readFile()).toContain('interface Translations');
        });

        it('calls formatText and save in addType', async () => {
            const formatSpy = vi.fn();
            const saveSpy = vi.fn().mockResolvedValue(undefined);
            const { Project } = await import('ts-morph');
            vi.spyOn(Project.prototype, 'addSourceFileAtPath').mockReturnValue({
                getInterface: () => ({}),
                getTypeAlias: () => undefined,
                formatText: formatSpy,
                save: saveSpy,
            } as any);
            await TypeDefinition.addType('foo', 'test');
            expect(formatSpy).toHaveBeenCalled();
            expect(saveSpy).toHaveBeenCalled();
            (Project.prototype.addSourceFileAtPath as any).mockRestore?.();
        });
        it('calls formatText and save in addType', async () => {
            const formatSpy = vi.fn();
            const saveSpy = vi.fn().mockResolvedValue(undefined);
            const { Project } = await import('ts-morph');
            const orig = Project.prototype.addSourceFileAtPath;
            vi.spyOn(Project.prototype, 'addSourceFileAtPath').mockReturnValue({
                getInterface: () => ({}),
                getTypeAlias: () => undefined,
                formatText: formatSpy,
                save: saveSpy,
            } as any);
            await TypeDefinition.addType('foo', 'test');
            expect(formatSpy).toHaveBeenCalled();
            expect(saveSpy).toHaveBeenCalled();
            (Project.prototype.addSourceFileAtPath as any).mockRestore?.();
        });
        it('does nothing if typeDefinition is missing file or exportName (addType)', async () => {
            const original = TypeDefinition['typeDefConfig'];
            TypeDefinition['typeDefConfig'] = {} as any;
            await expect(TypeDefinition.addType('foo', 'notest')).resolves.toBeUndefined();
            TypeDefinition['typeDefConfig'] = original;
        });

        it('does nothing if getTypeDeclaration returns null (addType)', async () => {
            await TypeDefinition.addType('foo', 'test');
            const project = new (require('ts-morph').Project)();
            const sf = project.addSourceFileAtPath(FILE);
            sf.getInterface(EXPORT)?.remove();
            await sf.save();
            await expect(TypeDefinition.addType('bar', 'test')).resolves.toBeUndefined();
        });

        it('should not call formatText if declaration is not found (addType)', async () => {
            const formatSpy = vi.fn();
            const saveSpy = vi.fn().mockResolvedValue(undefined);
            const { Project } = await import('ts-morph');
            vi.spyOn(Project.prototype, 'addSourceFileAtPath').mockReturnValue({
                getInterface: () => undefined,
                getTypeAlias: () => undefined,
                formatText: formatSpy,
                save: saveSpy,
            } as any);
            await TypeDefinition.addType('foo', 'test');
            expect(formatSpy).not.toHaveBeenCalled();
            expect(saveSpy).not.toHaveBeenCalled();
            (Project.prototype.addSourceFileAtPath as any).mockRestore?.();
        });
    });

    describe('removeType', () => {
        it('removes a simple key', async () => {
            await TypeDefinition.addType('foo', 'test');
            await TypeDefinition.removeType('foo', 'test');
            expect(readFile()).not.toContain('foo: string');
        });

        it('calls formatText and save in removeType', async () => {
            const formatSpy = vi.fn();
            const saveSpy = vi.fn().mockResolvedValue(undefined);
            const { Project } = await import('ts-morph');
            vi.spyOn(Project.prototype, 'addSourceFileAtPath').mockReturnValue({
                getInterface: () => ({}),
                getTypeAlias: () => undefined,
                formatText: formatSpy,
                save: saveSpy,
            } as any);
            await TypeDefinition.removeType('foo', 'test');
            expect(formatSpy).toHaveBeenCalled();
            expect(saveSpy).toHaveBeenCalled();
            (Project.prototype.addSourceFileAtPath as any).mockRestore?.();
        });
        it('does nothing if getTypeDeclaration returns null (removeType)', async () => {
            await TypeDefinition.addType('foo', 'test');
            const project = new (require('ts-morph').Project)();
            const sf = project.addSourceFileAtPath(FILE);
            sf.getInterface(EXPORT)?.remove();
            await sf.save();
            await expect(TypeDefinition.removeType('foo', 'test')).resolves.toBe(false);
        });
        it('does nothing if typeDefinition is missing file or exportName (removeType)', async () => {
            const original = TypeDefinition['typeDefConfig'];
            TypeDefinition['typeDefConfig'] = {} as any;
            await expect(TypeDefinition.removeType('foo', 'notest')).resolves.toBe(false);
            TypeDefinition['typeDefConfig'] = original;
        });
        it('removes a nested key', async () => {
            await TypeDefinition.addType('user.profile.email', 'test');
            await TypeDefinition.removeType('user.profile.email', 'test');
            expect(readFile()).not.toContain('email: string');
        });

        it('cleans up empty objects recursively', async () => {
            await TypeDefinition.addType('a.b.c', 'test');
            await TypeDefinition.removeType('a.b.c', 'test');
            const body = getInterfaceBody();
            expect(body).not.toContain('a:');
            expect(body).not.toContain('b:');
            expect(body).not.toContain('c: string');
        });

        it('should not call formatText if declaration is not found (removeType)', async () => {
            const formatSpy = vi.fn();
            const saveSpy = vi.fn().mockResolvedValue(undefined);
            const { Project } = await import('ts-morph');
            vi.spyOn(Project.prototype, 'addSourceFileAtPath').mockReturnValue({
                getInterface: () => undefined,
                getTypeAlias: () => undefined,
                formatText: formatSpy,
                save: saveSpy,
            } as any);
            await TypeDefinition.removeType('foo', 'test');
            expect(formatSpy).not.toHaveBeenCalled();
            expect(saveSpy).not.toHaveBeenCalled();
            (Project.prototype.addSourceFileAtPath as any).mockRestore?.();
        });
    });
});
