import React from "react";

interface IExamplesContextData {
    activeExample?: string;
    updateActiveExample?: (value?: string) => void;
}
export const ExamplesContext = React.createContext<IExamplesContextData>({});
