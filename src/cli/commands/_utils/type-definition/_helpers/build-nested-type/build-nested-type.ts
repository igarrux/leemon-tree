import { InterfaceDeclaration, TypeAliasDeclaration, TypeElementMemberedNode } from 'ts-morph';
import { quotedKey } from '../../_utils/quoted-key/quoted-key.js';
import { getMemberedNode } from '../../_utils/get-membered-node/get-membered-node.js';

/**
 * Adds a nested property to a type/interface declaration, creating intermediate objects as needed.
 * @param decl - The interface or type alias declaration.
 * @param key - The dot-notated key (e.g., 'a.b.c').
 */
export function buildNestedType(
    decl: InterfaceDeclaration | TypeAliasDeclaration,
    key: string,
): void {
    const membered = getMemberedNode(decl);
    if (!membered) return;
    const parts = key.split('.');
    let current: TypeElementMemberedNode = membered;
    for (let i = 0; i < parts.length; i++) {
        const part = quotedKey(parts[i]);
        const isLast = i === parts.length - 1;
        let prop = current.getProperty(part);
        if (!prop) {
            prop = current.addProperty({
                name: part,
                type: isLast ? 'string' : '{}',
            });
        }
        if (!isLast) {
            let typeNode = prop.getTypeNode();
            if (!typeNode || !typeNode.getText().includes('{')) {
                prop.setType('{}');
                typeNode = prop.getTypeNode();
            }
            if (typeNode && typeNode.getKindName() === 'TypeLiteral') {
                current = typeNode as unknown as TypeElementMemberedNode;
            }
        }
    }
}
