import { describe, it, expect } from 'vitest';
import { Project } from 'ts-morph';
import { getMemberedNode } from './get-membered-node.js';

describe('getMemberedNode', () => {
  it('returns the interface node for InterfaceDeclaration', () => {
    const project = new Project();
    const sf = project.createSourceFile('a.ts', 'export interface Foo { bar: string; }');
    const iface = sf.getInterface('Foo')!;
    expect(getMemberedNode(iface)).toBe(iface);
  });
  it('returns the type literal node for TypeAliasDeclaration', () => {
    const project = new Project();
    const sf = project.createSourceFile('a.ts', 'export type Foo = { bar: string }');
    const type = sf.getTypeAlias('Foo')!;
    const node = getMemberedNode(type);
    expect(node).toBeTruthy();
    expect(typeof node?.getProperty).toBe('function');
  });
  it('returns undefined for invalid input', () => {
    expect(getMemberedNode({} as any)).toBeUndefined();
  });
}); 