export interface IExampleData {
    name: string;
    doc?: string;
    template: any;
    data: any;
    result: any;
    tags?: string[];
}

export interface IErrorData {
    name: string;
    doc?: string;
    template: any;
    data: any;
    error: string;
    error_type: string;
    action: string;
}

export interface IParamDefinition {
    name: string;
    doc?: string;
}

export interface IRuleDefinition {
    name: string;
    doc?: string;
}

export interface IOperatorDefinition {
    name: string;
    alternative: string;
    kind: string;
    types: string;
    result: string;
    doc?: string;
}

export interface IFunctionDefinition {
    name: string;
    input: string;
    output: string;
    doc?: string;
}

// Wire shape (engine `get_all_docs()`, Roadmap R-31): one flat `examples`
// corpus; every other `examples` field is a list of name references into it.

export interface IParamDocData {
    param: IParamDefinition;
    examples: string[];
}

export interface IRuleDocData {
    rule: IRuleDefinition;
    examples: string[];
    params: IParamDocData[];
}

export interface IOperatorDocData {
    operator: IOperatorDefinition;
    examples: string[];
}

export interface IFunctionDocData {
    function: IFunctionDefinition;
    examples: string[];
}

export interface IDocsData {
    version?: string;
    doc?: string;
    examples: IExampleData[];
    worked_examples?: string[];
    recipes?: string[];
    errors?: IErrorData[];
    rules: IRuleDocData[];
    operators?: IOperatorDocData[];
    functions?: IFunctionDocData[];
}

// Resolved shape consumed by the components: name references replaced with
// the corpus entries (see `resolveDocs` in `resolve.ts`).

export interface IParamDoc {
    param: IParamDefinition;
    examples: IExampleData[];
}

export interface IRuleDoc {
    rule: IRuleDefinition;
    examples: IExampleData[];
    params: IParamDoc[];
}

export interface IOperatorDoc {
    operator: IOperatorDefinition;
    examples: IExampleData[];
}

export interface IFunctionDoc {
    function: IFunctionDefinition;
    examples: IExampleData[];
}

export interface IResolvedDocs {
    version?: string;
    doc?: string;
    worked_examples: IExampleData[];
    recipes: IExampleData[];
    errors: IErrorData[];
    rules: IRuleDoc[];
    operators: IOperatorDoc[];
    functions: IFunctionDoc[];
}
