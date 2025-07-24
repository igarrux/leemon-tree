/**
 * Remove all empty objects from an object
 * @param obj - The object to remove empty objects from
 * @returns The object with all empty objects removed
 */
export const removeEmptyObjects = (obj: object): object => {
    if (typeof obj !== 'object' || obj === null) return obj;

    const cleanedEntries = Object.entries(obj)
        .map(([k, v]) => [k, removeEmptyObjects(v)])
        .filter(([_, v]) => !(typeof v === 'object' && v !== null && Object.keys(v).length === 0));

    return Object.fromEntries(cleanedEntries);
};
