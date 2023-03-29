import { ExampleButton } from "./ExampleButton";
import { ExampleEditor } from "./ExampleEditor";
import { ExamplesContext } from "./ExamplesContext";
import { IExampleData } from "./types";

interface IExampleSectionProps {
    examples: IExampleData[];
    slug: string;
}

export function ExamplesSection(props: IExampleSectionProps) {
    if (props.examples.length === 0) {
        return <></>;
    }
    return (
        <>
            <dl className="examples-buttons-group d-flex mb-0">
                <dt><h6>Examples:</h6></dt>
                <dd className="examples-buttons ms-1 mt-1">
                    {props.examples.map((example) =>
                        <ExampleButton
                            {...example}
                            key={`button-${example.name}`}
                            id={`${props.slug}-${example.name}`}
                        ></ExampleButton>
                    )}
                </dd>
            </dl>
            <ExamplesContext.Consumer>
                {context => (
                    props.examples.map((example) => (
                        context.activeExample === `${props.slug}-${example.name}` ? (
                            <ExampleEditor
                                {...example}
                                key={`editor-${example.name}`}
                            ></ExampleEditor>
                        ) : <></>
                    ))
                )
                }
            </ExamplesContext.Consumer>
        </>
    )
}
