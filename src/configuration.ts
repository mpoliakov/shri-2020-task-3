export enum LinterProblemCode {
    warningTextSizesShouldBeEqual = 'warningTextSizesShouldBeEqual',
    warningInvalidButtonSize = 'warningInvalidButtonSize',
    warningInvalidButtonPosition = 'warningInvalidButtonPosition',
    warningInvalidPlaceholderSize = 'warningInvalidPlaceholderSize',
    textSeveralH1 = 'textSeveralH1',
    textInvalidH2Position = 'textInvalidH2Position',
    textInvalidH3Position = 'textInvalidH3Position',
    gridTooMuchMarketingBlocks = 'gridTooMuchMarketingBlocks'
}

export const getLinterProblemCode = (code: string): LinterProblemCode | undefined => {
    switch (code) {
        case 'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL':
            return LinterProblemCode.warningTextSizesShouldBeEqual;
        case 'WARNING.INVALID_BUTTON_SIZE':
            return LinterProblemCode.warningInvalidButtonSize;
        case 'WARNING.INVALID_BUTTON_POSITION':
            return LinterProblemCode.warningInvalidButtonPosition;
        case 'WARNING.INVALID_PLACEHOLDER_SIZE':
            return LinterProblemCode.warningInvalidPlaceholderSize;
        case 'TEXT.SEVERAL_H1':
            return LinterProblemCode.textSeveralH1;
        case 'TEXT.INVALID_H2_POSITION':
            return LinterProblemCode.textInvalidH2Position;
        case 'TEXT.INVALID_H3_POSITION':
            return LinterProblemCode.textInvalidH3Position;
        case 'GRID.TOO_MUCH_MARKETING_BLOCKS':
            return LinterProblemCode.gridTooMuchMarketingBlocks;
        default:
            return undefined;
    }
};

export enum Severity {
    Error = "Error",
    Warning = "Warning",
    Information = "Information",
    Hint = "Hint",
    None = "None"
}

export interface SeverityConfiguration {
    [LinterProblemCode.warningTextSizesShouldBeEqual]: Severity;
    [LinterProblemCode.warningInvalidButtonSize]: Severity;
    [LinterProblemCode.warningInvalidButtonPosition]: Severity;
    [LinterProblemCode.warningInvalidPlaceholderSize]: Severity;
    [LinterProblemCode.textSeveralH1]: Severity;
    [LinterProblemCode.textInvalidH2Position]: Severity;
    [LinterProblemCode.textInvalidH3Position]: Severity;
    [LinterProblemCode.gridTooMuchMarketingBlocks]: Severity;
}

export interface InitialConfiguration {
    enable: boolean;
    severity: SeverityConfiguration;
}
