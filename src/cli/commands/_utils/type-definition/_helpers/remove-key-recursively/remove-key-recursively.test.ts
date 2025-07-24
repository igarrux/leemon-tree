import { describe, it, expect, beforeEach } from 'vitest';
import { Project } from 'ts-morph';
import { removeKeyRecursively } from './remove-key-recursively.js';

describe('removeKeyRecursively', () => {
    let project: Project;
    beforeEach(() => {
        project = new Project();
    });
    it('removes a simple key from an interface', () => {
        const sf = project.createSourceFile('a.ts', 'export interface Foo { bar: string; }');
        const iface = sf.getInterface('Foo')!;
        removeKeyRecursively(iface, 'bar');
        expect(iface.getProperty('bar')).toBeUndefined();
    });
    it('removes a nested key from an interface and cleans up empty objects', () => {
        const sf = project.createSourceFile(
            'a.ts',
            'export interface Foo { a: { b: { c: string } } }',
        );
        const iface = sf.getInterface('Foo')!;
        removeKeyRecursively(iface, 'a.b.c');
        expect(iface.getProperty('a')).toBeUndefined();
    });
    it('does not throw if key does not exist', () => {
        const sf = project.createSourceFile('a.ts', 'export interface Foo { bar: string; }');
        const iface = sf.getInterface('Foo')!;
        expect(() => removeKeyRecursively(iface, 'baz')).not.toThrow();
    });
    it('does nothing if getMemberedNode returns undefined', () => {
        expect(() => removeKeyRecursively({} as any, 'foo')).not.toThrow();
    });
    it('works with type alias', () => {
        const sf = project.createSourceFile('a.ts', 'export type Foo = { bar: { baz: string } }');
        const type = sf.getTypeAlias('Foo')!;
        removeKeyRecursively(type, 'bar.baz');
        const typeNode = type.getTypeNodeOrThrow();
        expect(typeNode.getText()).not.toContain('baz');
    });
});
