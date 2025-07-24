/**
 * Builds a URL with query parameters
 * @param url The base URL
 * @param queryParams The query parameters
 * @returns The URL with query parameters
 */
export const buildURL = (url: string, queryParams: Record<string, string>) => {
    const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
};
