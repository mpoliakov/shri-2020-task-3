import Location from './location';
import BemBlockArray from './bem-block-array';
export default class BemBlock {
    block: string;
    mods?: Map<string, string | number | boolean | null>;
    elem?: string;
    elemMods?: Map<string, string | number | boolean | null>;
    content?: BemBlockArray;
    mix?: BemBlockArray;
    location?: Location;
    constructor();
    findNestedBlocks(blockNames: string[]): BemBlock[];
}
