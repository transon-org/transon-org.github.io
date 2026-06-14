import { Markdown } from "./Markdown";
import { IErrorData } from "./types";

interface IErrorModelProps {
    errors?: IErrorData[];
}

function buildErrorMarkdown(error: IErrorData): string {
    const template = JSON.stringify(error.template, null, 2);
    const parts = [
        error.doc ?? "",
        "",
        "Template:",
        "",
        "```json",
        template,
        "```",
    ];
    if (error.action === "validate") {
        parts.push(
            "",
            "Checked statically with `validate()` — no input data needed.",
        );
    } else {
        parts.push(
            "",
            "Input:",
            "",
            "```json",
            JSON.stringify(error.data, null, 2),
            "```",
        );
    }
    parts.push(
        "",
        `Raises \`${error.error_type}\`:`,
        "",
        "```text",
        error.error,
        "```",
    );
    return parts.join("\n");
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
                    <div className="error-case" key={error.name}>
                        <Markdown>{buildErrorMarkdown(error)}</Markdown>
                    </div>
                ))}
            </dl>
        </section>
    );
}
