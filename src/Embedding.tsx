import { Markdown } from "./Markdown";

// Embedding page (D-20): the engine's `get_all_docs()['doc']` field — since
// RFC 0008 the slimmed, embedder-facing narrative (Python API usage +
// extending) — rendered as its own section instead of the page intro.

export function Embedding(props: { doc?: string }) {
    if (!props.doc) {
        return <></>;
    }
    return (
        <section>
            <h3 id="embedding">
                <a href="#embedding" className="heading-anchor">Embedding (Python API)</a>
            </h3>
            <Markdown>{props.doc}</Markdown>
        </section>
    );
}
