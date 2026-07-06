import Editor from "@monaco-editor/react";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Markdown } from "./Markdown";
import { ExamplesContext } from "./ExamplesContext";
import { IExampleData } from "./types";

export function ExampleEditor(props: IExampleData) {
    const { openInEditor } = useContext(ExamplesContext);
    const ref = useRef<HTMLDivElement>(null);
    const monacoInputRef = useRef(null);
    const monacoTemplateRef = useRef(null);
    const monacoResultRef = useRef(null);
    const [left, updateLeft] = useState<number | undefined>();
    const [inputData, updateInputData] = useState<string | undefined>(JSON.stringify(props.data, null, 2));
    const [template, updateTemplate] = useState<string | undefined>(JSON.stringify(props.template, null, 2));
    const [outputResult, updateOutputResult] = useState<string | undefined>(JSON.stringify(props.result, null, 2));

    // No auto-scroll: the example renders right below the clicked button, so it's already in view.
    // The previous debounced scrollIntoView fired ~500ms after opening (and re-targeted a
    // still-settling, taller-than-viewport panel), which read as a delayed "jump".

    const clientWidth = document.documentElement.clientWidth;

    // Measure the container offset BEFORE paint (useLayoutEffect) so the full-bleed panel renders in
    // its final position on the first painted frame — no empty-placeholder → content flash / jump.
    useLayoutEffect(() => {
        updateLeft(ref.current?.offsetLeft);
    }, [ref.current?.offsetLeft, clientWidth])

    useEffect(() => {
        if (template && inputData) {
            updateOutputResult(globalThis.transform(template, inputData))
        }
    }, [inputData, template])

    return (
        <div ref={ref} style={{
            minHeight: "50vh"
        }}>
            {left !== undefined ? (
                <div className="bg-dark text-white py-4 mb-4" style={{
                    position: "relative",
                    left: `-${left}px`,
                    width: `${clientWidth}px`,
                }}>
                    <div className="row p-2 m-0">
                        <div className="col col-12">
                            <div className="d-flex align-items-center justify-content-between gap-3">
                                <h2 className="mb-0">{props.name}</h2>
                                {openInEditor && (
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary flex-shrink-0"
                                        onClick={() => openInEditor(props)}
                                    >
                                        Open in Visual Editor
                                    </button>
                                )}
                            </div>
                            <Markdown>{props.doc}</Markdown>
                        </div>
                    </div>
                    <div className="row p-2 m-0">
                        <div className="col col-4">
                            <center>input</center>
                            <Editor
                                height="50vh"
                                defaultLanguage="json"
                                theme="vs-dark"
                                value={inputData}
                                onChange={(value, event) => updateInputData(value)}
                                onMount={(monaco) => { monacoInputRef.current = monaco }}
                            />
                        </div>
                        <div className="col col-4">
                            <center>template</center>
                            <Editor
                                height="50vh"
                                defaultLanguage="json"
                                theme="vs-dark"
                                value={template}
                                onChange={(value, event) => updateTemplate(value)}
                                onMount={(monaco) => { monacoTemplateRef.current = monaco }}
                            />
                        </div>
                        <div className="col col-4">
                            <center>result</center>
                            <Editor
                                height="50vh"
                                defaultLanguage="json"
                                theme="vs-dark"
                                value={outputResult}
                                options={{
                                    readOnly: true,
                                }}
                                onMount={(monaco) => { monacoResultRef.current = monaco }}
                            />
                        </div>
                    </div>
                </div>
            ) : <></>
            }
        </div>
    )
}