import { useMemo, useState } from 'react';
import './App.css';
import { IDocsData } from './types';
import { resolveDocs } from './resolve';
import { ExamplesContext } from './ExamplesContext';
import { Markdown } from './Markdown';
import { Rule } from './Rule';
import { Operator } from './Operator';
import { Function } from './Function';
import { TableOfContents } from './TableOfContents';
import { Comparison } from './Comparison';
import { WorkedExamples } from './WorkedExamples';
import { Recipes } from './Recipes';
import { ErrorModel } from './ErrorModel';

function App(props: IDocsData) {
  const [activeExample, updateActiveExample] = useState<string | undefined>();
  // Engine docs arrive normalized (flat example corpus + name references,
  // Roadmap R-31); resolve once into the inlined shape the components render.
  const docs = useMemo(() => resolveDocs(props), [props]);

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
          props.version && (
            <u>version <b>{props.version}</b></u>
          )
        }
      </p>
      <Markdown>{props.doc}</Markdown>
      <ExamplesContext.Provider value={{
        activeExample: activeExample,
        updateActiveExample: updateActiveExample
      }}>
        <TableOfContents
          rules={docs.rules}
          operators={docs.operators}
          functions={docs.functions}
          workedExamples={docs.worked_examples}
          recipes={docs.recipes}
          errors={docs.errors}
        />
        <Comparison />
        <WorkedExamples examples={docs.worked_examples} />
        <Recipes recipes={docs.recipes} />
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
      </ExamplesContext.Provider>
    </div>
  );
}

export default App;
