export interface IExampleData {
    name: string;
    doc?: string;
    template: any;
    data: any;
    result: any;
}

export interface IParamDefinition {
    name: string;
    doc?: string;
}

export interface IParamDoc {
    param: IParamDefinition;
    examples: IExampleData[];
}

export interface IRuleDefinition {
    name: string;
    doc?: string;
}

export interface IRuleDoc {
    rule: IRuleDefinition;
    examples: IExampleData[];
    params: IParamDoc[];
}

export interface IOperatorDefinition {
    name: string;
    alternative: string;
    kind: string;
    types: string;
    result: string;
    doc?: string;
}

export interface IOperatorDoc {
    operator: IOperatorDefinition;
    examples: IExampleData[];
}

export interface IFunctionDefinition {
    name: string;
    input: string;
    output: string;
    doc?: string;
}

export interface IFunctionDoc {
    function: IFunctionDefinition;
    examples: IExampleData[];
}

export interface IDocsData {
    version?: string;
    doc?: string;
    worked_examples?: IExampleData[];
    recipes?: IExampleData[];
    rules: IRuleDoc[];
    operators?: IOperatorDoc[];
    functions?: IFunctionDoc[];
}