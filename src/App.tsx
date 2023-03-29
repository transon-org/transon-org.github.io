import { useState } from 'react';
import './App.css';
import { IDocsData } from './types';
import { ExamplesContext } from './ExamplesContext';
import { Markdown } from './Markdown';
import { Rule } from './Rule';

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
      <p>Homogenous JSON template engine</p>
      <Markdown>{props.doc}</Markdown>
      <h3>Rules</h3>
      <ExamplesContext.Provider value={{
        activeExample: activeExample,
        updateActiveExample: updateActiveExample
      }}>
        <div id="rules">
          {props.rules.map((rule) =>
            <Rule {...rule} key={rule.rule.name} />
          )}
        </div>
      </ExamplesContext.Provider>
    </div>
  );
}

export default App;
