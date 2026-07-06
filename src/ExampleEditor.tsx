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

    // Bring the just-opened example into view ONCE, immediately on open (no debounce), and only when
    // it opened largely below the fold — e.g. the button was near the bottom, so the whole example
    // would otherwise be off-screen. We align its TOP (`block: "start"`): the top is a stable target
    // (the three panels reserve fixed height), so there's no delayed re-scroll / jump like the old
    // debounced `block: "end"` had. An already-visible example doesn't move.
    useEffect(() => {
        const el = ref.current;
        if (el && el.getBoundingClientRect().top > window.innerHeight * 0.5) {
            el.scrollIntoView({ block: "start", behavior: "smooth" });
        }
        // Run once, on open.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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