import fs from 'fs-extra';
import path from 'path';
import { Project } from 'ts-morph';

/**
 * Ensures the file and export exist. If not, creates them as an empty interface.
 * @param file - Path to the .ts file.
 * @param exportName - Name of the export (interface/type).
 */
export async function ensureFileExists(file: string, exportName: string): Promise<void> {
    await fs.ensureDir(path.dirname(file));
    if (!fs.existsSync(file)) {
        console.log('the file does not exist', file);
        fs.writeFileSync(file, `export interface ${exportName} {}`);
        return;
    }
    const project = new Project();
    const sourceFile =
        project.addSourceFileAtPathIfExists(file) ||
        project.createSourceFile(file, '', { overwrite: false });
    let decl = sourceFile.getInterface(exportName) || sourceFile.getTypeAlias(exportName);
    if (!decl) {
        sourceFile.addInterface({ name: exportName, isExported: true });
        await sourceFile.save();
    }
}
