import {
    createConnection,
    ProposedFeatures,
    TextDocuments,
    TextDocument,
    Diagnostic,
    DiagnosticSeverity,
    DidChangeConfigurationParams,
    Position
} from 'vscode-languageserver';

import { basename } from 'path';
import { InitialConfiguration, Severity, getLinterProblemCode } from './configuration';
import { lint } from './linter/linter';
import LinterProblem from './linter/linter-problem';

const conn = createConnection(ProposedFeatures.all);
const docs = new TextDocuments();
let conf: InitialConfiguration | undefined = undefined;

conn.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: docs.syncKind
        }
    };
});

function GetSeverity(code: string): DiagnosticSeverity | undefined {
    if (!conf || !conf.severity) {
        return undefined;
    }

    const linterProblemCode = getLinterProblemCode(code);
    if (!linterProblemCode) {
        return undefined;
    }

    if ((conf.severity)[linterProblemCode] === undefined) {
        return undefined;
    }

    const severity: Severity = (conf.severity)[linterProblemCode];

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

async function validateTextDocument(textDocument: TextDocument): Promise<Diagnostic[]> {
    const documentName = basename(textDocument.uri);

    const diagnostics: Diagnostic[] = lint(textDocument.getText()).reduce(
        (
            list: Diagnostic[],
            problem: LinterProblem
            ): Diagnostic[] => {
            
            const severity = GetSeverity(problem.code);

            if (!severity) {
                return list;
            }

            const message = problem.error;
            const start = Position.create(problem.location.start.line - 1, problem.location.start.column - 1);
            const end = Position.create(problem.location.end.line - 1, problem.location.end.column - 1);

            list.push({
                range: {
                    start,
                    end
                },
                severity,
                message,
                source : documentName
            });

            return list;
        },
        []
    );

    return diagnostics;
}

async function validateAll(): Promise<void> {
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

docs.onDidClose((change) => {
    conn.sendDiagnostics({
        uri: change.document.uri,
        diagnostics: []
    });
});

conn.onDidChangeConfiguration(({ settings }: DidChangeConfigurationParams) => {
    conf = settings.example;
    validateAll();
});

docs.listen(conn);
conn.listen();
