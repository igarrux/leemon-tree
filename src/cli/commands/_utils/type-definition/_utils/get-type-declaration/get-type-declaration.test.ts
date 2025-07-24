import { describe, it, expect } from 'vitest';
import { getTypeDeclaration } from './get-type-declaration.js';

describe('getTypeDeclaration', () => {
  it('returns interface if present', () => {
    const mock = {
      getInterface: () => 'iface',
      getTypeAlias: () => undefined,
    } as any;
    expect(getTypeDeclaration(mock, 'Foo')).toBe('iface');
  });
  it('returns type alias if present', () => {
    const mock = {
      getInterface: () => undefined,
      getTypeAlias: () => 'type',
    } as any;
    expect(getTypeDeclaration(mock, 'Foo')).toBe('type');
  });
  it('returns undefined if neither present', () => {
    const mock = {
      getInterface: () => undefined,
      getTypeAlias: () => undefined,
    } as any;
    expect(getTypeDeclaration(mock, 'Foo')).toBeUndefined();
  });
}); 