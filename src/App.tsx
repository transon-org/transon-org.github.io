import { useMemo, useState } from 'react';
import './App.css';
import { IExampleData, IInitPayload } from './types';
import { resolveDocs } from './resolve';
import { ExamplesContext } from './ExamplesContext';
import { EditorView } from './EditorView';
import { createSharedPyScriptEngine } from './transonEngine';
import { Rule } from './Rule';
import { Operator } from './Operator';
import { Function } from './Function';
import { TableOfContents } from './TableOfContents';
import { Landing } from './Landing';
import { Hero } from './Hero';
import { LanguageReference } from './LanguageReference';
import { Embedding } from './Embedding';
import { WorkedExamples } from './WorkedExamples';
import { Recipes } from './Recipes';
import { ErrorModel } from './ErrorModel';

function App(props: IInitPayload) {
  const [activeExample, updateActiveExample] = useState<string | undefined>();
  // The example currently opened in the embedded visual editor (RFC-005), or null for the docs view.
  const [editorExample, setEditorExample] = useState<IExampleData | null>(null);
  // One EngineProvider over the shared PyScript runtime, created once (never re-inits Pyodide).
  const engine = useMemo(() => createSharedPyScriptEngine(), []);
  // Engine docs arrive normalized (flat example corpus + name references,
  // Roadmap R-31); resolve once into the inlined shape the components render.
  const docs = useMemo(() => resolveDocs(props.docs), [props.docs]);

  if (editorExample) {
    return (
      <EditorView
        engine={engine}
        example={editorExample}
        docs={props.docs}
        onBack={() => setEditorExample(null)}
      />
    );
  }

  return (
    <div className="container">
      <figure>
        <blockquote className="blockquote">
          <h1>Transon</h1>
        </blockquote>
        <figcaption className="blockquote-footer">
          <u>tran</u>sforms j<u>son</u>
        </figcaption>
      </figure>
      <p>
        <span>Homogeneous JSON template engine </span>
        {
          props.docs.version && (
            <u>version <b>{props.docs.version}</b></u>
          )
        }
      </p>
      {/* D-20: landing from the engine README (pitch owner); the Language
          Reference and the Embedding page come from the same installed engine. */}
      <Landing readme={props.readme} />
      <ExamplesContext.Provider value={{
        activeExample: activeExample,
        updateActiveExample: updateActiveExample,
        openInEditor: setEditorExample
      }}>
        <Hero examples={props.docs.examples} />
        <TableOfContents
          rules={docs.rules}
          operators={docs.operators}
          functions={docs.functions}
          workedExamples={docs.worked_examples}
          recipes={docs.recipes}
          errors={docs.errors}
          reference={props.reference}
          hasEmbedding={Boolean(props.docs.doc)}
        />
        {/* Learning order: examples first, semantics after (newcomer funnel). */}
        <WorkedExamples examples={docs.worked_examples} />
        <Recipes recipes={docs.recipes} />
        <LanguageReference reference={props.reference} />
        <ErrorModel errors={docs.errors} />
        <h3 id="rules">Rules</h3>
        <div>
          {docs.rules.map((rule) =>
            <Rule {...rule} key={rule.rule.name} />
          )}
        </div>
        {docs.operators.length > 0 && (
          <>
            <h3 id="operators">Operators</h3>
            <p>Used by the <code>expr</code> rule via its <code>op</code> parameter.</p>
            <div>
              {docs.operators.map((operator) =>
                <Operator {...operator} key={operator.operator.alternative} />
              )}
            </div>
          </>
        )}
        {docs.functions.length > 0 && (
          <>
            <h3 id="functions">Functions</h3>
            <p>Used by the <code>call</code> rule via its <code>name</code> parameter.</p>
            <div>
              {docs.functions.map((func) =>
                <Function {...func} key={func.function.name} />
              )}
            </div>
          </>
        )}
        <Embedding doc={props.docs.doc} />
      </ExamplesContext.Provider>
    </div>
  );
}

export default App;
