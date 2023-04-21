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

export interface IDocsData {
    version?: string;
    doc?: string;
    rules: IRuleDoc[];
}