import { ExamplesSection } from "./ExamplesSection";
import { Markdown } from "./Markdown";
import { IOperatorDoc } from "./types";

interface IOperatorProps extends IOperatorDoc {
}

export function Operator(props: IOperatorProps) {
    const { name, alternative, kind, types, result, doc } = props.operator;
    return (
        <dl className="rule">
            <dt className="border-3 border-start border-info bg-info-subtle py-1 px-2 text-light-emphasis">
                <code>{name}</code>
                <span className="text-secondary"> / </span>
                <code>{alternative}</code>
                <span className="badge bg-secondary ms-2">{kind}</span>
                <span className="text-secondary ms-2 fw-normal">{types} &rarr; {result}</span>
            </dt>
            <dd>
                <div className="mb-1">
                    <Markdown>{doc}</Markdown>
                </div>
                <ExamplesSection
                    slug={`op-${alternative}`}
                    examples={props.examples}
                ></ExamplesSection>
            </dd>
        </dl>
    );
}
