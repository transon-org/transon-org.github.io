import {
    IDocsData,
    IExampleData,
    IResolvedDocs,
} from './types';

/**
 * Resolve the engine's normalized docs document (flat `examples` corpus +
 * name references, Roadmap R-31) into the fully-inlined shape the components
 * render. Unknown names are dropped rather than crashing the page.
 */
export function resolveDocs(docs: IDocsData): IResolvedDocs {
    const byName = new Map<string, IExampleData>(
        (docs.examples ?? []).map((example) => [example.name, example])
    );
    const resolve = (names?: string[]): IExampleData[] =>
        (names ?? []).flatMap((name) => {
            const example = byName.get(name);
            return example ? [example] : [];
        });

    return {
        version: docs.version,
        doc: docs.doc,
        worked_examples: resolve(docs.worked_examples),
        recipes: resolve(docs.recipes),
        errors: docs.errors ?? [],
        rules: docs.rules.map((rule) => ({
            rule: rule.rule,
            examples: resolve(rule.examples),
            params: rule.params.map((param) => ({
                param: param.param,
                examples: resolve(param.examples),
            })),
        })),
        operators: (docs.operators ?? []).map((operator) => ({
            operator: operator.operator,
            examples: resolve(operator.examples),
        })),
        functions: (docs.functions ?? []).map((func) => ({
            function: func.function,
            examples: resolve(func.examples),
        })),
    };
}
