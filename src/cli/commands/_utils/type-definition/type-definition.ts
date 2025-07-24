import { resolveLanguageConfig } from '../../_helpers/index.js';
import { ensureFileExists } from './_utils/ensure-file-exists/ensure-file-exists.js';
import { getTypeDeclaration } from './_utils/get-type-declaration/get-type-declaration.js';
import { buildNestedType } from './_helpers/build-nested-type/build-nested-type.js';
import { removeKeyRecursively } from './_helpers/remove-key-recursively/remove-key-recursively.js';
import { Project } from 'ts-morph';
import path from 'path';
import { config } from '../../../../_utils/index.js';

/**
 * Provides static methods to add or remove keys from a TypeScript type/interface definition file.
 * The file and export name are resolved via resolveLanguageConfig(lang).typeDefinition.
 */
export class TypeDefinition {
  private static typeDefConfig = config();
  /**
   * Adds a nested key to the type/interface definition for the given language.
   * @param key - The key to add (dot notation supported).
   * @param lang - The language code.
   */
  static async addType(key: string, lang: string): Promise<void> {
    let typeDefinition;
    if (lang === 'test') {
      typeDefinition = {
        file: path.join(__dirname, '__tmp__', 'translations.types.ts'),
        exportName: 'Translations',
      };
    } else {
      ({ typeDefinition } = resolveLanguageConfig(this.typeDefConfig, lang));
    }
    if (!typeDefinition?.file || !typeDefinition.exportName) return;
    await ensureFileExists(typeDefinition.file, typeDefinition.exportName);
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(typeDefinition.file);
    const declaration = getTypeDeclaration(sourceFile, typeDefinition.exportName);
    if (!declaration) return;
    buildNestedType(declaration, key);
    sourceFile.formatText();
    await sourceFile.save();
  }

  /**
   * Removes a nested key from the type/interface definition for the given language.
   * @param key - The key to remove (dot notation supported).
   * @param lang - The language code.
   */
  static async removeType(key: string, lang: string): Promise<void> {
    let typeDefinition;
    if (lang === 'test') {
      typeDefinition = {
        file: path.join(__dirname, '__tmp__', 'translations.types.ts'),
        exportName: 'Translations',
      };
    } else {
      ({ typeDefinition } = resolveLanguageConfig(this.typeDefConfig, lang));
    }
    if (!typeDefinition?.file || !typeDefinition.exportName) return;
    await ensureFileExists(typeDefinition.file, typeDefinition.exportName);
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(typeDefinition.file);
    const declaration = getTypeDeclaration(sourceFile, typeDefinition.exportName);
    if (!declaration) return;
    removeKeyRecursively(declaration, key);
    sourceFile.formatText();
    await sourceFile.save();
  }
}