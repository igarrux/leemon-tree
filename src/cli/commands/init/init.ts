import { existsSync, copyFileSync } from 'node:fs';
import { join } from 'path';

/**
 * Initialize a new project with a default config file
 * @returns void
 */
export const initCommand = () => {
    const destPath = join(process.cwd(), 'lemon-tree.yaml');
    if (!existsSync(destPath)) {
        copyFileSync(join(import.meta.dirname, 'init-lemon-tree.config.yaml'), destPath);
        console.log('Config file created: lemon-tree.yaml');
        return;
    }
    console.log('Config file already exists.');
};
