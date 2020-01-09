import {
    createConnection,
    ProposedFeatures,
    TextDocuments,
    TextDocument,
    Diagnostic,
    DiagnosticSeverity,
    DidChangeConfigurationParams
} from 'vscode-languageserver';

import { basename } from 'path';
import * as jsonToAst from 'json-to-ast';
import { ExampleConfiguration, Severity, RuleKeys } from './configuration';
import { makeLint, LinterProblem } from './linter';

let conn = createConnection(ProposedFeatures.all);
let docs = new TextDocuments();
let conf: ExampleConfiguration | undefined = undefined;

conn.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: docs.syncKind
        }
    };
});

function GetSeverity(key: RuleKeys): DiagnosticSeverity | undefined {
    if (!conf || !conf.severity) {
        return undefined;
    }

    const severity: Severity = conf.severity[key];

    switch (severity) {
        case Severity.Error:
            return DiagnosticSeverity.Error;
        case Severity.Warning:
            return DiagnosticSeverity.Warning;
        case Severity.Information:
            return DiagnosticSeverity.Information;
        case Severity.Hint:
            return DiagnosticSeverity.Hint;
        default:
            return undefined;
    }
}

function GetMessage(key: RuleKeys): string {
    if (key === RuleKeys.BlockNameIsRequired) {
        return 'Field named \'block\' is required!';
    }

    if (key === RuleKeys.UppercaseNamesIsForbidden) {
        return 'Uppercase properties are forbidden!';
    }

    return `Unknown problem type '${key}'`;
}

async function validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
    const documentName = basename(textDocument.uri);

    const validateObject = (obj: jsonToAst.AstObject): LinterProblem<RuleKeys>[] => {
        return obj.children.some(p => p.key.value === 'block')
            ? []
            : [{
                key: RuleKeys.BlockNameIsRequired,
                loc: obj.loc
            }];
    };

    const validateProperty = (property: jsonToAst.AstProperty): LinterProblem<RuleKeys>[] => {
        return /^[A-Z]+$/.test(property.key.value)
            ? [{
                key: RuleKeys.UppercaseNamesIsForbidden,
                loc: property.loc
            }]
            : [];
    };

    const diagnostics: Diagnostic[] = makeLint(
        textDocument.getText(),
        validateProperty,
        validateObject
    ).reduce(
        (
            list: Diagnostic[],
            problem: LinterProblem<RuleKeys>
        ): Diagnostic[] => {
            const severity = GetSeverity(problem.key);

            if (severity) {
                const message = GetMessage(problem.key);

                let diagnostic: Diagnostic = {
                    range: {
                        start: textDocument.positionAt(problem.loc.start.offset),
                        end: textDocument.positionAt(problem.loc.end.offset)
                    },
                    severity,
                    message,
                    source : documentName
                };

                list.push(diagnostic);
            }

            return list;
        },
        []
    );

    return diagnostics;
}

async function validateAll() {
    for (const document of docs.all()) {
        const diagnostics = await validateTextDocument(document);
        conn.sendDiagnostics({
            uri: document.uri,
            diagnostics
        });
    }
}

docs.onDidChangeContent(async (change) => {
    const diagnostics = await validateTextDocument(change.document);
    conn.sendDiagnostics({
        uri: change.document.uri,
        diagnostics
    });
});

conn.onDidChangeConfiguration(({ settings }: DidChangeConfigurationParams) => {
    conf = settings.example;
    validateAll();
});

docs.listen(conn);
conn.listen();
