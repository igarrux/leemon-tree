import { describe, it, expect } from 'vitest';
import { buildURL } from './build-url';

describe('buildURL', () => {
    it('should build a URL with query parameters', () => {
        const url = 'https://api.example.com';
        const queryParams = { param1: 'value1', param2: 'value2' };
        const result = buildURL(url, queryParams);
        expect(result).toBe('https://api.example.com?param1=value1&param2=value2');
    });

    it('should build a URL with query parameters and encode the values', () => {
        const url = 'https://api.example.com';
        const queryParams = { param1: 'value1', param2: 'value2' };
        const result = buildURL(url, queryParams);
        expect(result).toBe('https://api.example.com?param1=value1&param2=value2');
    });

    it('should encode the values', () => {
        const url = 'https://api.example.com';
        const queryParams = { param1: 'value1%', param2: 'value2#' };
        const result = buildURL(url, queryParams);
        expect(result).toBe('https://api.example.com?param1=value1%25&param2=value2%23');
    });

    it('should add the new query params to the existing ones', () => {
        const url = 'https://api.example.com?param1=value1';
        const queryParams = { param2: 'value2' };
        const result = buildURL(url, queryParams);
        expect(result).toBe('https://api.example.com?param1=value1&param2=value2');
    });

    it('should add the new query params to the existing ones', () => {
        const url = 'https://api.example.com?param1=value1&param2=value2';
        const queryParams = { param3: 'value3' };
        const result = buildURL(url, queryParams);
        expect(result).toBe('https://api.example.com?param1=value1&param2=value2&param3=value3');
    });

});