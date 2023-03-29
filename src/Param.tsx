import { ExamplesSection } from "./ExamplesSection";
import { Markdown } from "./Markdown";
import { IParamDoc } from "./types";

interface IParamProps extends IParamDoc {
    slug: string;
}

export function Param(props: IParamProps) {
    return (
        <dl className="param">
            <dt className="border-2 border-top border-secondary bg-secondary-subtle py-1 px-2 text-light-emphasis">{props.param.name}</dt>
            <dd>
                <div className="mb-1">
                    <Markdown>{props.param.doc}</Markdown>
                </div>
                <ExamplesSection
                    slug={`${props.slug}-${props.param.name}`}
                    examples={props.examples}
                ></ExamplesSection>
            </dd>
        </dl>
    );
}