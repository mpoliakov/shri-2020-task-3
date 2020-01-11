import LinterProblem from './linter-problem';
export default class LinterStrategy {
    private static instance;
    static getInstance(configuration: object): LinterStrategy;
    private readonly rules;
    private get nodeLinterRules();
    private get documentLinterRules();
    private constructor();
    lint(json: string): LinterProblem[];
}
