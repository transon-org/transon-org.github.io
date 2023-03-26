import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import {IDocsData} from './types'
// import { mockedDocs } from './mocks';

declare global {
  function transform(template: string, value: string): string;
  function init(data: string): void;
}

globalThis.init = (data) => {
  const docs = JSON.parse(data);
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App {...docs}/>
    </React.StrictMode>
  );
}

// init(mockedDocs);
