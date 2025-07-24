import { describe, it, expect } from 'vitest';
import { removeEmptyObjects } from './remove-empty-objects.js';

describe('removeEmptyObjects', () => {
  it('removes empty objects from a flat object', () => {
    expect(removeEmptyObjects({ a: {}, b: 1, c: '' })).toEqual({ b: 1, c: '' });
  });

  it('removes nested empty objects', () => {
    expect(removeEmptyObjects({ a: { b: {} }, c: 2 })).toEqual({ c: 2 });
  });

  it('removes empty arrays and objects', () => {
    expect(removeEmptyObjects({ a: [], b: { c: [] } })).toEqual({});
  });

  it('does not remove primitive values', () => {
    expect(removeEmptyObjects({ a: 0, b: false, c: null, d: undefined })).toEqual({ a: 0, b: false, c: null, d: undefined });
  });

  it('removes empty objects recursively', () => {
    expect(removeEmptyObjects({ a: { b: { c: {} } }, d: 1 })).toEqual({ d: 1 });
  });

  it('returns the same value if not an object', () => {
    expect(removeEmptyObjects(42 as any)).toBe(42);
    expect(removeEmptyObjects('foo' as any)).toBe('foo');
    expect(removeEmptyObjects(null as any)).toBe(null);
    expect(removeEmptyObjects(undefined as any)).toBe(undefined);
  });

  it('handles mixed cases with empty arrays and objects', () => {
    const input = {
      a: {},
      b: { c: {}, d: 2 },
      e: { f: { g: {} } },
      h: 3,
      i: [],
      j: { k: [] },
    };
    expect(removeEmptyObjects(input)).toEqual({ b: { d: 2 }, h: 3 });
  });
});
