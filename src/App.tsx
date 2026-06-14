import { useState } from 'react';
import './App.css';
import { IDocsData } from './types';
import { ExamplesContext } from './ExamplesContext';
import { Markdown } from './Markdown';
import { Rule } from './Rule';
import { Operator } from './Operator';
import { Function } from './Function';
import { TableOfContents } from './TableOfContents';
import { Comparison } from './Comparison';
import { WorkedExamples } from './WorkedExamples';

function App(props: IDocsData) {
  const [activeExample, updateActiveExample] = useState<string | undefined>();

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
          rules={props.rules}
          operators={props.operators}
          functions={props.functions}
          workedExamples={props.worked_examples}
        />
        <Comparison />
        <WorkedExamples examples={props.worked_examples} />
        <h3 id="rules">Rules</h3>
        <div>
          {props.rules.map((rule) =>
            <Rule {...rule} key={rule.rule.name} />
          )}
        </div>
        {props.operators && props.operators.length > 0 && (
          <>
            <h3 id="operators">Operators</h3>
            <p>Used by the <code>expr</code> rule via its <code>op</code> parameter.</p>
            <div>
              {props.operators.map((operator) =>
                <Operator {...operator} key={operator.operator.alternative} />
              )}
            </div>
          </>
        )}
        {props.functions && props.functions.length > 0 && (
          <>
            <h3 id="functions">Functions</h3>
            <p>Used by the <code>call</code> rule via its <code>name</code> parameter.</p>
            <div>
              {props.functions.map((func) =>
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
