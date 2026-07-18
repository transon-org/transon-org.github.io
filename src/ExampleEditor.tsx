import Editor from "@monaco-editor/react";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Markdown } from "./Markdown";
import { ExamplesContext } from "./ExamplesContext";
import { IExampleData } from "./types";

interface IExampleEditorProps extends IExampleData {
    // The scroll-into-view-on-mount behavior suits click-opened examples; the
    // always-open landing Hero opts out so page load isn't scroll-hijacked.
    autoScroll?: boolean;
}

export function ExampleEditor(props: IExampleEditorProps) {
    const { openInEditor } = useContext(ExamplesContext);
    const ref = useRef<HTMLDivElement>(null);
    const monacoInputRef = useRef(null);
    const monacoTemplateRef = useRef(null);
    const monacoResultRef = useRef(null);
    const [left, updateLeft] = useState<number | undefined>();
    const [inputData, updateInputData] = useState<string | undefined>(JSON.stringify(props.data, null, 2));
    const [template, updateTemplate] = useState<string | undefined>(JSON.stringify(props.template, null, 2));
    const [outputResult, updateOutputResult] = useState<string | undefined>(JSON.stringify(props.result, null, 2));

    // Keep the newly-opened example pinned to the BOTTOM of the viewport — the original, correct end
    // state: the whole example is in view AND the clicked example button stays visible just above it.
    // Two things this has to survive, which the old 500ms-debounced smooth scroll handled clumsily
    // (it opened, paused, then "jumped" a second later):
    //  - a "smooth"/"auto" scroll inherits the page's `scroll-behavior: smooth` and animates over
    //    ~1s, and gets interrupted mid-animation — so it lands short;
    //  - async content ABOVE the example (docs diagram images) finishes loading in the first few
    //    hundred ms and pushes the example down after a single scroll.
    // So: re-align INSTANTLY every frame for a short settle window, and bail the moment the user
    // scrolls, so we never fight them. Instant re-aligns are imperceptible; the example simply stays
    // put as the page settles. ("instant" is a valid runtime ScrollBehavior; TS 4.9's lib predates it.)
    useEffect(() => {
        if (props.autoScroll === false) return;
        const el = ref.current;
        if (!el) return;
        // Pin the example to the BOTTOM of the viewport (the original, correct end state: whole
        // example in view, clicked button still visible above it). This has to survive the layout
        // settling in the first few hundred ms (the header/Monaco panels reserving their height, and
        // async diagram images ABOVE the example loading and pushing it down). So re-align INSTANTLY
        // each frame for a short window — instant re-aligns are imperceptible, so the example just
        // "stays put" instead of the old smooth scroll that opened, paused, then jumped a second
        // later. Bail the instant the user scrolls, so we never fight them.
        // ("instant" is a valid runtime ScrollBehavior; TS 4.9's DOM lib predates it — hence the cast.)
        let raf = 0;
        let userScrolled = false;
        const onUserScroll = () => { userScrolled = true; };
        window.addEventListener("wheel", onUserScroll, { passive: true });
        window.addEventListener("touchstart", onUserScroll, { passive: true });
        window.addEventListener("keydown", onUserScroll);
        const start = performance.now();
        const align = () => {
            if (userScrolled) return;
            el.scrollIntoView({ block: "end", behavior: "instant" as ScrollBehavior });
            if (performance.now() - start < 700) raf = requestAnimationFrame(align);
        };
        align();
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("wheel", onUserScroll);
            window.removeEventListener("touchstart", onUserScroll);
            window.removeEventListener("keydown", onUserScroll);
        };
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