import jsonToAst from 'json-to-ast';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
}

var LinterRuleType;
(function (LinterRuleType) {
    LinterRuleType[LinterRuleType["DOCUMENT"] = 0] = "DOCUMENT";
    LinterRuleType[LinterRuleType["NODE"] = 1] = "NODE";
})(LinterRuleType || (LinterRuleType = {}));
var LinterRule = (function () {
    function LinterRule(category, code, type) {
        this.error = '';
        this.code = category + "." + code;
        this.type = type;
    }
    return LinterRule;
}());
var NodeLinterRule = (function (_super) {
    __extends(NodeLinterRule, _super);
    function NodeLinterRule(category, code) {
        return _super.call(this, category, code, LinterRuleType.NODE) || this;
    }
    return NodeLinterRule;
}(LinterRule));
var DocumentLinterRule = (function (_super) {
    __extends(DocumentLinterRule, _super);
    function DocumentLinterRule(category, code) {
        return _super.call(this, category, code, LinterRuleType.DOCUMENT) || this;
    }
    return DocumentLinterRule;
}(LinterRule));

var TooMuchMarketingBlocks = (function (_super) {
    __extends(TooMuchMarketingBlocks, _super);
    function TooMuchMarketingBlocks(category, code) {
        return _super.call(this, category, code) || this;
    }
    TooMuchMarketingBlocks.prototype.lint = function (bemBlock) {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = bemBlock) === null || _a === void 0 ? void 0 : _a.block) !== 'grid') {
            return [];
        }
        var mColumns = (_b = bemBlock.mods) === null || _b === void 0 ? void 0 : _b.get('m-columns');
        if (!mColumns) {
            return [];
        }
        if (!((_c = bemBlock.content) === null || _c === void 0 ? void 0 : _c.blocks) || ((_d = bemBlock.content) === null || _d === void 0 ? void 0 : _d.blocks.length) === 0) {
            return [];
        }
        var result = [];
        var marketingBlockNames = ['offer', 'commercial'];
        for (var _i = 0, _g = bemBlock.content.blocks; _i < _g.length; _i++) {
            var contentBlock = _g[_i];
            if (contentBlock.block !== 'grid' || contentBlock.elem !== 'fraction') {
                continue;
            }
            var marketingBlock = (_e = contentBlock.content) === null || _e === void 0 ? void 0 : _e.blocks.find(function (i) { return marketingBlockNames.indexOf(i.block) > -1; });
            if (!marketingBlock) {
                continue;
            }
            var mCol = (_f = contentBlock.elemMods) === null || _f === void 0 ? void 0 : _f.get('m-col');
            if (mCol > (mColumns / 2)) {
                result = __spreadArrays(result, [{
                        code: this.code,
                        error: 'Маркетинговые блоки (commercial, offer) занимают не больше половины от всех колонок блока grid.',
                        location: bemBlock.location
                    }]);
            }
        }
        return result;
    };
    return TooMuchMarketingBlocks;
}(NodeLinterRule));

var SeveralH1 = (function (_super) {
    __extends(SeveralH1, _super);
    function SeveralH1(category, code) {
        return _super.call(this, category, code) || this;
    }
    SeveralH1.prototype.check = function (bemBlock) {
        var _a;
        return bemBlock && bemBlock.block === 'text' && ((_a = bemBlock.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h1';
    };
    SeveralH1.prototype.lint = function (bemBlocks) {
        var _a;
        var h1Blocks = (_a = bemBlocks) === null || _a === void 0 ? void 0 : _a.filter(function (i) { var _a; return i.block === 'text' && ((_a = i.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h1'; });
        var result = [];
        if (h1Blocks.length > 1) {
            for (var i = 1; i < h1Blocks.length; i++) {
                result = __spreadArrays(result, [{
                        code: this.code,
                        error: 'Заголовок первого уровня (блок text с модификатором type h1) на странице должен быть единственным.',
                        location: h1Blocks[i].location
                    }]);
            }
        }
        return result;
    };
    return SeveralH1;
}(DocumentLinterRule));

var InvalidH2Position = (function (_super) {
    __extends(InvalidH2Position, _super);
    function InvalidH2Position(category, code) {
        return _super.call(this, category, code) || this;
    }
    InvalidH2Position.prototype.check = function (bemBlock) {
        var _a, _b;
        return bemBlock && bemBlock.block === 'text' && (((_a = bemBlock.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h1' || ((_b = bemBlock.mods) === null || _b === void 0 ? void 0 : _b.get('type')) === 'h2');
    };
    InvalidH2Position.prototype.lint = function (bemBlocks) {
        var _a;
        var hBlocks = bemBlocks.filter(function (i) { var _a, _b; return i.block === 'text' && (((_a = i.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h1') || ((_b = i.mods) === null || _b === void 0 ? void 0 : _b.get('type')) === 'h2'; });
        var h1Index = (_a = hBlocks) === null || _a === void 0 ? void 0 : _a.findIndex(function (i) { var _a; return ((_a = i.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h1'; });
        if (h1Index <= 0) {
            return [];
        }
        var result = [];
        var h2BlocksBeforeH1 = bemBlocks.slice(0, h1Index).filter(function (i) { var _a; return ((_a = i.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h2'; });
        for (var _i = 0, h2BlocksBeforeH1_1 = h2BlocksBeforeH1; _i < h2BlocksBeforeH1_1.length; _i++) {
            var h2Block = h2BlocksBeforeH1_1[_i];
            result = __spreadArrays(result, [{
                    code: this.code,
                    error: 'Заголовок второго уровня (блок text с модификатором type h2) не может находиться перед заголовком первого уровня на том же или более глубоком уровне вложенности.',
                    location: h2Block.location
                }]);
        }
        return result;
    };
    return InvalidH2Position;
}(DocumentLinterRule));

var InvalidH3Position = (function (_super) {
    __extends(InvalidH3Position, _super);
    function InvalidH3Position(category, code) {
        return _super.call(this, category, code) || this;
    }
    InvalidH3Position.prototype.check = function (bemBlock) {
        var _a, _b;
        return bemBlock && bemBlock.block === 'text' && (((_a = bemBlock.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h2' || ((_b = bemBlock.mods) === null || _b === void 0 ? void 0 : _b.get('type')) === 'h3');
    };
    InvalidH3Position.prototype.lint = function (bemBlocks) {
        var _a;
        var hBlocks = bemBlocks.filter(function (i) { var _a, _b; return i.block === 'text' && (((_a = i.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h2') || ((_b = i.mods) === null || _b === void 0 ? void 0 : _b.get('type')) === 'h3'; });
        var h2Index = (_a = hBlocks) === null || _a === void 0 ? void 0 : _a.findIndex(function (i) { var _a; return ((_a = i.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h2'; });
        if (h2Index <= 0) {
            return [];
        }
        var result = [];
        var h3BlocksBeforeH2 = bemBlocks.slice(0, h2Index).filter(function (i) { var _a; return ((_a = i.mods) === null || _a === void 0 ? void 0 : _a.get('type')) === 'h3'; });
        for (var _i = 0, h3BlocksBeforeH2_1 = h3BlocksBeforeH2; _i < h3BlocksBeforeH2_1.length; _i++) {
            var h3Block = h3BlocksBeforeH2_1[_i];
            result = __spreadArrays(result, [{
                    code: this.code,
                    error: 'Заголовок третьего уровня (блок text с модификатором type h3) не может находиться перед заголовком второго уровня на том же или более глубоком уровне вложенности.',
                    location: h3Block.location
                }]);
        }
        return result;
    };
    return InvalidH3Position;
}(DocumentLinterRule));

var TextSizesShouldBeEqual = (function (_super) {
    __extends(TextSizesShouldBeEqual, _super);
    function TextSizesShouldBeEqual(category, code) {
        return _super.call(this, category, code) || this;
    }
    TextSizesShouldBeEqual.prototype.lint = function (bemBlock) {
        var _a, _b;
        if (bemBlock.block !== 'warning') {
            return [];
        }
        if (!bemBlock.content || bemBlock.content.blocks.length === 0) {
            return [];
        }
        var textBlocks = bemBlock.content.blocks.filter(function (b) { return b.block === 'text'; });
        if (textBlocks.length > 1 && textBlocks[0].mods) {
            var etalonSize = (_a = textBlocks[0].mods) === null || _a === void 0 ? void 0 : _a.get('size');
            for (var i = 1; i < textBlocks.length; i++) {
                if (etalonSize !== ((_b = textBlocks[i].mods) === null || _b === void 0 ? void 0 : _b.get('size'))) {
                    return [{
                            code: this.code,
                            error: "\u0412\u0441\u0435 \u0442\u0435\u043A\u0441\u0442\u044B (\u0431\u043B\u043E\u043A\u0438 text) \u0432 \u0431\u043B\u043E\u043A\u0435 warning \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u044B\u0442\u044C \u043E\u0434\u043D\u043E\u0433\u043E \u0440\u0430\u0437\u043C\u0435\u0440\u0430 (\"size\": \"" + etalonSize + "\").",
                            location: bemBlock.location
                        }];
                }
            }
        }
        return [];
    };
    return TextSizesShouldBeEqual;
}(NodeLinterRule));

var incrementSizeMod = (function (value) {
    switch (value) {
        case 's':
            return 'm';
        case 'm':
            return 'l';
        case 'l':
            return 'xl';
        case 'xl':
            return 'xxl';
        default:
            return undefined;
    }
});

var InvalidButtonSize = (function (_super) {
    __extends(InvalidButtonSize, _super);
    function InvalidButtonSize(category, code) {
        return _super.call(this, category, code) || this;
    }
    InvalidButtonSize.prototype.lint = function (bemBlock) {
        var _a, _b;
        if (bemBlock.block !== 'warning') {
            return [];
        }
        if (!bemBlock.content || bemBlock.content.blocks.length === 0) {
            return [];
        }
        var textBlocks = bemBlock.content.blocks.filter(function (b) { return b.block === 'text'; });
        if (textBlocks.length === 0 || !textBlocks[0].mods) {
            return [];
        }
        var etalonSize = (_a = textBlocks[0].mods) === null || _a === void 0 ? void 0 : _a.get('size');
        if (!etalonSize) {
            return [];
        }
        var etalonButtonSize = incrementSizeMod(etalonSize);
        var buttonBlocks = bemBlock.content.blocks.filter(function (b) { return b.block === 'button'; });
        var result = [];
        for (var _i = 0, buttonBlocks_1 = buttonBlocks; _i < buttonBlocks_1.length; _i++) {
            var btn = buttonBlocks_1[_i];
            if (((_b = btn.mods) === null || _b === void 0 ? void 0 : _b.get('size')) !== etalonButtonSize) {
                result = __spreadArrays(result, [{
                        code: this.code,
                        error: "\u0420\u0430\u0437\u043C\u0435\u0440 \u043A\u043D\u043E\u043F\u043A\u0438 \u0431\u043B\u043E\u043A\u0430 warning \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043D\u0430 1 \u0448\u0430\u0433 \u0431\u043E\u043B\u044C\u0448\u0435 \u044D\u0442\u0430\u043B\u043E\u043D\u043D\u043E\u0433\u043E (\"size\": \"" + etalonButtonSize + "\").",
                        location: btn.location
                    }]);
            }
        }
        return result;
    };
    return InvalidButtonSize;
}(NodeLinterRule));

var InvalidButtonPosition = (function (_super) {
    __extends(InvalidButtonPosition, _super);
    function InvalidButtonPosition(category, code) {
        return _super.call(this, category, code) || this;
    }
    InvalidButtonPosition.prototype.lint = function (bemBlock) {
        if (bemBlock.block !== 'warning') {
            return [];
        }
        var buttonAndPlaceholderBlocks = bemBlock.findNestedBlocks(['button', 'placeholder']);
        if (!buttonAndPlaceholderBlocks || buttonAndPlaceholderBlocks.length === 0) {
            return [];
        }
        var placeholderPosition = buttonAndPlaceholderBlocks.findIndex(function (b) { return b.block === 'placeholder'; });
        if (placeholderPosition === -1) {
            return [];
        }
        var result = [];
        for (var i = 0; i < placeholderPosition; i++) {
            if (buttonAndPlaceholderBlocks[i].block === 'button') {
                result = __spreadArrays(result, [{
                        code: this.code,
                        error: 'Блок button в блоке warning не может находиться перед блоком placeholder на том же или более глубоком уровне вложенности.',
                        location: buttonAndPlaceholderBlocks[i].location
                    }]);
            }
        }
        return result;
    };
    return InvalidButtonPosition;
}(NodeLinterRule));

var InvalidPlaceholderSize = (function (_super) {
    __extends(InvalidPlaceholderSize, _super);
    function InvalidPlaceholderSize(category, code) {
        return _super.call(this, category, code) || this;
    }
    InvalidPlaceholderSize.prototype.lint = function (bemBlock) {
        var _a;
        if (bemBlock.block !== 'warning') {
            return [];
        }
        if (!bemBlock.content || bemBlock.content.blocks.length === 0) {
            return [];
        }
        var placeholderBlocks = bemBlock.content.blocks.filter(function (b) { return b.block === 'placeholder'; });
        if (!placeholderBlocks.length) {
            return [];
        }
        var result = [];
        var etalonSizes = ['s', 'm', 'l'];
        for (var _i = 0, placeholderBlocks_1 = placeholderBlocks; _i < placeholderBlocks_1.length; _i++) {
            var block = placeholderBlocks_1[_i];
            var sizeModValue = (_a = block.mods) === null || _a === void 0 ? void 0 : _a.get('size');
            if (etalonSizes.indexOf(sizeModValue) === -1) {
                result = __spreadArrays(result, [{
                        code: this.code,
                        error: 'Допустимые размеры для блока placeholder в блоке warning (значение модификатора size): s, m, l.',
                        location: block.location
                    }]);
            }
        }
        return result;
    };
    return InvalidPlaceholderSize;
}(NodeLinterRule));

var LinterRules = {
    Grid: {
        TooMuchMarketingBlocks: TooMuchMarketingBlocks
    },
    Text: {
        SeveralH1: SeveralH1,
        InvalidH2Position: InvalidH2Position,
        InvalidH3Position: InvalidH3Position
    },
    Warning: {
        TextSizesShouldBeEqual: TextSizesShouldBeEqual,
        InvalidButtonSize: InvalidButtonSize,
        InvalidButtonPosition: InvalidButtonPosition,
        InvalidPlaceholderSize: InvalidPlaceholderSize
    }
};

var config = {
    WARNING: {
        TEXT_SIZES_SHOULD_BE_EQUAL: LinterRules.Warning.TextSizesShouldBeEqual,
        INVALID_BUTTON_SIZE: LinterRules.Warning.InvalidButtonSize,
        INVALID_BUTTON_POSITION: LinterRules.Warning.InvalidButtonPosition,
        INVALID_PLACEHOLDER_SIZE: LinterRules.Warning.InvalidPlaceholderSize
    },
    TEXT: {
        SEVERAL_H1: LinterRules.Text.SeveralH1,
        INVALID_H2_POSITION: LinterRules.Text.InvalidH2Position,
        INVALID_H3_POSITION: LinterRules.Text.InvalidH3Position
    },
    GRID: {
        TOO_MUCH_MARKETING_BLOCKS: LinterRules.Grid.TooMuchMarketingBlocks
    }
};

var BemBlock = (function () {
    function BemBlock() {
        this.block = '';
    }
    BemBlock.prototype.findNestedBlocks = function (blockNames) {
        var result = [];
        var traverse = function (content) {
            if (!content || !content.blocks || content.blocks.length === 0) {
                return;
            }
            for (var _i = 0, _a = content.blocks; _i < _a.length; _i++) {
                var block = _a[_i];
                if (blockNames.indexOf(block.block) > -1) {
                    result = __spreadArrays(result, [block]);
                }
                traverse(block.content);
            }
        };
        traverse(this.content);
        return result;
    };
    return BemBlock;
}());

var BemBlockArray = (function () {
    function BemBlockArray() {
        this.blocks = [];
    }
    return BemBlockArray;
}());

var AstObjectHelper = (function () {
    function AstObjectHelper() {
    }
    AstObjectHelper.getBlock = function (ast) {
        var _a;
        var block = (_a = ast.children) === null || _a === void 0 ? void 0 : _a.find(function (i) { return i.key.type === 'Identifier' && i.key.value === 'block'; });
        if (block) {
            return block.value.value;
        }
        return '';
    };
    AstObjectHelper.getAstContent = function (ast) {
        var _a;
        var content = (_a = ast.children) === null || _a === void 0 ? void 0 : _a.find(function (i) { return i.key.type === 'Identifier' && i.key.value === 'content'; });
        if (content) {
            return content.value;
        }
        return;
    };
    AstObjectHelper.getModsMap = function (ast, modsProperty) {
        if (modsProperty === void 0) { modsProperty = 'mods'; }
        var _a, _b;
        var mods = (_a = ast.children) === null || _a === void 0 ? void 0 : _a.find(function (i) { return i.key.type === 'Identifier' && i.key.value === modsProperty; });
        if (!mods) {
            return;
        }
        var result = new Map();
        (_b = mods.value.children) === null || _b === void 0 ? void 0 : _b.forEach(function (i) {
            var modName = i.key.value;
            var modValue = i.value.value;
            if (modValue === 'true') {
                result.set(modName, true);
            }
            else if (!isNaN(Number(modValue))) {
                result.set(modName, Number(modValue));
            }
            else {
                result.set(modName, modValue);
            }
        });
        return result;
    };
    AstObjectHelper.getMods = function (ast) {
        return this.getModsMap(ast);
    };
    AstObjectHelper.getElem = function (ast) {
        var _a;
        var elem = (_a = ast.children) === null || _a === void 0 ? void 0 : _a.find(function (i) { return i.key.type === 'Identifier' && i.key.value === 'elem'; });
        if (elem) {
            return elem.value.value;
        }
        return;
    };
    AstObjectHelper.getElemMods = function (ast) {
        return this.getModsMap(ast, 'elemMods');
    };
    AstObjectHelper.getAstMix = function (ast) {
        var _a;
        var mix = (_a = ast.children) === null || _a === void 0 ? void 0 : _a.find(function (i) { return i.key.type === 'Identifier' && i.key.value === 'mix'; });
        if (mix) {
            return mix.value;
        }
        return;
    };
    AstObjectHelper.getLocation = function (node) {
        if (!node.loc) {
            return;
        }
        return {
            start: {
                column: node.loc.start.column,
                line: node.loc.start.line
            },
            end: {
                column: node.loc.end.column,
                line: node.loc.end.line
            }
        };
    };
    return AstObjectHelper;
}());

var jsonToBem = (function (json) {
    var traverse = function (ast) {
        var _a;
        if (!ast) {
            return;
        }
        switch (ast.type) {
            case 'Object': {
                var bemBlock = new BemBlock();
                bemBlock.block = AstObjectHelper.getBlock(ast);
                bemBlock.mods = AstObjectHelper.getMods(ast);
                bemBlock.elem = AstObjectHelper.getElem(ast);
                bemBlock.elemMods = AstObjectHelper.getElemMods(ast);
                bemBlock.content = traverse(AstObjectHelper.getAstContent(ast));
                bemBlock.mix = traverse(AstObjectHelper.getAstMix(ast));
                bemBlock.location = AstObjectHelper.getLocation(ast);
                return bemBlock;
            }
            case 'Array': {
                var bemBlockArr_1 = new BemBlockArray();
                (_a = ast.children) === null || _a === void 0 ? void 0 : _a.forEach(function (astObject) {
                    var _a;
                    (_a = bemBlockArr_1) === null || _a === void 0 ? void 0 : _a.blocks.push(traverse(astObject));
                });
                bemBlockArr_1.location = AstObjectHelper.getLocation((ast));
                return bemBlockArr_1;
            }
        }
        return;
    };
    try {
        var ast = jsonToAst(json);
        return traverse(ast);
    }
    catch (_a) {
        return;
    }
});

var LinterStrategy = (function () {
    function LinterStrategy(configuration) {
        this.rules = [];
        for (var category in configuration) {
            var codes = configuration[category];
            for (var code in codes) {
                var ruleClass = codes[code];
                try {
                    var ruleInstance = ruleClass.prototype.constructor(category, code);
                    this.rules = __spreadArrays(this.rules, [ruleInstance]);
                }
                catch (_a) {
                    return;
                }
            }
        }
    }
    LinterStrategy.getInstance = function (configuration) {
        if (!this.instance) {
            this.instance = new LinterStrategy(configuration);
        }
        return this.instance;
    };
    Object.defineProperty(LinterStrategy.prototype, "nodeLinterRules", {
        get: function () {
            return this.rules.filter(function (i) { return i instanceof NodeLinterRule; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LinterStrategy.prototype, "documentLinterRules", {
        get: function () {
            return this.rules.filter(function (i) { return i instanceof DocumentLinterRule; });
        },
        enumerable: true,
        configurable: true
    });
    LinterStrategy.prototype.lint = function (json) {
        var _this = this;
        var result = [];
        var documentRuleBemMap = new Map();
        var traverse = function (bem) {
            var _a;
            if (!bem) {
                return;
            }
            if (bem instanceof BemBlock) {
                for (var _i = 0, _b = _this.nodeLinterRules; _i < _b.length; _i++) {
                    var rule = _b[_i];
                    result = __spreadArrays(result, rule.lint(bem));
                }
                for (var _c = 0, _d = _this.documentLinterRules; _c < _d.length; _c++) {
                    var rule = _d[_c];
                    if (rule.check(bem)) {
                        if (!documentRuleBemMap.has(rule.code)) {
                            documentRuleBemMap.set(rule.code, []);
                        }
                        (_a = documentRuleBemMap.get(rule.code)) === null || _a === void 0 ? void 0 : _a.push(bem);
                    }
                }
                traverse(bem.content);
                traverse(bem.mix);
            }
            else if (bem instanceof BemBlockArray) {
                var bemBlocks = bem.blocks;
                if (!bemBlocks || !bemBlocks.length) {
                    return;
                }
                for (var _e = 0, bemBlocks_1 = bemBlocks; _e < bemBlocks_1.length; _e++) {
                    var block = bemBlocks_1[_e];
                    traverse(block);
                }
            }
        };
        var bem = jsonToBem(json);
        traverse(bem);
        for (var _i = 0, _a = this.documentLinterRules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (documentRuleBemMap.has(rule.code)) {
                var blocks = documentRuleBemMap.get(rule.code);
                if (blocks) {
                    result = __spreadArrays(rule.lint(blocks), result);
                }
            }
        }
        return result;
    };
    return LinterStrategy;
}());

var lint = function (json) {
    var strategy = LinterStrategy.getInstance(config);
    return strategy.lint(json);
};
global.lint = lint;

export { lint };
