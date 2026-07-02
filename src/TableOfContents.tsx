import { IResolvedDocs } from './types';

type ITableOfContentsProps = Pick<IResolvedDocs, 'rules' | 'operators' | 'functions'> & {
    workedExamples?: IResolvedDocs['worked_examples'];
    recipes?: IResolvedDocs['recipes'];
    errors?: IResolvedDocs['errors'];
};

export function TableOfContents(props: ITableOfContentsProps) {
    const { rules, operators, functions, workedExamples, recipes, errors } = props;
    return (
        <nav className="toc mb-3" aria-label="Reference index">
            <h3>Reference</h3>
            <div className="toc-section">
                <a href="#comparison" className="toc-heading">Comparison</a>
            </div>
            {workedExamples && workedExamples.length > 0 && (
                <div className="toc-section">
                    <a href="#worked-examples" className="toc-heading">Worked examples</a>
                </div>
            )}
            {recipes && recipes.length > 0 && (
                <div className="toc-section">
                    <a href="#recipes" className="toc-heading">Recipes</a>
                </div>
            )}
            {errors && errors.length > 0 && (
                <div className="toc-section">
                    <a href="#error-model" className="toc-heading">Error model</a>
                </div>
            )}
            <div className="toc-section">
                <a href="#rules" className="toc-heading">Rules</a>
                {rules.map((rule) =>
                    <a
                        key={rule.rule.name}
                        href={`#rule-${rule.rule.name}`}
                        className="toc-link"
                    >{rule.rule.name}</a>
                )}
            </div>
            {operators && operators.length > 0 && (
                <div className="toc-section">
                    <a href="#operators" className="toc-heading">Operators</a>
                    {operators.map((operator) =>
                        <a
                            key={operator.operator.alternative}
                            href={`#operator-${operator.operator.alternative}`}
                            className="toc-link"
                        >{operator.operator.name}</a>
                    )}
                </div>
            )}
            {functions && functions.length > 0 && (
                <div className="toc-section">
                    <a href="#functions" className="toc-heading">Functions</a>
                    {functions.map((func) =>
                        <a
                            key={func.function.name}
                            href={`#function-${func.function.name}`}
                            className="toc-link"
                        >{func.function.name}</a>
                    )}
                </div>
            )}
        </nav>
    );
}
