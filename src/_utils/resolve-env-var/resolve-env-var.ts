export const resolveEnvVar = (key: string): string => {
    const match = key.match(/^{{\s*([A-Z0-9_]+)\s*}}$/i);
    if (match) {
        const envVar = match[1];
        const value = process.env[envVar];
        if (!value) {
            console.error(`Environment variable ${envVar} is not defined`);
            process.exit(1);
        }
        return value;
    }
    return key;
};
