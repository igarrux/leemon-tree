import { InterfaceDeclaration, TypeAliasDeclaration, TypeElementMemberedNode } from 'ts-morph';

/**
 * Returns the TypeElementMemberedNode from an interface or type alias declaration, or undefined if not found.
 * @param decl - The interface or type alias declaration.
 */
export function getMemberedNode(
  decl: InterfaceDeclaration | TypeAliasDeclaration
): TypeElementMemberedNode | undefined {
  if ('getProperties' in decl) return decl as InterfaceDeclaration;
  if ('getTypeNode' in decl) {
    const typeNode = (decl as TypeAliasDeclaration).getTypeNode();
    if (typeNode && typeNode.getKindName() === 'TypeLiteral') {
      return typeNode as unknown as TypeElementMemberedNode;
    }
  }
  return undefined;
} 