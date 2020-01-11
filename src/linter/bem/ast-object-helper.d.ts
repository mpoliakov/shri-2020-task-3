import jsonToAst from 'json-to-ast';
import Location from './location';
export default class AstObjectHelper {
    static getBlock(ast: jsonToAst.AstObject): string;
    static getAstContent(ast: jsonToAst.AstObject): jsonToAst.AstArray | undefined;
    private static getModsMap;
    static getMods(ast: jsonToAst.AstObject): Map<string, string | number | boolean | null> | undefined;
    static getElem(ast: jsonToAst.AstObject): string | undefined;
    static getElemMods(ast: jsonToAst.AstObject): Map<string, string | number | boolean | null> | undefined;
    static getAstMix(ast: jsonToAst.AstObject): jsonToAst.AstArray | undefined;
    static getLocation(node: jsonToAst.AstJsonEntity): Location | undefined;
}
