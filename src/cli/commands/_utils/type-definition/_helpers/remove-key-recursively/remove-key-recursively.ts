import { InterfaceDeclaration, TypeAliasDeclaration, TypeElementMemberedNode } from 'ts-morph';
import { quotedKey } from '../../_utils/quoted-key/quoted-key.js';
import { getMemberedNode } from '../../_utils/get-membered-node/get-membered-node.js';

/**
 * Removes a nested property from a type/interface declaration, cleaning up empty objects recursively.
 * @param decl - The interface or type alias declaration.
 * @param key - The dot-notated key (e.g., 'a.b.c').
 */
export function removeKeyRecursively(
    decl: InterfaceDeclaration | TypeAliasDeclaration,
    key: string,
): boolean {
    const membered = getMemberedNode(decl);
    if (!membered) return false;
    const parts = key.split('.');
    function recurse(current: TypeElementMemberedNode, idx: number): boolean {
        const prop =
            current.getProperty(quotedKey(parts[idx], true)) ||
            current.getProperty(quotedKey(parts[idx])) ||
            current.getProperty(parts[idx]);

        if (!prop) return false;
        if (idx === parts.length - 1) {
            prop.remove();
        } else {
            const typeNode = prop.getTypeNode();
            if (typeNode && typeNode.getKindName() === 'TypeLiteral') {
                const child = typeNode as unknown as TypeElementMemberedNode;
                const removed = recurse(child, idx + 1);
                // Remove parent if now empty
                if (removed && (!child.getProperties || child.getProperties().length === 0)) {
                    prop.remove();
                }
            }
        }
        // Return true if current has no properties left
        return current.getProperties().length === 0;
    }
    return recurse(membered, 0);
}
