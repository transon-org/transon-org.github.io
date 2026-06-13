import { ExamplesSection } from "./ExamplesSection";
import { Markdown } from "./Markdown";
import { ParamsSection } from "./ParamsSection";
import { IRuleDoc } from "./types";

interface IRuleProps extends IRuleDoc {
}

export function Rule(props: IRuleProps) {
    const slug = `rule-${props.rule.name}`;
    return (
        <dl className="rule" id={slug}>
            <dt className="border-3 border-start border-info bg-info-subtle py-1 px-2 text-light-emphasis">
                <a href={`#${slug}`} className="heading-anchor">{props.rule.name}</a>
            </dt>
            <dd>
                <div className="mb-1">
                    <Markdown>{props.rule.doc}</Markdown>
                </div>
                <ExamplesSection
                    slug={props.rule.name}
                    examples={props.examples}
                ></ExamplesSection>
                <ParamsSection
                    slug={props.rule.name}
                    params={props.params}
                ></ParamsSection>
            </dd>
        </dl>
    );
}