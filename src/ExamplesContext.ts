import React from "react";
import { IExampleData } from "./types";

interface IExamplesContextData {
    activeExample?: string;
    updateActiveExample?: (value?: string) => void;
    /** Open the given example in the embedded visual editor (RFC-005). */
    openInEditor?: (example: IExampleData) => void;
}
export const ExamplesContext = React.createContext<IExamplesContextData>({});
