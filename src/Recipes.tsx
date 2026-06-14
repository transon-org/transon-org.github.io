import { ExamplesSection } from "./ExamplesSection";
import { IExampleData } from "./types";

interface IRecipesProps {
    recipes?: IExampleData[];
}

export function Recipes(props: IRecipesProps) {
    const recipes = props.recipes ?? [];
    if (recipes.length === 0) {
        return <></>;
    }
    return (
        <section id="recipes">
            <h3>
                <a href="#recipes" className="heading-anchor">Recipes</a>
            </h3>
            <p>
                The reference is organized by primitive — it answers <em>"what does
                rule X do?"</em>. These task-oriented recipes answer the other
                direction — <em>"how do I do Y?"</em> — with a short template for each
                common job. Open one to run and tweak it in the playground.
            </p>
            <ExamplesSection
                slug="recipe"
                examples={recipes}
            ></ExamplesSection>
        </section>
    );
}
