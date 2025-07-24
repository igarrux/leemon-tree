import { SourceFile, InterfaceDeclaration, TypeAliasDeclaration } from 'ts-morph';

/**
 * Gets the exported interface or type alias declaration by name from a source file.
 * @param sourceFile - The ts-morph SourceFile.
 * @param exportName - The export name to find.
 * @returns The declaration or undefined.
 */
export function getTypeDeclaration(
  sourceFile: SourceFile,
  exportName: string
): InterfaceDeclaration | TypeAliasDeclaration | undefined {
  return (
    sourceFile.getInterface(exportName) ||
    sourceFile.getTypeAlias(exportName)
  );
} 