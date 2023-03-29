import { Param } from "./Param";
import { IParamDoc } from "./types";

interface IParamsSectionProps {
    slug: string;
    params: IParamDoc[];
}

export function ParamsSection(props: IParamsSectionProps) {
    if (props.params.length === 0) {
        return <></>;
    }
    return (
        <div className="params-group">
            <h5>Parameters:</h5>
            <div className="params">
                {props.params.map((param) =>
                    <Param
                        {...param}
                        slug={props.slug}
                        key={param.param.name}
                    ></Param>
                )}
            </div>
        </div>
    );
}