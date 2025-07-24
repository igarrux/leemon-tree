type PatternVars = Record<string, string>;

const transformPattern = (pattern: string, vars: PatternVars): string => {
    return pattern?.replace(/{{(.*?)}}/g, (_, expr) => {
        try {
            const fn = new Function(...Object.keys(vars), `return (${expr});`);
            return fn(...Object.values(vars));
        } catch {
            return `{{${expr}}}`;
        }
    });
};

export default transformPattern;
