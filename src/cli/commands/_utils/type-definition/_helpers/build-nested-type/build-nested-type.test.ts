import { describe, it, expect, beforeEach } from 'vitest';
import { Project } from 'ts-morph';
import { buildNestedType } from './build-nested-type.js';

describe('buildNestedType', () => {
    let project: Project;
    beforeEach(() => {
        project = new Project();
    });
    it('adds a simple key to an interface', () => {
        const sf = project.createSourceFile('a.ts', 'export interface Foo {}');
        const iface = sf.getInterface('Foo')!;
        buildNestedType(iface, 'bar');
        expect(iface.getProperty('bar')).toBeTruthy();
        expect(iface.getProperty('bar')?.getType().getText()).toBe('string');
    });
    it('adds a nested key to an interface', () => {
        const sf = project.createSourceFile('a.ts', 'export interface Foo {}');
        const iface = sf.getInterface('Foo')!;
        buildNestedType(iface, 'a.b.c');
        expect(iface.getProperty('a')).toBeTruthy();
        // Descend into type literal
        const aType = iface.getProperty('a')?.getTypeNode();
        expect(aType?.getText()).toContain('{');
    });
    it('quotes keys with spaces', () => {
        const sf = project.createSourceFile('a.ts', 'export interface Foo {}');
        const iface = sf.getInterface('Foo')!;
        buildNestedType(iface, 'foo bar');
        expect(iface.getProperty('"foo bar"')).toBeTruthy();
    });
    it('does not duplicate existing properties', () => {
        const sf = project.createSourceFile('a.ts', 'export interface Foo { bar: string; }');
        const iface = sf.getInterface('Foo')!;
        buildNestedType(iface, 'bar');
        expect(iface.getProperties().length).toBe(1);
    });
    it('works with type alias', () => {
        const sf = project.createSourceFile('a.ts', 'export type Foo = {}');
        const type = sf.getTypeAlias('Foo')!;
        buildNestedType(type, 'bar.baz');
        // Descend into type literal
        const typeNode = type.getTypeNodeOrThrow();
        expect(typeNode.getText()).toContain('bar');
    });
    it('does nothing if getMemberedNode returns undefined', () => {
        // Simula un objeto que no es interface ni type alias válido
        expect(() => buildNestedType({} as any, 'foo')).not.toThrow();
    });
    it('sets type to {} if typeNode is nullish or not an object', () => {
        const sf = project.createSourceFile('a.ts', 'export interface Foo { a: number; }');
        const iface = sf.getInterface('Foo')!;
        // Forzar el tipo a number, luego agregar a.b
        buildNestedType(iface, 'a.b');
        // Ahora a debe ser un objeto
        const aType = iface.getProperty('a')?.getTypeNode();
        expect(aType?.getText()).toContain('{');
    });
});
