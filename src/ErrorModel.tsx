import { Markdown } from "./Markdown";
import { CodeBlock } from "./CodeBlock";
import { IErrorData } from "./types";

interface IErrorModelProps {
    errors?: IErrorData[];
}

function ErrorCase(props: { error: IErrorData }) {
    const { error } = props;
    return (
        <div className="error-case">
            <Markdown>{error.doc}</Markdown>
            <p className="mb-1">Template:</p>
            <CodeBlock language="json">{JSON.stringify(error.template, null, 2)}</CodeBlock>
            {error.action === "validate" ? (
                <p>
                    Checked statically with <code>validate()</code> — no input data
                    needed.
                </p>
            ) : (
                <>
                    <p className="mb-1">Input:</p>
                    <CodeBlock language="json">{JSON.stringify(error.data, null, 2)}</CodeBlock>
                </>
            )}
            <p className="mb-1">Raises <code>{error.error_type}</code>:</p>
            <CodeBlock language="text">{error.error}</CodeBlock>
        </div>
    );
}

export function ErrorModel(props: IErrorModelProps) {
    const errors = props.errors ?? [];
    if (errors.length === 0) {
        return <></>;
    }
    return (
        <section id="error-model">
            <h3>
                <a href="#error-model" className="heading-anchor">Error model</a>
            </h3>
            <p>
                transon raises two kinds of error: <code>DefinitionError</code> for a
                malformed template, and <code>TransformationError</code> for input data
                that doesn't fit. Every message ends with the template path where the
                problem occurred (<code>at template → …</code>), so you can match a
                failure you hit against the literal text below.
            </p>
            <dl className="error-model">
                {errors.map((error) => (
                    <ErrorCase error={error} key={error.name} />
                ))}
            </dl>
        </section>
    );
}
