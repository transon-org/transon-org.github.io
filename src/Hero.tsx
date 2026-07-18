import { ExampleEditor } from "./ExampleEditor";
import { IExampleData } from "./types";

// The interactive hero: the same pluck-a-field example the README shows
// statically, live and editable, right under the landing (site-owned
// presentation; the data is the engine's corpus case, so it can't rot).
const HERO_EXAMPLE_NAME = "RecipePluckFieldFromEach";

export function Hero(props: { examples: IExampleData[] }) {
    const example = props.examples.find((e) => e.name === HERO_EXAMPLE_NAME);
    if (!example) {
        return <></>;
    }
    return (
        <section id="try-it">
            <h3>
                <a href="#try-it" className="heading-anchor">Try it now</a>
            </h3>
            <p>
                The example from above, live — edit the template or the input and
                the result updates as you type.
            </p>
            <ExampleEditor {...example} autoScroll={false} />
        </section>
    );
}
