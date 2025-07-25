import { describe, it, expect } from 'vitest';
import { quotedKey } from './quoted-key.js';

describe('quotedKey', () => {
  it('returns unquoted for valid identifiers', () => {
    expect(quotedKey('foo')).toBe('foo');
    expect(quotedKey('_foo')).toBe('_foo');
    expect(quotedKey('$foo')).toBe('$foo');
    expect(quotedKey('foo123')).toBe('foo123');
  });
  it('quotes keys with spaces', () => {
    expect(quotedKey('foo bar')).toBe('"foo bar"');
  });
  it('quotes keys with dashes', () => {
    expect(quotedKey('foo-bar')).toBe('"foo-bar"');
  });
  it('quotes keys with quotes inside', () => {
    expect(quotedKey('foo"bar')).toBe('"foo\\"bar"');
  });
  it('quotes keys starting with a number', () => {
    expect(quotedKey('1foo')).toBe('"1foo"');
  });
  it('quotes empty string', () => {
    expect(quotedKey('')).toBe('""');
  });
  it('quotes with single quotes when singleQuote is true', () => {
    expect(quotedKey('foo bar', true)).toBe("'foo bar'");
  });
  it('does not escape quotes when escape is false', () => {
    expect(quotedKey('foo"bar', false, false)).toBe('"foo"bar"');
  });
}); 