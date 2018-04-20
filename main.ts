
import * as ts from 'typescript';
import { Filereader } from './filereader';

const filereader = new Filereader();

main();

async function main(): Promise<void> {

    const result: UmlClass[] = [];

    const data = await filereader.read('Stadt.ts.inspect');
    // const data = await filereader.read('print.service.ts.inspect');

    const sc = ts.createSourceFile('x.ts', data, ts.ScriptTarget.Latest, true);

    let indent = 0;

    function print(node: ts.Node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
            case ts.SyntaxKind.InterfaceDeclaration:
                const classDeclaration: ts.ClassDeclaration = <ts.ClassDeclaration>node;
                const newUmlClass: UmlClass = {
                    name: classDeclaration.name!.getFullText(),
                    isInterface: node.kind === ts.SyntaxKind.InterfaceDeclaration,
                    dependsOn: [],
                    inherits: []
                };
                if (classDeclaration.heritageClauses) {
                    const heritageClauses: ts.NodeArray<ts.HeritageClause> = classDeclaration.heritageClauses!;
                    heritageClauses.forEach(heritageClause => {
                        heritageClause.types.forEach(expressionWithTypeArguments => {
                            if (ts.isIdentifier(expressionWithTypeArguments.expression)) {
                                const identifier: ts.Identifier = <ts.Identifier>expressionWithTypeArguments.expression
                                newUmlClass.inherits.push(
                                    identifier.text
                                );
                            }
                        });
                    });
                }
                result.push(newUmlClass);
                break;
            case ts.SyntaxKind.ImportDeclaration:
                break;
            default:
                break;
        }    
        console.log(new Array(indent + 1).join('.') + ts.SyntaxKind[node.kind] + ': ' + node.getFullText());
        indent++;
        ts.forEachChild(node, print);
        indent--;
    }

    print(sc);
    console.log(result);
    return;
}

interface UmlClass {
    name: string;
    isInterface: boolean;
    dependsOn: string[];
    inherits: string[];
}