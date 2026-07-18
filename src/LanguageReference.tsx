import { Markdown } from "./Markdown";
import { ILanguageReference, IReferenceSection } from "./types";

// The Template Language Reference (D-20): cross-cutting semantics served by the
// installed engine via `get_language_reference()` (RFC 0008 / R-36) — evaluation
// model, scoping, NO_CONTENT, error taxonomy, expr/call machinery, composition
// patterns. Per-rule behavior stays in the Rules section below. Anchors carry a
// `lang-` prefix so the reference's `error-model` section never collides with
// the error-examples gallery's `#error-model`.

function stripHeading(content: string): string {
    const lines = content.replace(/\r\n?/g, '\n').split('\n');
    if (lines.length > 0 && (lines[0].startsWith('## ') || lines[0].startsWith('# '))) {
        return lines.slice(1).join('\n').trim();
    }
    return content.trim();
}

function ReferenceSection(props: { section: IReferenceSection }) {
    const { section } = props;
    if (!section.title) {
        // The preamble: audience/scope note under the document title.
        return <Markdown>{stripHeading(section.content)}</Markdown>;
    }
    const anchor = `lang-${section.id}`;
    return (
        <section>
            <h4 id={anchor}>
                <a href={`#${anchor}`} className="heading-anchor">{section.title}</a>
            </h4>
            <Markdown>{stripHeading(section.content)}</Markdown>
        </section>
    );
}

export function LanguageReference(props: { reference?: ILanguageReference | null }) {
    const { reference } = props;
    if (!reference || reference.sections.length === 0) {
        return <></>;
    }
    return (
        <section>
            <h3 id="language">
                <a href="#language" className="heading-anchor">Language reference</a>
            </h3>
            {reference.sections.map((section) => (
                <ReferenceSection key={section.id} section={section} />
            ))}
        </section>
    );
}
