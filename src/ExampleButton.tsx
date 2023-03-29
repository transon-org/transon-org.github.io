import { ExamplesContext } from "./ExamplesContext";
import { IExampleData } from "./types";

interface IExampleButtonProps extends IExampleData {
    id: string;
}

export function ExampleButton(props: IExampleButtonProps) {
    return (
        <ExamplesContext.Consumer>
            {context => (
                <>
                    <input
                        type="checkbox"
                        className="btn-check"
                        id={props.id}
                        autoComplete="off"
                        onChange={
                            (e) => {
                                context.updateActiveExample && context.updateActiveExample(e.target.checked ? e.target.id : undefined)
                            }
                        }
                        checked={context.activeExample === props.id}
                    />
                    <label
                        className="btn btn-sm btn-outline-primary mb-1 me-1"
                        htmlFor={props.id}
                    >{props.name}</label>
                </>
            )
            }
        </ExamplesContext.Consumer>
    );
}