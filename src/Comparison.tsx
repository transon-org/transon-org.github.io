import { Markdown } from "./Markdown";
import COMPARISON_MD from "./Comparison.md";

export function Comparison() {
    return (
        <section>
            <h3 id="comparison">
                <a href="#comparison" className="heading-anchor">transon vs. alternatives</a>
            </h3>
            <Markdown>{COMPARISON_MD}</Markdown>
        </section>
    );
}
