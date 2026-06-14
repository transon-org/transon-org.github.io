import { ExamplesSection } from "./ExamplesSection";
import { IExampleData } from "./types";

interface IWorkedExamplesProps {
    examples?: IExampleData[];
}

export function WorkedExamples(props: IWorkedExamplesProps) {
    const examples = props.examples ?? [];
    if (examples.length === 0) {
        return <></>;
    }
    return (
        <section id="worked-examples">
            <h3>
                <a href="#worked-examples" className="heading-anchor">Worked examples</a>
            </h3>
            <p>
                The reference below documents each rule on its own. These end-to-end
                examples show how the primitives <em>compose</em> — transon's headline
                strength — into realistic transformations. Open one to run and tweak it
                in the playground.
            </p>
            <ExamplesSection
                slug="worked-example"
                examples={examples}
            ></ExamplesSection>
        </section>
    );
}
