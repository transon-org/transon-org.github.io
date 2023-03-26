import React, { useRef, useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import Editor from "@monaco-editor/react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'
import './App.css';
import { IDocsData, IExampleData, IParamDoc, IRuleDoc } from './types';


function useDebounce(value: any, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}

interface IExamplesContextData {
  activeExample?: string;
  updateActiveExample?: (value?: string) => void;
}
export const ExamplesContext = React.createContext<IExamplesContextData>({});

interface IExampleButtonProps extends IExampleData {
  id: string;
}

function ExampleButton(props: IExampleButtonProps) {
  return (
    <ExamplesContext.Consumer>
      {
        context => (
          <>
            <input 
              type="checkbox" 
              className="btn-check" 
              id={props.id} 
              autoComplete="off"
              onChange={
                (e) => {
                  context.updateActiveExample && context.updateActiveExample(e.target.checked ? e.target.id : undefined)
                }
              }
              checked={context.activeExample === props.id}
            />
            <label 
              className="btn btn-sm btn-outline-primary mb-1 me-1" 
              htmlFor={props.id}
            >{props.name}</label>
          </>
        )
      }
    </ExamplesContext.Consumer>
  );
}

function ExampleEditor(props: IExampleData) {
  const ref = useRef<HTMLDivElement>(null);
  const monacoInputRef = useRef(null);
  const monacoTemplateRef = useRef(null);
  const monacoResultRef = useRef(null);
  const [left, updateLeft] = useState<number | undefined>();
  const [inputData, updateInputData] = useState<string | undefined>(JSON.stringify(props.data, null, 2));
  const [template, updateTemplate] = useState<string | undefined>(JSON.stringify(props.template, null, 2));
  const [outputResult, updateOutputResult] = useState<string | undefined>(JSON.stringify(props.result, null, 2));

  const debouncedRef = useDebounce(ref.current, 500);

  useEffect(() => {
    ref.current?.scrollIntoView({
      block: "end",
      behavior: "smooth",
    })
  }, [debouncedRef]);

  const clientWidth = document.documentElement.clientWidth;

  useEffect(() => {
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
      {
        left !== undefined ? (
          <div className="bg-dark text-white py-4 mb-4" style={{
            position: "relative",
            left: `-${left}px`,
            width: `${clientWidth}px`,
          }}>
            <div className="row p-2 m-0">
              <div className="col col-12">
                <h2>{props.name}</h2>
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
                  onMount={(monaco) => {monacoInputRef.current = monaco}}
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
                  onMount={(monaco) => {monacoTemplateRef.current = monaco}}
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
                  onMount={(monaco) => {monacoResultRef.current = monaco}}
                />
              </div>
            </div>
          </div>
        ): <></>
      }
    </div>
  )
}

interface IExampleSectionProps {
  examples: IExampleData[];
  slug: string;
}

function ExamplesSection(props: IExampleSectionProps) {
  if (props.examples.length === 0) {
    return <></>;
  }
  return (
    <>
      <dl className="examples-buttons-group d-flex mb-0">
        <dt><h6>Examples:</h6></dt>
        <dd className="examples-buttons ms-1 mt-1">
          {props.examples.map((example) => 
            <ExampleButton 
              {...example}
              key={`button-${example.name}`}
              id={`${props.slug}-${example.name}`}
            ></ExampleButton>
          )}
        </dd>
      </dl>
      <ExamplesContext.Consumer>
        {
          context => (
            props.examples.map((example) => (
              context.activeExample === `${props.slug}-${example.name}` ? (
                <ExampleEditor 
                  {...example}
                  key={`editor-${example.name}`}
                ></ExampleEditor>
              ): <></>
            ))
          )
        }
      </ExamplesContext.Consumer>
    </>
  )
}

interface IParamProps extends IParamDoc {
  slug: string;
}

function Param(props: IParamProps) {
  return (
    <dl className="param">
      <dt className="border-2 border-top border-secondary bg-secondary-subtle py-1 px-2 text-light-emphasis">{props.param.name}</dt>
      <dd>
          <div className="mb-1">
            <Markdown>{props.param.doc}</Markdown>
          </div>
          <ExamplesSection
            slug={`${props.slug}-${props.param.name}`}
            examples={props.examples}
          ></ExamplesSection>
      </dd>
    </dl>
  );
}

interface IParamsSectionProps {
  slug: string;
  params: IParamDoc[];
}

function ParamsSection(props: IParamsSectionProps) {
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

interface IRuleProps extends IRuleDoc {
}

function Rule(props: IRuleProps) {
  return (
    <dl className="rule">
      <dt className="border-3 border-start border-info bg-info-subtle py-1 px-2 text-light-emphasis">{props.rule.name}</dt>
      <dd>
          <div className="mb-1">
            <Markdown>{props.rule.doc}</Markdown>
          </div>
          <ExamplesSection
            slug={props.rule.name}
            examples={props.examples}
          ></ExamplesSection>
          <ParamsSection
            slug={props.rule.name}
            params={props.params}
          ></ParamsSection>
      </dd>
    </dl>
  );
}

function Markdown(props: {children?: string}) {
  if (!props.children) {
    return <></>
  }
  return (
    <ReactMarkdown
      children={props.children}
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              children={String(children).replace(/\n$/, '')}
              style={dracula as any}
              language={match[1]}
              PreTag="div"
              {...props}
            />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        }
      }}
    />
  )
}

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
              <Rule {...rule} key={rule.rule.name}/>
            )}
          </div>
        </ExamplesContext.Provider>
    </div>
  );
}

export default App;
