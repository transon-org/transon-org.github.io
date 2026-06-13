import { ExamplesSection } from "./ExamplesSection";
import { Markdown } from "./Markdown";
import { IFunctionDoc } from "./types";

interface IFunctionProps extends IFunctionDoc {
}

export function Function(props: IFunctionProps) {
    const { name, input, output, doc } = props.function;
    const slug = `function-${name}`;
    return (
        <dl className="rule" id={slug}>
            <dt className="border-3 border-start border-info bg-info-subtle py-1 px-2 text-light-emphasis">
                <a href={`#${slug}`} className="heading-anchor"><code>{name}</code></a>
                <span className="text-secondary ms-2 fw-normal">{input} &rarr; {output}</span>
            </dt>
            <dd>
                <div className="mb-1">
                    <Markdown>{doc}</Markdown>
                </div>
                <ExamplesSection
                    slug={`func-${name}`}
                    examples={props.examples}
                ></ExamplesSection>
            </dd>
        </dl>
    );
}
